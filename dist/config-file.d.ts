import { Effect, FileSystem, Path, Schema } from "effect";
declare const ConfigFileError_base: Schema.Class<ConfigFileError, Schema.TaggedStruct<"ConfigFileError", {
    readonly operation: Schema.Literals<readonly ["read", "busy", "write"]>;
}>, import("effect/Cause").YieldableError>;
export declare class ConfigFileError extends ConfigFileError_base {
}
type Prepare = (temporary: string, content: string) => Effect.Effect<void, ConfigFileError>;
export declare const createConfigFile: (path: string, prepare?: Prepare | undefined) => Effect.Effect<{
    read: () => Effect.Effect<string | undefined, ConfigFileError, never>;
    update: <A, E, R>(edit: (raw: string | undefined) => Effect.Effect<{
        readonly content: string;
        readonly value: A;
    }, E, R>) => Effect.Effect<A, E | ConfigFileError, Exclude<R, import("effect/Scope").Scope>>;
}, never, FileSystem.FileSystem | Path.Path>;
export type ConfigFile = Effect.Success<ReturnType<typeof createConfigFile>>;
export {};
