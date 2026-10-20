import { Cache, Clock, Duration, Effect, Exit, Ref, Schema } from "effect";
import { isJevProviderError, JevProviderFailure as JevProviderFailureSchema, NoulAnswer, providerFailureOf, } from "./core.js";
import { ApprovalQuestions, defaultApprovalQuestions, toNoulQuestions } from "./questions.js";
const RATE_LIMIT_COOLDOWN_MS = 60_000;
const EXHAUSTED_COOLDOWN_MS = 5 * 60_000;
const cooldownMs = (failure) => {
    if (failure.retryAfterMs !== undefined)
        return failure.retryAfterMs;
    if (failure.kind === "rate-limited")
        return RATE_LIMIT_COOLDOWN_MS;
    if (failure.kind === "credits-exhausted" || failure.kind === "quota-exhausted") {
        return EXHAUSTED_COOLDOWN_MS;
    }
    return undefined;
};
class JudgmentUnavailable extends Schema.TaggedError()("JudgmentUnavailable", {
    message: Schema.String,
    failure: Schema.optional(JevProviderFailureSchema),
}) {
}
export class ReviewerConfigurationError extends Schema.TaggedError()("ReviewerConfigurationError", { message: Schema.String }) {
}
const validAnswer = Schema.is(NoulAnswer);
export const permissionEffectOf = (answers, questions) => {
    let effect = "allow";
    for (const [key, question] of Object.entries(questions)) {
        const answer = answers[key];
        if (!validAnswer(answer))
            throw new JudgmentUnavailable({ message: `missing valid answer for ${key}` });
        if (answer.noul > question.threshold)
            effect = "ask";
    }
    return effect;
};
const judgeResult = (resource, result, questions) => {
    if (result.model.trim().length === 0)
        throw new JudgmentUnavailable({ message: "missing model identifier" });
    return {
        resource,
        effect: permissionEffectOf(result.answers, questions),
        model: result.model,
        answers: result.answers,
    };
};
const validateQuestions = (questions) => Schema.decodeUnknownEffect(ApprovalQuestions, { onExcessProperty: "error" })(questions).pipe(Effect.asVoid, Effect.mapError(() => new ReviewerConfigurationError({ message: "invalid approval questions" })));
const cacheKey = (action, resource) => `${action.length}:${action}${resource}`;
const unavailable = (error) => {
    if (error instanceof JudgmentUnavailable)
        return error;
    if (isJevProviderError(error)) {
        return new JudgmentUnavailable({ message: error.message, failure: providerFailureOf(error) });
    }
    return new JudgmentUnavailable({ message: String(error) });
};
export const createPermissionReviewer = Effect.fn("PermissionReviewer.create")(function* (client, options = {}) {
    const questions = options.questions ?? defaultApprovalQuestions;
    const timeoutMs = options.timeoutMs ?? 5_000;
    const capacity = options.cacheCapacity ?? 512;
    yield* validateQuestions(questions);
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return yield* new ReviewerConfigurationError({ message: "timeoutMs must be positive" });
    }
    if (!Number.isInteger(capacity) || capacity <= 0) {
        return yield* new ReviewerConfigurationError({ message: "cacheCapacity must be a positive integer" });
    }
    const providerCooldown = yield* Ref.make(undefined);
    const noulQuestions = toNoulQuestions(questions);
    const activeProviderFailure = Effect.fn("PermissionReviewer.activeProviderFailure")(function* () {
        const now = yield* Clock.currentTimeMillis;
        return yield* Ref.modify(providerCooldown, (current) => {
            if (current === undefined || current.untilMs <= now)
                return [undefined, undefined];
            return [current.failure, current];
        });
    });
    const recordProviderCooldown = Effect.fn("PermissionReviewer.recordProviderCooldown")(function* (failure) {
        const duration = cooldownMs(failure);
        if (duration === undefined)
            return;
        const now = yield* Clock.currentTimeMillis;
        const next = { failure, untilMs: now + duration };
        yield* Ref.update(providerCooldown, (current) => current === undefined || current.untilMs < next.untilMs ? next : current);
    });
    const judgeResource = Effect.fn("PermissionReviewer.judgeResource")(function* (key) {
        const separator = key.indexOf(":");
        const actionLength = Number(key.slice(0, separator));
        const payload = key.slice(separator + 1);
        const action = payload.slice(0, actionLength);
        const resource = payload.slice(actionLength);
        const disabled = yield* activeProviderFailure();
        if (disabled !== undefined) {
            return yield* new JudgmentUnavailable({ message: disabled.message, failure: disabled });
        }
        return yield* client.evaluate({ state: { action, resource }, questions: noulQuestions }).pipe(Effect.timeout(timeoutMs), Effect.flatMap((result) => Effect.try({
            try: () => judgeResult(resource, result, questions),
            catch: (cause) => unavailable(cause instanceof Error ? cause : new Error(String(cause))),
        })), Effect.mapError(unavailable), Effect.tapError((error) => error.failure === undefined
            ? Effect.succeed(undefined)
            : recordProviderCooldown(error.failure)));
    });
    const cache = yield* Cache.makeWith(judgeResource, {
        capacity,
        timeToLive: (exit) => Exit.isSuccess(exit) ? Duration.infinity : Duration.zero,
    });
    return {
        review: Effect.fn("PermissionReviewer.review")(function* (request) {
            if (request.resources.length === 0)
                return { effect: "ask", reason: "empty", judgments: [] };
            const disabled = yield* activeProviderFailure();
            if (disabled !== undefined) {
                return { effect: "ask", reason: "unavailable", judgments: [], failure: disabled };
            }
            const judgments = [];
            for (const resource of request.resources) {
                const result = yield* Cache.get(cache, cacheKey(request.action, resource)).pipe(Effect.match({
                    onFailure: (error) => ({ kind: "failure", error }),
                    onSuccess: (judgment) => ({ kind: "success", judgment }),
                }));
                if (result.kind === "failure") {
                    if (result.error.failure !== undefined) {
                        return {
                            effect: "ask",
                            reason: "unavailable",
                            judgments,
                            failure: result.error.failure,
                        };
                    }
                    return {
                        effect: "ask",
                        reason: "unavailable",
                        judgments,
                    };
                }
                judgments.push(result.judgment);
                if (result.judgment.effect === "ask")
                    return { effect: "ask", reason: "judged", judgments };
            }
            return { effect: "allow", judgments };
        }),
    };
});
