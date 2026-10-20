import * as Effect from "effect/Effect";
import type { PermissionReviewer } from "../engine.ts";
import type { BuiltInProvider } from "../providers.ts";
import type { ClaudeHookOutput } from "./evaluate.ts";
import type { ReviewControl } from "../review-control.ts";
export type ClaudeReviewerSetup = {
    readonly kind: "ready";
    readonly reviewer: PermissionReviewer;
} | {
    readonly kind: "unavailable";
    readonly message: string;
};
export type ClaudeSetupLoader<E, R = never> = () => Effect.Effect<ClaudeReviewerSetup, E, R>;
export type ClaudeAskLoader<R = never> = (cwd: string) => Effect.Effect<readonly string[] | undefined, never, R>;
export declare const missingClaudeConfigurationMessage: (configPath: string) => string;
export declare const invalidClaudeConfigurationMessage: (configPath: string, detail: string) => string;
export declare const missingClaudeCredentialMessage: (provider: BuiltInProvider, configPath: string) => string;
export declare const loadClaudeSetup: () => Effect.Effect<{
    readonly kind: "unavailable";
    readonly message: string;
    readonly reviewer?: undefined;
} | {
    readonly message?: undefined;
    readonly kind: "ready";
    readonly reviewer: PermissionReviewer;
}, import("../engine.ts").ReviewerConfigurationError, import("effect/FileSystem").FileSystem>;
export declare const createClaudeHookHandler: <E, R, AsksR>(loadSetup: ClaudeSetupLoader<E, R>, loadAsks: ClaudeAskLoader<AsksR>, control?: Pick<ReviewControl, "read">) => ((raw: string) => Effect.Effect<ClaudeHookOutput | undefined, never, R | AsksR>);
