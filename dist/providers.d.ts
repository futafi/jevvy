import { JevProvider } from "./core.ts";
import type { JevClient, JevProvider as JevProviderType } from "./core.ts";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
export declare const BuiltInProvider: Schema.Literals<readonly ["zen", "typesafe", "openrouter", "vercel", "laya"]>;
export type BuiltInProvider = Schema.Schema.Type<typeof BuiltInProvider>;
export type ProviderSelection = {
    readonly provider: Exclude<BuiltInProvider, "laya">;
    readonly model?: string;
    readonly apiKey?: Redacted.Redacted<string>;
    readonly opencodeCredential?: string;
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
export declare const providerDisplayName: (provider: JevProviderType) => string;
export declare const providerApiKeyEnvironment: (provider: BuiltInProvider) => string;
export interface SelectedProvider {
    readonly provider: JevProviderType;
    readonly model: string;
    readonly client: JevClient;
    readonly redact: (text: string) => string;
}
export declare const shippedPolicyProvenance: ({ provider, model }: Pick<SelectedProvider, "provider" | "model">) => "calibrated-defaults" | "shipped-defaults-unverified";
export declare const createBuiltInProvider: (provider: Exclude<BuiltInProvider, "laya">, apiKey: string, model?: string) => SelectedProvider;
export declare const createConfiguredProvider: (selection: ProviderSelection) => SelectedProvider | undefined;
export { JevProvider };
