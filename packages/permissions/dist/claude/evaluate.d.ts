import { Effect, Schema } from "effect";
import type { PermissionReviewer } from "../engine.ts";
declare const ClaudePermissionRequest: Schema.Struct<{
    readonly session_id: Schema.String;
    readonly prompt_id: Schema.String;
    readonly transcript_path: Schema.String;
    readonly cwd: Schema.String;
    readonly scratchpad_dir: Schema.optionalKey<Schema.String>;
    readonly permission_mode: Schema.Literals<readonly ["default", "plan", "acceptEdits", "auto", "dontAsk", "bypassPermissions"]>;
    readonly hook_event_name: Schema.Literals<readonly ["PermissionRequest"]>;
    readonly tool_name: Schema.Literals<readonly ["Bash"]>;
    readonly tool_input: Schema.Struct<{
        readonly command: Schema.NonEmptyString;
        readonly description: Schema.optionalKey<Schema.String>;
        readonly timeout: Schema.optionalKey<Schema.Number>;
        readonly run_in_background: Schema.optionalKey<Schema.Boolean>;
    }>;
}>;
declare const ClaudeHookEventJson: Schema.fromJsonString<Schema.Union<readonly [Schema.Struct<{
    readonly session_id: Schema.String;
    readonly prompt_id: Schema.String;
    readonly transcript_path: Schema.String;
    readonly cwd: Schema.String;
    readonly scratchpad_dir: Schema.optionalKey<Schema.String>;
    readonly permission_mode: Schema.Literals<readonly ["default", "plan", "acceptEdits", "auto", "dontAsk", "bypassPermissions"]>;
    readonly hook_event_name: Schema.Literals<readonly ["PermissionRequest"]>;
    readonly tool_name: Schema.Literals<readonly ["Bash"]>;
    readonly tool_input: Schema.Struct<{
        readonly command: Schema.NonEmptyString;
        readonly description: Schema.optionalKey<Schema.String>;
        readonly timeout: Schema.optionalKey<Schema.Number>;
        readonly run_in_background: Schema.optionalKey<Schema.Boolean>;
    }>;
}>, Schema.Struct<{
    readonly session_id: Schema.String;
    readonly prompt_id: Schema.optionalKey<Schema.String>;
    readonly transcript_path: Schema.String;
    readonly cwd: Schema.String;
    readonly scratchpad_dir: Schema.optionalKey<Schema.String>;
    readonly hook_event_name: Schema.Literals<readonly ["SessionStart"]>;
    readonly source: Schema.Literals<readonly ["startup", "resume", "clear", "compact", "fork"]>;
    readonly model: Schema.optionalKey<Schema.String>;
    readonly agent_type: Schema.optionalKey<Schema.String>;
    readonly session_title: Schema.optionalKey<Schema.String>;
}>]>>;
interface ClaudePermissionRequest extends Schema.Schema.Type<typeof ClaudePermissionRequest> {
}
export type ClaudeHookEvent = Schema.Schema.Type<typeof ClaudeHookEventJson>;
export declare const permissionAllowOutput: {
    readonly hookSpecificOutput: {
        readonly hookEventName: "PermissionRequest";
        readonly decision: {
            readonly behavior: "allow";
        };
    };
};
export type PermissionAllowOutput = typeof permissionAllowOutput;
export declare const setupUnavailableOutput: (message: string) => {
    readonly systemMessage: string;
};
export declare const sessionStartOutput: (message: string | undefined) => {
    readonly systemMessage: string;
} | undefined;
export type ClaudeHookOutput = PermissionAllowOutput | ReturnType<typeof setupUnavailableOutput>;
export declare const decodeClaudeHookEvent: (raw: string) => ClaudeHookEvent | undefined;
export declare const createClaudeEvaluate: (reviewer: PermissionReviewer) => ((request: ClaudePermissionRequest) => Effect.Effect<PermissionAllowOutput | undefined>);
export {};
