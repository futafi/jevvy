import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";
export declare const loadAskRules: (cwd: string, configDir?: any) => Effect.Effect<string[] | undefined, never, ChildProcessSpawner.ChildProcessSpawner | FileSystem.FileSystem | Path.Path>;
export declare const hasHostAsk: (command: string, rules: readonly string[]) => boolean;
