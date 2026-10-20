import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
export const apiKeyFromCredential = (credential) => {
    if (credential?.type !== "key")
        return undefined;
    const apiKey = credential.key?.trim();
    return apiKey === undefined || apiKey.length === 0 ? undefined : apiKey;
};
export const withOpenCodeCredential = (selection, resolve) => Effect.gen(function* () {
    const integrationID = selection.opencodeCredential;
    if (integrationID === undefined || selection.apiKey !== undefined)
        return selection;
    const apiKey = yield* resolve(integrationID).pipe(Effect.orElseSucceed(() => undefined));
    return apiKey === undefined ? selection : { ...selection, apiKey: Redacted.make(apiKey) };
});
