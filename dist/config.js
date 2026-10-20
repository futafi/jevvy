import * as Config from "effect/Config";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { parse } from "jsonc-parser";
import { DEFAULT_LAYA_MODEL, JevProvider } from "./core.js";
import { ApprovalQuestions } from "./questions.js";
import { HarnessReviewConfig } from "./review-control.js";
import { providerApiKeyEnvironment } from "./providers.js";
import { globalJevvyConfigPath } from "./config-path.js";
export { globalJevvyConfigPath } from "./config-path.js";
const SystemOnePresetSettings = Schema.Struct({
    apiKey: Schema.optionalKey(Schema.NonEmptyString),
    model: Schema.optionalKey(Schema.NonEmptyString),
    opencodeCredential: Schema.optionalKey(Schema.NonEmptyString),
});
const CustomProviderSchema = Schema.Struct({
    endpoint: Schema.URLFromString,
    model: Schema.NonEmptyString,
    apiKey: Schema.optionalKey(Schema.NonEmptyString),
});
export const LayaPolicy = Schema.Struct({
    checkpoint: Schema.Literals(["english", "multilingual", "typed-decisions"]),
    questions: ApprovalQuestions,
});
const LayaProviderSchema = Schema.Struct({
    endpoint: Schema.optionalKey(Schema.URLFromString),
    model: Schema.optionalKey(Schema.Literals(["english", "multilingual", "typed-decisions"])),
    apiKey: Schema.optionalKey(Schema.NonEmptyString),
    policy: Schema.optionalKey(LayaPolicy),
});
const JevvyConfigSchema = Schema.Struct({
    $schema: Schema.optionalKey(Schema.String),
    provider: JevProvider,
    providers: Schema.optionalKey(Schema.Struct({
        zen: Schema.optionalKey(SystemOnePresetSettings),
        typesafe: Schema.optionalKey(SystemOnePresetSettings),
        openrouter: Schema.optionalKey(SystemOnePresetSettings),
        vercel: Schema.optionalKey(SystemOnePresetSettings),
        laya: Schema.optionalKey(LayaProviderSchema),
        custom: Schema.optionalKey(CustomProviderSchema),
    })),
    permissions: Schema.optionalKey(Schema.Struct({
        timeoutMs: Schema.optionalKey(Schema.Number.check(Schema.isFinite(), Schema.isGreaterThan(0))),
        questions: Schema.optionalKey(ApprovalQuestions),
        opencode: Schema.optionalKey(HarnessReviewConfig),
        claude: Schema.optionalKey(HarnessReviewConfig),
    })),
});
class ConfigMissing extends Schema.TaggedError()("ConfigMissing", {}) {
}
class ConfigFileError extends Schema.TaggedError()("ConfigFileError", {
    reason: Schema.Literals(["read", "schema", "permissions", "policy"]),
}) {
}
const EnvironmentApiKeys = Config.all({
    zen: Config.option(Config.Redacted(providerApiKeyEnvironment("zen"))),
    typesafe: Config.option(Config.Redacted(providerApiKeyEnvironment("typesafe"))),
    openrouter: Config.option(Config.Redacted(providerApiKeyEnvironment("openrouter"))),
    vercel: Config.option(Config.Redacted(providerApiKeyEnvironment("vercel"))),
    laya: Config.option(Config.Redacted(providerApiKeyEnvironment("laya"))),
});
const hasCredentials = (document) => document.providers?.zen?.apiKey !== undefined ||
    document.providers?.typesafe?.apiKey !== undefined ||
    document.providers?.openrouter?.apiKey !== undefined ||
    document.providers?.vercel?.apiKey !== undefined ||
    document.providers?.laya?.apiKey !== undefined ||
    document.providers?.custom?.apiKey !== undefined;
