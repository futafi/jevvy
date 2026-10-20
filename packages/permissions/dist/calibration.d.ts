import type { JevProvider, Json, NoulAnswer } from "./core.ts";
import type { ApprovalQuestions } from "./questions.ts";
export type CalibrationWant = "allow" | "ask" | "must-ask";
export interface CalibrationCommand {
    readonly command: string;
    readonly want: CalibrationWant;
}
export interface CalibrationCorpus {
    readonly meta?: {
        readonly note?: string;
        readonly repeatCount?: number;
    };
    readonly commands: readonly CalibrationCommand[];
    readonly repeats?: readonly string[];
}
export interface NamedCalibrationCorpus {
    readonly name: string;
    readonly corpus: CalibrationCorpus;
    readonly hash: string;
}
export interface CalibrationPlanEntry extends CalibrationCommand {
    readonly corpus: string;
    readonly kind: "base" | "repeat";
    readonly probe?: number;
}
export interface CalibrationMeta {
    readonly provider: JevProvider;
    readonly requestedModel: string;
    readonly questions: ApprovalQuestions;
    readonly questionHash: string;
    readonly createdAt: string;
    readonly calls: number;
    readonly corpora: readonly {
        readonly name: string;
        readonly hash: string;
    }[];
    readonly commit?: string;
}
interface CalibrationRecordBase extends CalibrationPlanEntry {
    readonly ms: number;
    readonly timestamp: string;
}
export interface CalibrationResultRecord extends CalibrationRecordBase {
    readonly status: "result";
    readonly effect: "allow" | "ask";
    readonly answers: Readonly<Record<string, number>>;
    readonly model: string;
    readonly reportedModel?: string;
}
export interface CalibrationErrorRecord extends CalibrationRecordBase {
    readonly status: "error";
    readonly error: string;
}
export type CalibrationRecord = CalibrationResultRecord | CalibrationErrorRecord;
export interface CalibrationSummary {
    readonly summary: true;
    readonly completedAt: string;
    readonly result: "passed" | "failed";
    readonly failed: boolean;
    readonly counts: {
        readonly planned: number;
        readonly completed: number;
        readonly errors: number;
        readonly mustAskLeaks: number;
        readonly modelMismatches: number;
        readonly labelMismatches: number;
    };
    readonly matrix: Readonly<Record<CalibrationWant, Readonly<Record<"allow" | "ask", number>>>>;
    readonly repeated: readonly {
        readonly corpus: string;
        readonly command: string;
        readonly question: string;
        readonly mean: number;
        readonly minimum: number;
        readonly maximum: number;
        readonly standardDeviation: number;
        readonly verdicts: Readonly<Record<"allow" | "ask", number>>;
    }[];
    readonly latency?: {
        readonly p50: number;
        readonly p90: number;
        readonly mean: number;
        readonly maximum: number;
    };
    readonly mustAskLeaks: readonly {
        readonly corpus: string;
        readonly command: string;
    }[];
    readonly labelMismatches: readonly {
        readonly corpus: string;
        readonly command: string;
        readonly want: CalibrationWant;
        readonly effect: "allow" | "ask";
    }[];
    readonly modelMismatches: readonly {
        readonly corpus: string;
        readonly command: string;
        readonly requested: string;
        readonly served: string;
    }[];
    readonly errors: readonly {
        readonly corpus: string;
        readonly command: string;
        readonly error: string;
    }[];
}
export declare const parseCalibrationCorpus: (value: Json, name: string) => CalibrationCorpus;
export declare const buildCalibrationPlan: (corpora: readonly NamedCalibrationCorpus[]) => readonly CalibrationPlanEntry[];
export declare const summarizeCalibration: (meta: CalibrationMeta, records: readonly CalibrationRecord[], completedAt?: string) => CalibrationSummary;
export declare const calibrationMetaRecord: (meta: CalibrationMeta) => {
    provider: JevProvider;
    requestedModel: string;
    questions: ApprovalQuestions;
    questionHash: string;
    createdAt: string;
    calls: number;
    corpora: readonly {
        readonly name: string;
        readonly hash: string;
    }[];
    commit?: string;
    schemaVersion: number;
    meta: true;
};
export declare const numericAnswers: (answers: Readonly<Record<string, NoulAnswer>>) => Readonly<Record<string, number>>;
export {};
