import { Effect, Schema } from "effect";
import { NoulAnswer } from "./core.ts";
import type { JevClient, JevProviderFailure } from "./core.ts";
import { ApprovalQuestions } from "./questions.ts";
export type PermissionEffect = "allow" | "ask";
export interface ResourceJudgment {
    readonly resource: string;
    readonly effect: PermissionEffect;
    readonly model: string;
    readonly answers: Readonly<Record<string, NoulAnswer>>;
}
export type PermissionReview = {
    readonly effect: "allow";
    readonly judgments: readonly ResourceJudgment[];
} | {
    readonly effect: "ask";
    readonly reason: "judged" | "unavailable" | "empty";
    readonly judgments: readonly ResourceJudgment[];
    readonly failure?: JevProviderFailure;
};
export interface PermissionRequest {
    readonly action: string;
    readonly resources: readonly string[];
}
export interface PermissionReviewer {
    readonly review: (request: PermissionRequest) => Effect.Effect<PermissionReview>;
}
export interface PermissionReviewerOptions {
    readonly questions?: ApprovalQuestions;
    readonly timeoutMs?: number;
    readonly cacheCapacity?: number;
}
declare const ReviewerConfigurationError_base: Schema.Class<ReviewerConfigurationError, Schema.TaggedStruct<"ReviewerConfigurationError", {
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class ReviewerConfigurationError extends ReviewerConfigurationError_base {
}
export declare const permissionEffectOf: (answers: Readonly<Record<string, NoulAnswer>>, questions: ApprovalQuestions) => PermissionEffect;
export declare const createPermissionReviewer: (client: JevClient, options?: PermissionReviewerOptions | undefined) => Effect.Effect<PermissionReviewer, ReviewerConfigurationError, never>;
export {};
