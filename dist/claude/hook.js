import * as Effect from "effect/Effect";
import { globalJevvyConfigPath, loadJevvyConfig } from "../config.js";
import { createPermissionReviewer } from "../engine.js";
import { createConfiguredProvider, providerApiKeyEnvironment, providerDisplayName, } from "../providers.js";
import { hasHostAsk } from "./ask-rules.js";
import { createClaudeEvaluate, decodeClaudeHookEvent, sessionStartOutput } from "./evaluate.js";
import { withReviewEnabled } from "../review-control.js";
const setupWarning = (summary, actions) => [
    "\n⚠ Jevvy setup required!",
    "",
    summary,
    ...actions,
    "",
    "Claude Code permissions are unchanged.",
].join("\n");
export const missingClaudeConfigurationMessage = (configPath) => setupWarning("Auto-approval is off because no provider is configured.", [
    "Run: npx @jevvy/permissions init",
    `Or configure ${configPath} manually.`,
]);
export const invalidClaudeConfigurationMessage = (configPath, detail) => setupWarning(`Auto-approval is off because ${configPath} is invalid: ${detail}.`, [
    "Fix the file before enabling auto-approval.",
]);
export const missingClaudeCredentialMessage = (provider, configPath) => setupWarning(`Auto-approval is off because ${providerDisplayName(provider)} has no credential available to Claude Code.`, [
    `Set ${providerApiKeyEnvironment(provider)} or add providers.${provider}.apiKey to ${configPath}.`,
    "Or run: npx @jevvy/permissions init",
]);
export const loadClaudeSetup = Effect.fn("ClaudeCode.loadSetup")(function* () {
    const configPath = globalJevvyConfigPath();
    const config = yield* loadJevvyConfig(configPath);
    if (config.kind === "invalid") {
        return {
            kind: "unavailable",
            message: invalidClaudeConfigurationMessage(configPath, config.message),
        };
    }
    if (config.kind === "unconfigured") {
        return { kind: "unavailable", message: missingClaudeConfigurationMessage(configPath) };
    }
    const selected = createConfiguredProvider(config.selection);
    if (selected === undefined) {
        if (config.selection.provider === "custom") {
            return {
                kind: "unavailable",
                message: setupWarning(`Auto-approval is off because the custom provider could not be initialized from ${configPath}.`, [
                    "Fix the file, or run: npx @jevvy/permissions init",
                ]),
            };
        }
        return {
            kind: "unavailable",
            message: missingClaudeCredentialMessage(config.selection.provider, configPath),
        };
    }
    const reviewer = yield* createPermissionReviewer(selected.client, {
        questions: config.kind === "custom-policy" ? config.questions : undefined,
        timeoutMs: config.timeoutMs,
    });
    return { kind: "ready", reviewer };
});
export const createClaudeHookHandler = (loadSetup, loadAsks, control) => Effect.fn("ClaudeCode.handleHookEvent")(function* (raw) {
    const event = decodeClaudeHookEvent(raw);
    if (event === undefined)
        return undefined;
    const review = Effect.gen(function* () {
        if (event.hook_event_name === "PermissionRequest") {
            const asks = yield* loadAsks(event.cwd);
            if (asks === undefined || hasHostAsk(event.tool_input.command, asks))
                return undefined;
        }
        const setup = yield* loadSetup().pipe(Effect.match({
            onFailure: () => undefined,
            onSuccess: (loaded) => loaded,
        }));
        if (setup === undefined)
            return undefined;
        if (event.hook_event_name === "SessionStart") {
            return sessionStartOutput(setup.kind === "unavailable" ? setup.message : undefined);
        }
        if (setup.kind === "unavailable")
            return undefined;
        return yield* createClaudeEvaluate(setup.reviewer)(event);
    });
    if (event.hook_event_name === "PermissionRequest" && control !== undefined) {
        return yield* withReviewEnabled(control, "claude", review);
    }
    return yield* review;
});
