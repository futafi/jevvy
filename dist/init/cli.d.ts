import * as Effect from "effect/Effect";
import * as Terminal from "effect/Terminal";
import * as Command from "effect/cli/Command";
import type * as Prompt from "effect/cli/Prompt";
import { InitPlatform } from "./index.ts";
import type { InitPlan, InitResult } from "./index.ts";
export interface InitFrontend<R = never> {
    readonly prompt: (configPath: string, existing: string | undefined) => Effect.Effect<InitPlan | undefined, Terminal.QuitError, R>;
    readonly showProgress: Effect.Effect<void, never, R>;
    readonly showError: (message: string) => Effect.Effect<void, never, R>;
    readonly showResult: (result: InitResult) => Effect.Effect<void, never, R>;
    readonly confirmWarning: (message: string) => Effect.Effect<boolean, Terminal.QuitError, R>;
    readonly showCancelled: Effect.Effect<void, never, R>;
}
export declare const executeInit: <R>(frontend: InitFrontend<R>, configPath: string) => Effect.Effect<number, never, R | InitPlatform>;
export declare const jevvyCommand: Command.Command<"jevvy", {}, {}, never, InitPlatform | Prompt.Environment>;
