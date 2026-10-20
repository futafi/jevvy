import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as Terminal from "effect/Terminal";
import type * as Prompt from "effect/cli/Prompt";
import * as Controls from "./controls.ts";
import type { InitPlan, InitProvider, InitResult } from "./index.ts";
declare const LayaCheckpoint: Schema.Literals<readonly ["english", "multilingual", "typed-decisions"]>;
type LayaCheckpoint = typeof LayaCheckpoint.Type;
type LayaPrompts = {
    readonly text: (options: Controls.TextOptions) => Effect.Effect<string, Terminal.QuitError, Prompt.Environment>;
    readonly select: (options: Controls.SelectOptions<LayaCheckpoint>) => Effect.Effect<LayaCheckpoint, Terminal.QuitError, Prompt.Environment>;
    readonly confirm: (options: Controls.ConfirmOptions) => Effect.Effect<boolean, Terminal.QuitError, Prompt.Environment>;
    readonly password: (options: Controls.TextOptions) => Effect.Effect<Redacted.Redacted<string>, Terminal.QuitError, Prompt.Environment>;
};
interface LayaPromptDefaults {
    readonly endpoint?: string;
    readonly model?: LayaCheckpoint;
    readonly hasApiKey?: boolean;
    readonly urlNeedsReentry?: boolean;
}
export declare const harnessPrompt: {
    message: string;
    choices: ({
        value: "opencode";
        title: string;
        description: string;
        selected: boolean;
    } | {
        value: "claude";
        title: string;
        description: string;
        selected: boolean;
    })[];
    min: number;
};
export declare const endpointError: (value: string | undefined) => string | undefined;
export declare const layaEndpointError: (value: string | undefined) => string | undefined;
export declare const layaPromptDefaults: (existing: string | undefined) => LayaPromptDefaults;
export declare const showInitCancelled: Effect.Effect<void, never, Terminal.Terminal>;
export declare const promptLayaProvider: (prompts?: LayaPrompts | undefined, defaults?: LayaPromptDefaults | undefined) => Effect.Effect<{
    readonly provider: "laya";
    readonly endpoint?: string;
    readonly model?: string;
    readonly apiKey?: Redacted.Redacted<string>;
}, Terminal.QuitError, Prompt.Environment>;
export declare const initPlanSummary: (plan: InitPlan, configPath: string) => string;
export declare const layaNextSteps: (result: InitResult) => string;
export declare const opencodeNextSteps: () => string;
export declare const promptInitPlan: (configPath: string, existing?: string | undefined) => Effect.Effect<{
    harnesses: ("claude" | "opencode")[];
    provider: InitProvider;
} | undefined, Terminal.QuitError, Prompt.Environment>;
export declare const showInitProgress: Effect.Effect<void, never, Terminal.Terminal>;
export declare const confirmInitWarning: (message: string) => Effect.Effect<boolean, Terminal.QuitError, Prompt.Environment>;
export declare const showInitError: (message: string) => Effect.Effect<void, never, Terminal.Terminal>;
export declare const showInitResult: (result: InitResult) => Effect.Effect<void, never, Terminal.Terminal>;
export {};