const readDocument = Effect.fn("JevvyConfig.readDocument")(function* (path) {
    const fs = yield* FileSystem.FileSystem;
    const raw = yield* fs.readFileString(path).pipe(Effect.catchReason("PlatformError", "NotFound", () => new ConfigMissing()), Effect.mapError((error) => error instanceof ConfigMissing ? error : new ConfigFileError({ reason: "read" })));
    const parseErrors = [];
    const decoded = parse(raw, parseErrors, { allowTrailingComma: true, disallowComments: false });
    if (parseErrors.length > 0)
        return yield* new ConfigFileError({ reason: "schema" });
    const document = yield* Schema.decodeUnknownEffect(JevvyConfigSchema, {
        onExcessProperty: "error",
    })(decoded).pipe(Effect.mapError(() => new ConfigFileError({ reason: "schema" })));
    if (process.platform !== "win32" && hasCredentials(document)) {
        const info = yield* fs.stat(path).pipe(Effect.mapError(() => new ConfigFileError({ reason: "read" })));
        if ((info.mode & 0o777) !== 0o600) {
            yield* fs.chmod(path, 0o600).pipe(Effect.mapError(() => new ConfigFileError({ reason: "permissions" })));
        }
    }
    return document;
});
const invalidMessage = (reason) => {
    if (reason === "policy") {
        return "Laya requires providers.laya.policy with matching checkpoint and questions; calibrate it before enabling auto-approval (top-level permissions.questions cannot configure Laya)";
    }
    if (reason === "permissions")
        return "credential-bearing jevvy.jsonc could not be secured";
    if (reason === "read")
        return "jevvy.jsonc could not be read";
    return "jevvy.jsonc does not match the configuration schema";
};
const environmentApiKey = (provider, keys) => Option.getOrUndefined(keys[provider]);
const providerSelection = (document, environment) => {
    if (document.provider === "custom") {
        const custom = document.providers?.custom;
        if (custom === undefined || (custom.endpoint.protocol !== "http:" && custom.endpoint.protocol !== "https:")) {
            return new ConfigFileError({ reason: "schema" });
        }
        const apiKey = custom.apiKey === undefined ? undefined : Redacted.make(custom.apiKey);
        return Effect.succeed({
            provider: "custom",
            endpoint: custom.endpoint.href,
            model: custom.model,
            apiKey,
        });
    }
    if (document.provider === "laya") {
        const laya = document.providers?.laya;
        if (laya?.endpoint !== undefined && laya.endpoint.protocol !== "http:" && laya.endpoint.protocol !== "https:") {
            return new ConfigFileError({ reason: "schema" });
        }
        const fileApiKey = laya?.apiKey;
        const apiKey = fileApiKey === undefined ? environmentApiKey("laya", environment) : Redacted.make(fileApiKey);
        return Effect.succeed({
            provider: "laya",
            endpoint: laya?.endpoint?.href,
            model: laya?.model,
            apiKey,
        });
    }
    const fileApiKey = document.providers?.[document.provider]?.apiKey;
    const apiKey = fileApiKey === undefined
        ? environmentApiKey(document.provider, environment)
        : Redacted.make(fileApiKey);
    return Effect.succeed({
        provider: document.provider,
        apiKey,
        model: document.providers?.[document.provider]?.model,
        opencodeCredential: document.providers?.[document.provider]?.opencodeCredential,
    });
};
const load = Effect.fn("JevvyConfig.load")(function* (path, environment) {
    const document = yield* readDocument(path).pipe(Effect.asSome, Effect.catchTag("ConfigMissing", () => Effect.succeed(Option.none())));
    if (Option.isNone(document))
        return { kind: "unconfigured" };
    const environmentKeys = yield* EnvironmentApiKeys.parse(environment).pipe(Effect.mapError(() => new ConfigFileError({ reason: "schema" })));
    const selection = yield* providerSelection(document.value, environmentKeys);
    const timeoutMs = document.value.permissions?.timeoutMs ?? 5_000;
    if (selection.provider === "laya") {
        const policy = document.value.providers?.laya?.policy;
        if (document.value.permissions?.questions !== undefined || policy === undefined ||
            policy.checkpoint !== (selection.model ?? DEFAULT_LAYA_MODEL)) {
            return yield* new ConfigFileError({ reason: "policy" });
        }
        return { kind: "custom-policy", selection, questions: policy.questions, timeoutMs };
    }
    const questions = document.value.permissions?.questions;
    if (questions === undefined)
        return { kind: "shipped-policy", selection, timeoutMs };
    return { kind: "custom-policy", selection, questions, timeoutMs };
}, Effect.catchTag("ConfigFileError", (error) => Effect.succeed({ kind: "invalid", message: invalidMessage(error.reason) })));
export const loadJevvyConfig = (path = globalJevvyConfigPath(), environment = ConfigProvider.fromEnv()) => load(path, environment);
