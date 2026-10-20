import { Schema } from "effect";
export declare const JevvyControl: {
    readonly id: "jevvy.permissions.control";
    readonly methods: {
        get: {
            input: import("effect/StandardSchema").StandardSchemaV1<void, void> & Schema.Void;
            output: import("effect/StandardSchema").StandardSchemaV1<{
                readonly enabled?: boolean | undefined;
                readonly problem?: string | undefined;
            }, {
                readonly enabled?: boolean | undefined;
                readonly problem?: string | undefined;
            }> & Schema.Struct<{
                readonly enabled: Schema.optionalKey<Schema.Boolean>;
                readonly problem: Schema.optionalKey<Schema.String>;
            }>;
        };
        toggle: {
            input: import("effect/StandardSchema").StandardSchemaV1<void, void> & Schema.Void;
            output: import("effect/StandardSchema").StandardSchemaV1<{
                readonly enabled: boolean;
            }, {
                readonly enabled: boolean;
            }> & Schema.Struct<{
                readonly enabled: Schema.Boolean;
            }>;
        };
    };
    readonly events: {
        changed: {
            schema: import("effect/StandardSchema").StandardSchemaV1<{
                readonly enabled: boolean;
            }, {
                readonly enabled: boolean;
            }> & Schema.Struct<{
                readonly enabled: Schema.Boolean;
            }>;
        };
    };
};
