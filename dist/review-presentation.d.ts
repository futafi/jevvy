import { Context, Effect, Layer, Schema } from "effect";
import type { ReviewIndicatorState } from "./review-indicator.ts";
export interface ReviewStatus {
    readonly enabled?: boolean;
    readonly problem?: string;
}
declare const ReviewPresentationError_base: Schema.Class<ReviewPresentationError, Schema.TaggedStruct<"ReviewPresentationError", {
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class ReviewPresentationError extends ReviewPresentationError_base {
}
export interface ReviewPresentationHost {
    readonly read: Effect.Effect<ReviewStatus, ReviewPresentationError>;
    readonly toggle: Effect.Effect<ReviewStatus, ReviewPresentationError>;
    readonly render: (state: ReviewIndicatorState) => void;
    readonly report: (message: string) => void;
}
declare const ReviewPresentation_base: Context.ServiceClass<ReviewPresentation, "@jevvy/permissions/ReviewPresentation", {
    readonly refresh: Effect.Effect<void>;
    readonly toggle: Effect.Effect<void>;
}>;
export declare class ReviewPresentation extends ReviewPresentation_base {
    static readonly layer: (host: ReviewPresentationHost) => Layer.Layer<ReviewPresentation, never, never>;
}
export {};
