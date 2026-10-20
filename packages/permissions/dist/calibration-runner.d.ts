import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";
import type { CalibrationMeta, CalibrationPlanEntry, CalibrationRecord, CalibrationSummary } from "./calibration.ts";
import type { SelectedProvider } from "./providers.ts";
declare const CalibrationError_base: Schema.Class<CalibrationError, Schema.TaggedStruct<"CalibrationError", {
    readonly operation: Schema.Literals<readonly ["read", "parse", "write", "evaluate", "setup"]>;
    readonly message: Schema.String;
}>, import("effect/Cause").YieldableError>;
export declare class CalibrationError extends CalibrationError_base {
}
export declare const calibrationHash: (text: string) => string;
export declare const loadCalibrationCorpus: (path: string, name?: any) => Effect.Effect<{
    name: any;
    corpus: import("./calibration.ts").CalibrationCorpus;
    hash: string;
}, CalibrationError, FileSystem.FileSystem>;
export declare const loadCalibrationPlan: (paths: readonly {
    readonly path: string;
    readonly name: string;
}[]) => Effect.Effect<{
    corpora: {
        name: any;
        corpus: import("./calibration.ts").CalibrationCorpus;
        hash: string;
    }[];
    plan: readonly CalibrationPlanEntry[];
}, CalibrationError, FileSystem.FileSystem>;
export interface CalibrationRun {
    readonly plan: readonly CalibrationPlanEntry[];
    readonly meta: CalibrationMeta;
    readonly provider: Pick<SelectedProvider, "client" | "redact">;
    readonly output: string;
    readonly spacing: number;
    readonly progress: (completed: number, record: CalibrationRecord) => void;
}
export declare const runCalibrationPlan: (run: CalibrationRun) => Effect.Effect<{
    output: string;
    summary: CalibrationSummary;
}, CalibrationError, FileSystem.FileSystem | Path.Path>;
export {};
