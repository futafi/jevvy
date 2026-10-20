import * as Effect from "effect/Effect";
import type { ProviderSelection } from "../providers.ts";
type PresetSelection = Extract<ProviderSelection, {
    provider: "zen" | "typesafe" | "openrouter" | "vercel";
}>;
interface StoredCredential {
    readonly type: string;
    readonly key?: string;
}
export declare const apiKeyFromCredential: (credential: StoredCredential | undefined) => string | undefined;
export declare const withOpenCodeCredential: <E>(selection: PresetSelection, resolve: (integrationID: string) => Effect.Effect<string | undefined, E>) => Effect.Effect<PresetSelection>;
export {};
