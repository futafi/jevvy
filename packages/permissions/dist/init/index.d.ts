import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
export declare const InitHarness: Schema.Literals<readonly ["opencode", "claude"]>;
export type InitHarness = typeof InitHarness.Type;
export type InitProvider = {
    readonly provider: "zen" | "typesafe" | "openrouter" | "vercel";
    readonly apiKey: Redacted.Redacted<string>;
} | {
    readonly provider: "laya";
    readonly endpoint?: string;
    readonly model?: string;
    readonly apiKey?: Redacted.Redacted<string>;
} | {
    readonly provider: "custom";
    readonly endpoint: string;
    readonly model: string;
    readonly apiKey?: Redacted.Redacted<string>;
};
export interface InitPlan {
    readonly harnesses: readonly InitHarness[];
    readonly provider: InitProvider;
}
export interface InitResult {
    readonly configPath: string;
    readonly harnesses: readonly InitHarness[];
    readonly provider: InitProvider["provider"];
}
declare const InitError_base: Schema.Class<InitError, Schema.TaggedStruct<"InitError", {
    readonly operation: Schema.Literals<readonly ["read-config", "parse-config", "write-config", "install-opencode", "install-claude-marketplace", "install-claude-plugin", "validate-plan", "preflight"]>;
    readonly message: Schema.String;
    readonly cause: Schema.optional<Schema.Defect>;
}>, import("effect/Cause").YieldableError>;
export declare class InitError extends InitError_base {
}
declare const InitPlatform_base: Context.ServiceClass<InitPlatform, "@jevvy/permissions/InitPlatform", {
    readonly readConfig: (path: string) => Effect.Effect<string | undefined, InitError>;
    readonly updateConfig: (path: string, edit: (raw: string | undefined) => Effect.Effect<string, InitError>) => Effect.Effect<void, InitError>;
    readonly installHarness: (harness: InitHarness) => Effect.Effect<void, InitError>;
    readonly inspectHarness: (harness: InitHarness) => Effect.Effect<string | undefined, InitError>;
}>;
export declare class InitPlatform extends InitPlatform_base {
    static readonly layer: Layer.Layer<InitPlatform, never, ChildProcessSpawner.ChildProcessSpawner | FileSystem.FileSystem | Path.Path>;
}
export declare const renderJevvyConfig: (existing: string | undefined, provider: InitProvider) => Effect.Effect<string, InitError, never>;
export declare const initializeJevvy: (plan: InitPlan, configPath: string) => Effect.Effect<InitResult, InitError, InitPlatform>;
export {};
