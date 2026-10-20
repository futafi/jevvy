import { Effect } from "effect";
import { withReviewEnabled } from "../review-control.js";
export const createEvaluate = (reviewer, options) => Effect.fn("OpenCode.evaluatePermission")(function* (event) {
    if (event.effect !== "ask" || event.action !== "shell" || reviewer === undefined)
        return;
    const reviewCommand = Effect.gen(function* () {
        const inspection = yield* options.inspect(event);
        if (inspection === undefined) {
            options.report?.({ effect: "ask", reason: "unavailable", resources: event.resources.length });
            return undefined;
        }
        if (inspection.explicitAsk)
            return undefined;
        return yield* reviewer.review({ action: event.action, resources: [inspection.command] });
    });
    const review = yield* options.control === undefined
        ? reviewCommand
        : withReviewEnabled(options.control, "opencode", reviewCommand);
    if (review === undefined)
        return;
    const reason = review.effect === "ask" ? review.reason : "judged";
    if (review.effect === "ask" && review.failure !== undefined) {
        options.report?.({ effect: review.effect, reason, resources: 1, failure: review.failure });
    }
    else {
        options.report?.({ effect: review.effect, reason, resources: 1 });
    }
    if (review.effect === "allow")
        event.effect = "allow";
});
