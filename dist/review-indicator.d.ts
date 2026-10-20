import { Effect } from "effect";
export interface ReviewIndicatorState {
    readonly enabled: boolean | undefined;
    readonly dimmed: boolean;
}
export declare const createReviewIndicator: (render: (state: ReviewIndicatorState) => void) => Effect.Effect<{
    update: (next: boolean | undefined) => Effect.Effect<void, never, never>;
}, never, import("effect/Scope").Scope>;
