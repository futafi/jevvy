// ../core/dist/types.js
import { Schema } from "effect";
var Json = Schema.Json;
var NoulQuestion = Schema.Struct({
  type: Schema.Literal("noul"),
  instructions: Schema.String,
  criteria: Schema.optionalKey(Schema.Struct({
    false: Schema.String,
    true: Schema.String
  }))
});
var NoulAnswer = Schema.Struct({
  type: Schema.Literal("noul"),
  noul: Schema.Finite.check(Schema.isBetween({ minimum: 0, maximum: 1 }))
});
var JevRequest = Schema.Struct({
  state: Json,
  questions: Schema.Record(Schema.String, NoulQuestion)
});
var JevResult = Schema.Struct({
  model: Schema.NonEmptyString,
  answers: Schema.Record(Schema.String, NoulAnswer),
  reportedModel: Schema.optionalKey(Schema.NonEmptyString)
});

// ../core/dist/system-one.js
import { Clock, Effect, Option, Schema as Schema3 } from "effect";
import { FetchHttpClient, Headers, HttpClient, HttpClientRequest, HttpClientResponse } from "effect/http";

// ../core/dist/provider-error.js
import { Schema as Schema2 } from "effect";
var JevProvider = Schema2.Literals(["zen", "typesafe", "openrouter", "vercel", "laya", "custom"]);
var JevProviderErrorKind = Schema2.Literals([
  "authentication",
  "credits-exhausted",
  "quota-exhausted",
  "rate-limited",
  "invalid-request",
  "invalid-response",
  "unavailable"
]);
var ProviderFailureFields = {
  provider: JevProvider,
  kind: JevProviderErrorKind,
  message: Schema2.String,
  status: Schema2.optional(Schema2.Int),
  code: Schema2.optional(Schema2.String),
  retryAfterMs: Schema2.optional(Schema2.Number)
};
var JevProviderFailure = Schema2.Struct(ProviderFailureFields);
var JevProviderError = class extends Schema2.TaggedError()("JevProviderError", {
  ...ProviderFailureFields,
  cause: Schema2.optional(Schema2.Defect())
}) {
};
var isJevProviderError = Schema2.is(JevProviderError);
var providerFailureOf = (error) => ({
  provider: error.provider,
  kind: error.kind,
  message: error.message,
  status: error.status,
  code: error.code,
  retryAfterMs: error.retryAfterMs
});

