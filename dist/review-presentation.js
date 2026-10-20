import { Context, Effect, Layer, Schedule, Schema, Semaphore } from "effect";
import { createReviewIndicator } from "./review-indicator.js";
export class ReviewPresentationError extends Schema.TaggedError()("ReviewPresentationError", {
    message: Schema.String,
}) {
}
export class ReviewPresentation extends Context.Service()("@jevvy/permissions/ReviewPresentation") {
    static layer = (host) => Layer.effect(ReviewPresentation, Effect.gen(function* () {
        const mutex = yield* Semaphore.make(1);
        const refreshing = yield* Semaphore.make(1);
        const indicator = yield* createReviewIndicator(host.render);
        let disposed = false;
        let reportedProblem;
        const report = (problem) => {
            if (disposed || problem === reportedProblem)
                return;
            reportedProblem = problem;
            if (problem !== undefined)
                host.report(problem);
        };
        const operate = Effect.fn("ReviewPresentation.operate")(function* (operation) {
            if (disposed)
                return;
            const state = yield* (operation === "toggle" ? Effect.uninterruptible(host.toggle) : host.read).pipe(Effect.match({
                onSuccess: (status) => status,
                onFailure: (error) => ({ problem: error.message }),
            }));
            if (disposed)
                return;
            yield* indicator.update(state.enabled);
            report(state.problem);
        }, mutex.withPermits(1));
        const refresh = Effect.fn("ReviewPresentation.refresh")(function* () {
            if (disposed)
                return;
            yield* operate("read");
        }, refreshing.withPermitsIfAvailable(1), Effect.asVoid);
        yield* refresh().pipe(Effect.repeat(Schedule.spaced("2 seconds")), Effect.forkScoped);
        yield* Effect.addFinalizer(() => Effect.sync(() => {
            disposed = true;
        }));
        return ReviewPresentation.of({ refresh: refresh(), toggle: operate("toggle") });
    }));
}
