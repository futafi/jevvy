import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
import { applyEdits, modify, parse } from "jsonc-parser";
import { DEFAULT_LAYA_ENDPOINT, DEFAULT_LAYA_MODEL } from "../core.js";
import { LayaPolicy } from "../config.js";
import { createConfigFile } from "../config-file.js";
import { inspectHarness } from "./preflight.js";
import { harnessCommand } from "./harness-command.js";
const CONFIG_SCHEMA = "https://raw.githubusercontent.com/PanAchy/jevvy/main/config.schema.json";
const OPENCODE_PLUGIN = "@jevvy/permissions";
const CLAUDE_MARKETPLACE = "PanAchy/jevvy";
const CLAUDE_PLUGIN = "jevvy-permissions@jevvy";
export const InitHarness = Schema.Literals(["opencode", "claude"]);
export class InitError extends Schema.TaggedError()("InitError", {
    operation: Schema.Literals([
        "read-config",
        "parse-config",
        "write-config",
        "install-opencode",
        "install-claude-marketplace",
        "install-claude-plugin",
        "validate-plan",
        "preflight",
    ]),
    message: Schema.String,
    cause: Schema.optional(Schema.Defect()),
}) {
}
export class InitPlatform extends Context.Service()("@jevvy/permissions/InitPlatform") {
    static layer = Layer.effect(InitPlatform, Effect.gen(function* () {
        const fs = yield* FileSystem.FileSystem;
        const paths = yield* Path.Path;
        const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
        const readConfig = Effect.fn("InitPlatform.readConfig")(function* (path) {
            const exists = yield* fs.exists(path);
            if (!exists)
                return undefined;
            return yield* fs.readFileString(path);
        }, Effect.mapError((cause) => new InitError({
            operation: "read-config",
            message: "Jevvy configuration could not be read",
            cause,
        })));
        const updateConfig = Effect.fn("InitPlatform.updateConfig")(function* (path, edit) {
            const file = yield* createConfigFile(path).pipe(Effect.provide(Context.make(FileSystem.FileSystem, fs).pipe(Context.add(Path.Path, paths))));
            return yield* file.update((raw) => edit(raw).pipe(Effect.map((content) => ({ content, value: undefined })))).pipe(Effect.catchTag("ConfigFileError", (cause) => new InitError({
                operation: cause.operation === "read" ? "read-config" : "write-config",
                message: "Jevvy configuration could not be updated",
                cause,
            })));
        });
        const runInstaller = Effect.fn("InitPlatform.runInstaller")(function* (operation, failureMessage, command) {
            const code = yield* spawner.exitCode(command).pipe(Effect.mapError((cause) => new InitError({ operation, message: failureMessage, cause })));
            if (code !== ChildProcessSpawner.ExitCode(0)) {
                return yield* new InitError({
                    operation,
                    message: `${failureMessage} because the command exited with code ${code}`,
                });
            }
        });
        const installHarness = Effect.fn("InitPlatform.installHarness")(function* (harness) {
            if (harness === "opencode") {
                return yield* runInstaller("install-opencode", "OpenCode could not install the Jevvy plugin", harnessCommand("opencode", ["plugin", "add", OPENCODE_PLUGIN], { inherit: true }));
            }
            yield* runInstaller("install-claude-marketplace", "Claude Code could not add the Jevvy marketplace", harnessCommand("claude", ["plugin", "marketplace", "add", "--scope", "user", CLAUDE_MARKETPLACE], { inherit: true }));
            yield* runInstaller("install-claude-plugin", "Claude Code could not install the Jevvy plugin", harnessCommand("claude", ["plugin", "install", "--scope", "user", CLAUDE_PLUGIN], { inherit: true }));
        });
        return InitPlatform.of({ readConfig, updateConfig, installHarness,
            inspectHarness: (harness) => inspectHarness(harness).pipe(Effect.provideService(ChildProcessSpawner.ChildProcessSpawner, spawner), Effect.mapError((error) => new InitError({ operation: "preflight", message: error.message }))),
        });
    }));
}
const providerSettings = (provider) => {
    const apiKey = provider.apiKey === undefined ? undefined : Redacted.value(provider.apiKey);
    if (provider.provider === "custom") {
        return apiKey === undefined
            ? { endpoint: provider.endpoint, model: provider.model }
            : { endpoint: provider.endpoint, model: provider.model, apiKey };
    }
    if (provider.provider === "laya") {
        const settings = {};
        if (provider.endpoint !== undefined)
            settings.endpoint = provider.endpoint;
        if (provider.model !== undefined)
            settings.model = provider.model;
        if (apiKey !== undefined)
            settings.apiKey = apiKey;
        return Object.keys(settings).length === 0 ? undefined : settings;
    }
    return { apiKey: Redacted.value(provider.apiKey) };
};
const formattingOptions = {
    insertSpaces: true,
    tabSize: 2,
    eol: "\n",
};
const ConfigRoot = Schema.Record(Schema.String, Schema.Unknown);
const updateJsonc = (raw, path, value) => applyEdits(raw, modify(raw, [...path], value, { formattingOptions }));
export const renderJevvyConfig = Effect.fn("Init.renderJevvyConfig")(function* (existing, provider) {
    const settings = providerSettings(provider);
    if (existing === undefined) {
        const document = settings === undefined
            ? { $schema: CONFIG_SCHEMA, provider: provider.provider }
            : {
                $schema: CONFIG_SCHEMA,
                provider: provider.provider,
                providers: { [provider.provider]: settings },
            };
        return `${JSON.stringify(document, null, 2)}\n`;
    }
    const errors = [];
    const decoded = parse(existing, errors, { allowTrailingComma: true, disallowComments: false });
    if (errors.length > 0) {
        return yield* new InitError({
            operation: "parse-config",
            message: "Existing jevvy.jsonc is not valid JSONC",
        });
    }
    const document = yield* Schema.decodeUnknownEffect(ConfigRoot)(decoded).pipe(Effect.mapError((cause) => new InitError({
        operation: "parse-config",
        message: "Existing jevvy.jsonc must contain an object",
        cause,
    })));
    const hasQuestions = Schema.is(ConfigRoot)(document.permissions) && "questions" in document.permissions;
    if (hasQuestions && (provider.provider === "laya" || document.provider === "laya")) {
        const message = document.provider === "laya" && provider.provider !== "laya"
            ? "Move the old top-level Laya questions to providers.laya.policy before switching providers; your config was not changed"
            : "Move or remove top-level permission questions before selecting Laya; its policy belongs under providers.laya.policy. Your config was not changed";
        return yield* new InitError({
            operation: "validate-plan",
            message,
        });
    }
    let preserveLayaPolicy = false;
    if (provider.provider === "laya") {
        const providers = Schema.is(ConfigRoot)(document.providers) ? document.providers : undefined;
        const previous = Schema.is(ConfigRoot)(providers?.laya) ? providers.laya : undefined;
        if (previous !== undefined && "policy" in previous) {
            if (!Schema.is(LayaPolicy)(previous.policy)) {
                return yield* new InitError({
                    operation: "validate-plan",
                    message: "Existing Laya policy is malformed; fix it before running init. Your config was not changed",
                });
            }
            const priorEndpoint = previous.endpoint ?? DEFAULT_LAYA_ENDPOINT;
            const nextEndpoint = provider.endpoint ?? DEFAULT_LAYA_ENDPOINT;
            const priorModel = previous.model ?? DEFAULT_LAYA_MODEL;
            const nextModel = provider.model ?? DEFAULT_LAYA_MODEL;
            if (priorEndpoint !== nextEndpoint || priorModel !== nextModel) {
                return yield* new InitError({
                    operation: "validate-plan",
                    message: "Laya server or checkpoint changed. Move the existing policy aside and recalibrate before running init; your config was not changed",
                });
            }
            preserveLayaPolicy = true;
        }
    }
    let updated = updateJsonc(existing, ["$schema"], CONFIG_SCHEMA);
    updated = updateJsonc(updated, ["provider"], provider.provider);
    if (provider.provider === "laya" && preserveLayaPolicy) {
        for (const field of ["endpoint", "model", "apiKey"]) {
            updated = updateJsonc(updated, ["providers", "laya", field], settings?.[field]);
        }
    }
    else if (provider.provider === "zen" || provider.provider === "typesafe" || provider.provider === "openrouter" || provider.provider === "vercel") {
        updated = updateJsonc(updated, ["providers", provider.provider, "apiKey"], settings?.apiKey);
    }
    else {
        updated = updateJsonc(updated, ["providers", provider.provider], provider.provider === "laya" ? settings ?? {} : settings);
    }
    return updated.endsWith("\n") ? updated : `${updated}\n`;
});
export const initializeJevvy = Effect.fn("Init.initializeJevvy")(function* (plan, configPath) {
    if (plan.harnesses.length === 0) {
        return yield* new InitError({
            operation: "validate-plan",
            message: "Select at least one harness",
        });
    }
    const platform = yield* InitPlatform;
    yield* platform.updateConfig(configPath, (existing) => renderJevvyConfig(existing, plan.provider));
    yield* Effect.forEach(plan.harnesses, platform.installHarness, { discard: true });
    return {
        configPath,
        harnesses: plan.harnesses,
        provider: plan.provider.provider,
    };
});
