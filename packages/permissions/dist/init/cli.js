import * as Effect from "effect/Effect";
import * as Command from "effect/cli/Command";
import { globalJevvyConfigPath } from "../config.js";
import { initializeJevvy, InitPlatform } from "./index.js";
import { promptInitPlan, showInitError, showInitProgress, showInitResult, confirmInitWarning, showInitCancelled, } from "./prompt.js";
const terminalFrontend = {
    prompt: promptInitPlan,
    showProgress: showInitProgress,
    showError: showInitError,
    showResult: showInitResult,
    confirmWarning: confirmInitWarning,
    showCancelled: showInitCancelled,
};
export const executeInit = Effect.fn("InitCli.execute")(function* (frontend, configPath) {
    const platform = yield* InitPlatform;
    const existing = yield* platform.readConfig(configPath);
    const plan = yield* frontend.prompt(configPath, existing);
    if (plan === undefined)
        return 0;
    for (const harness of plan.harnesses) {
        const warning = yield* platform.inspectHarness(harness);
        if (warning !== undefined) {
            const proceed = yield* frontend.confirmWarning(warning);
            if (!proceed)
                return 0;
        }
    }
    yield* frontend.showProgress;
    const result = yield* initializeJevvy(plan, configPath);
    yield* frontend.showResult(result);
    return 0;
}, (effect, frontend) => effect.pipe(Effect.catchTag("QuitError", () => frontend.showCancelled.pipe(Effect.as(0))), Effect.catch((error) => frontend.showError(error.message).pipe(Effect.as(1)))));
const runInit = Effect.fn("InitCli.run")(function* () {
    const code = yield* executeInit(terminalFrontend, globalJevvyConfigPath());
    if (code !== 0)
        process.exitCode = code;
});
const initCommand = Command.make("init", {}, runInit).pipe(Command.withDescription("Configure Jevvy Permissions and install it in selected agent harnesses"));
export const jevvyCommand = Command.make("jevvy").pipe(Command.withDescription("Configure Jevvy Permissions"), Command.withSubcommands([initCommand]));
