import { Effect, Schema } from "effect";
import type { ReviewSnapshot } from "./review-state.ts";
export { ReviewSnapshot } from "./review-state.ts";
export declare const ReviewHarness: Schema.Literals<readonly ["opencode", "claude"]>;
export type ReviewHarness = typeof ReviewHarness.Type;
export declare const HarnessReviewConfig: Schema.Struct<{
    readonly enabled: Schema.optionalKey<Schema.Boolean>;
}>;
declare const ReviewControlError_base: Schema.Class<ReviewControlError, Schema.TaggedStruct<"ReviewControlError", {
    readonly operation: Schema.Literals<readonly ["read", "parse", "busy", "write"]>;
}>, import("effect/Cause").YieldableError>;
export declare class ReviewControlError extends ReviewControlError_base {
}
export declare const createReviewControl: (path: string, providedFile?: {
    read: () => Effect.Effect<string | undefined, import("./config-file.ts").ConfigFileError, never>;
    update: <A, E, R>(edit: (raw: string | undefined) => Effect.Effect<{
        readonly content: string;
        readonly value: A;
    }, E, R>) => Effect.Effect<A, E | import("./config-file.ts").ConfigFileError, Exclude<R, import("effect/Scope").Scope>>;
} | undefined) => Effect.Effect<{
    read: (harness: "claude" | "opencode") => Effect.Effect<ReviewSnapshot, ReviewControlError, never>;
    change: (harness: "claude" | "opencode", enabled?: boolean | undefined) => Effect.Effect<{
        enabled: boolean;
    }, ReviewControlError, never>;
}, never, import("effect/FileSystem").FileSystem | import("effect/Path").Path>;
export type ReviewControl = Effect.Success<ReturnType<typeof createReviewControl>>;
export declare const withReviewEnabled: <A, E, R>(control: Pick<{
    read: (harness: "claude" | "opencode") => Effect.Effect<ReviewSnapshot, ReviewControlError, never>;
    change: (harness: "claude" | "opencode", enabled?: boolean | undefined) => Effect.Effect<{
        enabled: boolean;
    }, ReviewControlError, never>;
}, "read">, harness: "claude" | "opencode", review: Effect.Effect<A, E, R>) => Effect.Effect<A | undefined, E, R>;
