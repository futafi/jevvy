import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { ApprovalQuestions } from "./questions.ts";
import type { BuiltInProvider, ProviderSelection } from "./providers.ts";
export { globalJevvyConfigPath } from "./config-path.ts";
export declare const LayaPolicy: Schema.Struct<{
    readonly checkpoint: Schema.Literals<readonly ["english", "multilingual", "typed-decisions"]>;
    readonly questions: Schema.$Record<Schema.NonEmptyString, Schema.Struct<{
        readonly type: Schema.Literal<"noul">;
        readonly instructions: Schema.NonEmptyString;
        readonly criteria: Schema.optionalKey<Schema.Struct<{
            readonly false: Schema.NonEmptyString;
            readonly true: Schema.NonEmptyString;
        }>>;
        readonly threshold: Schema.Finite;
    }>>;
}>;
export interface LayaPolicy extends Schema.Schema.Type<typeof LayaPolicy> {
}
export type JevvyConfig = {
    readonly kind: "unconfigured";
} | {
    readonly kind: "shipped-policy";
    readonly selection: ProviderSelection;
    readonly timeoutMs: number;
} | {
    readonly kind: "custom-policy";
    readonly selection: ProviderSelection;
    readonly questions: ApprovalQuestions;
    readonly timeoutMs: number;
} | {
    readonly kind: "invalid";
    readonly message: string;
};
export declare const loadJevvyConfig: (path?: string, environment?: ConfigProvider.ConfigProvider) => Effect.Effect<{
    kind: "unconfigured";
    selection?: undefined;
    questions?: undefined;
    timeoutMs?: undefined;
} | {
    kind: "custom-policy";
    selection: {
        readonly provider: "laya";
        readonly endpoint?: string;
        readonly model?: string;
        readonly apiKey?: Redacted.Redacted<string>;
    };
    questions: {
        readonly [x: string]: {
            readonly type: "noul";
            readonly instructions: string;
            readonly criteria?: {
                readonly false: string;
                readonly true: string;
            } | undefined;
            readonly threshold: number;
        };
    };
    timeoutMs: number;
} | {
    kind: "shipped-policy";
    selection: {
        readonly provider: Exclude<BuiltInProvider, "laya">;
        readonly model?: string;
        readonly apiKey?: Redacted.Redacted<string>;
        readonly opencodeCredential?: string;
    } | {
        readonly provider: "custom";
        readonly endpoint: string;
        readonly model: string;
        readonly apiKey?: Redacted.Redacted<string>;
    };
    timeoutMs: number;
    questions?: undefined;
} | {
    kind: "custom-policy";
    selection: {
        readonly provider: Exclude<BuiltInProvider, "laya">;
        readonly model?: string;
        readonly apiKey?: Redacted.Redacted<string>;
        readonly opencodeCredential?: string;
    } | {
        readonly provider: "custom";
        readonly endpoint: string;
        readonly model: string;
        readonly apiKey?: Redacted.Redacted<string>;
    };
    questions: {
        readonly [x: string]: {
            readonly type: "noul";
            readonly instructions: string;
            readonly criteria?: {
                readonly false: string;
                readonly true: string;
            } | undefined;
            readonly threshold: number;
        };
    };
    timeoutMs: number;
} | {
    kind: "invalid";
    message: string;
}, never, FileSystem.FileSystem>;
