import type { Plugin } from "@opencode/plugin/effect";
import type { CommandInvocation } from "@opencode/plugin/effect/command";
import { Effect, Schema } from "effect";
import type { ReviewControlError, ReviewSnapshot } from "../review-control.ts";
declare const ReviewCommandError_base: Schema.Class<ReviewCommandError, Schema.TaggedStruct<"ReviewCommandError", {
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class ReviewCommandError extends ReviewCommandError_base {
}
export declare const createReviewCommand: (toggle: Effect.Effect<ReviewSnapshot, ReviewControlError>, session: Pick<Plugin.Context["session"], "synthetic">, problem: () => string | undefined) => {
    name: string;
    description: string;
    execute: (input: CommandInvocation) => Effect.Effect<void, ReviewCommandError, never>;
};
export {};