// ../core/dist/system-one.js
var SystemOneRequest = Schema3.Struct({
  model: Schema3.NonEmptyString,
  ...JevRequest.fields
});
var SystemOneResponse = Schema3.Struct({
  model: JevResult.fields.model,
  answers: JevResult.fields.answers
});
var RoutedSystemOneResponse = Schema3.Struct({
  ...SystemOneResponse.fields,
  routing: Schema3.Struct({ model: Schema3.NonEmptyString })
});
var ProviderErrorDetails = Schema3.Struct({
  message: Schema3.optional(Schema3.String),
  type: Schema3.optional(Schema3.String),
  code: Schema3.optional(Schema3.Union([Schema3.String, Schema3.Number]))
});
var ProviderErrorBody = Schema3.Union([
  Schema3.Struct({ error: ProviderErrorDetails }),
  ProviderErrorDetails
]);
var decodeProviderErrorBody = Schema3.decodeUnknownOption(Schema3.fromJsonString(ProviderErrorBody));
var errorDetails = (text) => {
  const decoded = Option.getOrUndefined(decodeProviderErrorBody(text));
  if (decoded === void 0)
    return {};
  const details = "error" in decoded ? decoded.error : decoded;
  return {
    code: details.code === void 0 ? details.type : String(details.code),
    message: details.message
  };
};
var creditCodes = /* @__PURE__ */ new Set([
  "CreditsError",
  "billing_required",
  "credit_balance_exhausted",
  "customer_verification_required",
  "insufficient_credits",
  "insufficient_quota"
]);
var quotaCodes = /* @__PURE__ */ new Set([
  "BlackUsageLimitError",
  "FreeUsageLimitError",
  "GoUsageLimitError",
  "MonthlyLimitError",
  "UserLimitError"
]);
var classifyError = (status, code) => {
  if (code !== void 0 && creditCodes.has(code))
    return "credits-exhausted";
  if (code !== void 0 && quotaCodes.has(code))
    return "quota-exhausted";
  if (code === "AuthError")
    return "authentication";
  if (code === "RateLimitError" || code === "rate_limit_error")
    return "rate-limited";
  if (status === 401 || status === 403)
    return "authentication";
  if (status === 402)
    return "credits-exhausted";
  if (status === 429)
    return "rate-limited";
  if (status === 400 || status === 404 || status === 422)
    return "invalid-request";
  return "unavailable";
};
var retryAfter = Effect.fnUntraced(function* (response) {
  const milliseconds = Option.getOrUndefined(Headers.get(response.headers, "retry-after-ms"));
  if (milliseconds !== void 0 && milliseconds.trim().length > 0) {
    const parsed = Number(milliseconds);
    if (Number.isFinite(parsed) && parsed >= 0)
      return parsed;
  }
  const raw = Option.getOrUndefined(Headers.get(response.headers, "retry-after"));
  if (raw === void 0 || raw.trim().length === 0)
    return void 0;
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds >= 0)
    return seconds * 1e3;
  const date = Date.parse(raw);
  if (Number.isNaN(date))
    return void 0;
  const now = yield* Clock.currentTimeMillis;
  return Math.max(0, date - now);
});
var validateRequestedAnswers = (provider, result, questions) => {
  for (const key of Object.keys(questions)) {
    if (result.answers[key] === void 0) {
      return new JevProviderError({
        provider,
        kind: "invalid-response",
        message: `System One returned no valid noul answer for ${key}`
      });
    }
  }
  return Effect.succeed(result);
};
var createSystemOneClient = (options) => ({
  evaluate: Effect.fn(`${options.provider}.evaluate`)(function* (request) {
    if (Object.keys(request.questions).length === 0) {
      return yield* new JevProviderError({
        provider: options.provider,
        kind: "invalid-request",
        message: "System One requires at least one question"
      });
    }
    const httpRequest = yield* HttpClientRequest.post(options.url).pipe(HttpClientRequest.acceptJson, HttpClientRequest.setHeaders(options.headers), HttpClientRequest.schemaBodyJson(SystemOneRequest)({
      model: options.model,
      state: request.state,
      questions: request.questions
    }), Effect.mapError((cause) => new JevProviderError({
      provider: options.provider,
      kind: "invalid-request",
      message: `${options.provider} System One request could not be encoded`,
      cause
    })));
    const response = yield* HttpClient.execute(httpRequest).pipe(Effect.provide(FetchHttpClient.layer), Effect.mapError((cause) => new JevProviderError({
      provider: options.provider,
      kind: "unavailable",
      message: `${options.provider} System One is unavailable`,
      cause
    })));
    if (response.status < 200 || response.status >= 300) {
      const text = yield* response.text.pipe(Effect.orElseSucceed(() => ""), Effect.map((body) => body.slice(0, 2e3)));
      const details = errorDetails(text);
      return yield* new JevProviderError({
        provider: options.provider,
        kind: classifyError(response.status, details.code),
        message: details.message ?? `${options.provider} System One returned HTTP ${response.status}`,
        status: response.status,
        code: details.code,
        retryAfterMs: yield* retryAfter(response)
      });
    }
    const decoded = yield* (options.modelIdentity === "routing.model" ? HttpClientResponse.schemaBodyJson(RoutedSystemOneResponse)(response).pipe(Effect.map(({ model, answers, routing }) => ({
      model: routing.model,
      answers,
      reportedModel: model
    }))) : HttpClientResponse.schemaBodyJson(SystemOneResponse)(response)).pipe(Effect.mapError((cause) => new JevProviderError({
      provider: options.provider,
      kind: "invalid-response",
      message: `${options.provider} System One returned an unrecognized body`,
      status: response.status,
      cause
    })));
    if (options.modelIdentity === "routing.model" && decoded.model !== options.model) {
      return yield* new JevProviderError({
        provider: options.provider,
        kind: "invalid-response",
        message: `${options.provider} System One served ${decoded.model} instead of ${options.model}`,
        status: response.status
      });
    }
    return yield* validateRequestedAnswers(options.provider, decoded, request.questions);
  })
});

