import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
declare const PreflightError_base: Schema.Class<PreflightError, Schema.TaggedStruct<"PreflightError", {
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class PreflightError extends PreflightError_base {
}
export declare const opencodeCompatibilityWarning: (output: string) => string | undefined;
export declare const inspectHarness: (harness: "claude" | "opencode") => Effect.Effect<string | undefined, PreflightError, ChildProcessSpawner.ChildProcessSpawner>;
export {};
