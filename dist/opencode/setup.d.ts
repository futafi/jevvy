import type { BuiltInProvider } from "../providers.ts";
export declare const missingConfigurationMessage: (configPath: string) => string;
export declare const invalidConfigurationMessage: (configPath: string, detail: string) => string;
export declare const missingCredentialMessage: (provider: BuiltInProvider, configPath: string) => string;
export declare const missingOpenCodeCredentialMessage: (provider: BuiltInProvider, integrationID: string, configPath: string) => string;