// ../core/dist/custom.js
var createCustomSystemOneClient = (options) => createSystemOneClient({
  provider: "custom",
  url: options.endpoint,
  model: options.model,
  headers: options.apiKey === void 0 ? {} : { authorization: `Bearer ${options.apiKey}` }
});

// ../core/dist/laya.js
var DEFAULT_LAYA_ENDPOINT = "http://127.0.0.1:8000/v1/systemone";
var DEFAULT_LAYA_MODEL = "english";
var createLayaClient = (options = {}) => createSystemOneClient({
  provider: "laya",
  url: options.endpoint ?? DEFAULT_LAYA_ENDPOINT,
  model: options.model ?? DEFAULT_LAYA_MODEL,
  headers: options.apiKey === void 0 ? {} : { authorization: `Bearer ${options.apiKey}` },
  modelIdentity: "routing.model"
});

// ../core/dist/openrouter.js
var DEFAULT_OPENROUTER_MODEL = "typesafe/jev-1.13";
var OPENROUTER_SYSTEMONE_URL = "https://openrouter.ai/api/v1/systemone";
var createOpenRouterClient = (apiKey, model = DEFAULT_OPENROUTER_MODEL) => createSystemOneClient({
  provider: "openrouter",
  url: OPENROUTER_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/typesafe.js
var DEFAULT_TYPESAFE_MODEL = "jev-1.13.0";
var TYPESAFE_SYSTEMONE_URL = "https://api.typesafe.ai/v1/systemone";
var createTypeSafeClient = (apiKey, model = DEFAULT_TYPESAFE_MODEL) => createSystemOneClient({
  provider: "typesafe",
  url: TYPESAFE_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/vercel.js
var DEFAULT_VERCEL_MODEL = "typesafe-ai/jev";
var VERCEL_SYSTEMONE_URL = "https://ai-gateway.vercel.sh/typesafe/v1/systemone";
var createVercelClient = (apiKey, model = DEFAULT_VERCEL_MODEL) => createSystemOneClient({
  provider: "vercel",
  url: VERCEL_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/zen.js
import { Schema as Schema4 } from "effect";
var ZEN_SYSTEMONE_URL = "https://opencode.ai/zen/v1/systemone";
var DEFAULT_ZEN_MODEL = "jev-1.13";
var isZenBody = Schema4.is(Schema4.Struct({
  model: Schema4.optional(Schema4.Unknown),
  answers: Schema4.optional(Schema4.Unknown)
}));
var createZenClient = (apiKey, model = DEFAULT_ZEN_MODEL) => createSystemOneClient({
  provider: "zen",
  url: ZEN_SYSTEMONE_URL,
  model,
  headers: { Authorization: `Bearer ${apiKey}` }
});
export {
  DEFAULT_LAYA_ENDPOINT,
  DEFAULT_LAYA_MODEL,
  DEFAULT_OPENROUTER_MODEL,
  DEFAULT_TYPESAFE_MODEL,
  DEFAULT_VERCEL_MODEL,
  DEFAULT_ZEN_MODEL,
  JevProvider,
  JevProviderError,
  JevProviderFailure,
  JevRequest,
  JevResult,
  Json,
  NoulAnswer,
  NoulQuestion,
  createCustomSystemOneClient,
  createLayaClient,
  createOpenRouterClient,
  createTypeSafeClient,
  createVercelClient,
  createZenClient,
  isJevProviderError,
  providerFailureOf
};
