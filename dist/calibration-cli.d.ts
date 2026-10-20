import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Command from "effect/cli/Command";
import type { JevProvider } from "./core.ts";
export interface CalibrationCliOptions {
    readonly corpora: readonly string[];
    readonly config?: string;
    readonly output?: string;
    readonly spacing: number;
    readonly dryRun: boolean;
}
export declare const missingProviderMessage: (provider: JevProvider) => string;
export declare const runCalibration: (options: CalibrationCliOptions, writeStdout?: (text: string) => void, writeStderr?: (text: string) => void) => Effect.Effect<number, never, import("effect/FileSystem").FileSystem | Path.Path>;
export declare const calibrationCommand: Command.Command<"jevvy-calibrate", {
    readonly corpora: readonly string[];
    readonly config: Option.Option<string>;
    readonly output: Option.Option<string>;
    readonly spacing: number;
    readonly dryRun: boolean;
}, {}, never, import("effect/FileSystem").FileSystem | Path.Path>;
