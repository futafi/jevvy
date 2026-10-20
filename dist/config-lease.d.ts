import { Effect, Schema } from "effect";
declare const ConfigLeaseError_base: Schema.Class<ConfigLeaseError, Schema.TaggedStruct<"ConfigLeaseError", {
    readonly operation: Schema.Literals<readonly ["busy", "write"]>;
}>, import("effect/Cause").YieldableError>;
export declare class ConfigLeaseError extends ConfigLeaseError_base {
}
export declare const acquireConfigLease: (path: string) => Effect.Effect<{
    replace: (temporary: string) => Effect.Effect<void, ConfigLeaseError, never>;
}, ConfigLeaseError, import("effect/Scope").Scope>;
export {};
