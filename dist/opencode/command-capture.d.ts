import type { ShellCreateBefore } from "@opencode/plugin/effect/shell";
import { Effect } from "effect";
interface ToolEvent {
    readonly tool: string;
    readonly sessionID: string;
    readonly messageID: string;
    readonly id: string;
}
interface PermissionEvent {
    readonly sessionID: string;
    readonly source?: {
        readonly type: string;
        readonly messageID: string;
        readonly id: string;
    };
}
export declare const createCommandCapture: () => {
    before: (event: ToolEvent) => Effect.Effect<void, never, never>;
    shellBefore: (invocation: ShellCreateBefore) => Effect.Effect<void, never, never>;
    after: (event: ToolEvent) => Effect.Effect<void, never, never>;
    commandFor(event: PermissionEvent): string | undefined;
};
export {};
