import * as ChildProcess from "effect/process/ChildProcess";
import type { InitHarness } from "./index.ts";
export declare const harnessCommand: (harness: InitHarness, args: readonly string[], options?: {
    readonly inherit?: boolean;
    readonly platform?: NodeJS.Platform;
}) => ChildProcess.StandardCommand;
