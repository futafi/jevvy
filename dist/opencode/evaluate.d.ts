import type { PermissionEvaluation } from "@opencode/plugin/effect/permission";
import { Effect } from "effect";
import type { PermissionReviewer } from "../engine.ts";
import type { JevProviderFailure } from "../core.ts";
import type { ReviewControl } from "../review-control.ts";
export interface EvaluationEvent {
    readonly sessionID: PermissionEvaluation["sessionID"];
    readonly agent?: PermissionEvaluation["agent"];
    readonly source?: PermissionEvaluation["source"];
    readonly action: string;
    readonly resources: PermissionEvaluation["resources"];
    effect: PermissionEvaluation["effect"];
    message?: string;
}
export interface EvaluateOptions {
    readonly control?: Pick<ReviewControl, "read">;
    readonly inspect: (event: EvaluationEvent) => Effect.Effect<{
        readonly command: string;
        readonly explicitAsk: boolean;
    } | undefined>;
    readonly report?: (entry: {
        readonly effect: "allow" | "ask";
        readonly reason: "judged" | "unavailable" | "empty";
        readonly resources: number;
        readonly failure?: JevProviderFailure;
    }) => void;
}
export declare const createEvaluate: (reviewer: PermissionReviewer | undefined, options: EvaluateOptions) => ((event: EvaluationEvent) => Effect.Effect<void>);
