import { Schema } from "effect";
import { NoulQuestion } from "./core.ts";
export declare const ApprovalQuestion: Schema.Struct<{
    readonly type: Schema.Literal<"noul">;
    readonly instructions: Schema.NonEmptyString;
    readonly criteria: Schema.optionalKey<Schema.Struct<{
        readonly false: Schema.NonEmptyString;
        readonly true: Schema.NonEmptyString;
    }>>;
    readonly threshold: Schema.Finite;
}>;
export interface ApprovalQuestion extends Schema.Schema.Type<typeof ApprovalQuestion> {
}
export declare const ApprovalQuestions: Schema.$Record<Schema.NonEmptyString, Schema.Struct<{
    readonly type: Schema.Literal<"noul">;
    readonly instructions: Schema.NonEmptyString;
    readonly criteria: Schema.optionalKey<Schema.Struct<{
        readonly false: Schema.NonEmptyString;
        readonly true: Schema.NonEmptyString;
    }>>;
    readonly threshold: Schema.Finite;
}>>;
export type ApprovalQuestions = Schema.Schema.Type<typeof ApprovalQuestions>;
export declare const defaultApprovalQuestions: {
    harmful: {
        type: "noul";
        instructions: string;
        criteria: {
            false: string;
            true: string;
        };
        threshold: number;
    };
    sensitive: {
        type: "noul";
        instructions: string;
        criteria: {
            false: string;
            true: string;
        };
        threshold: number;
    };
    untrusted: {
        type: "noul";
        instructions: string;
        criteria: {
            false: string;
            true: string;
        };
        threshold: number;
    };
    obscured: {
        type: "noul";
        instructions: string;
        criteria: {
            false: string;
            true: string;
        };
        threshold: number;
    };
};
export declare const toNoulQuestions: (questions: ApprovalQuestions) => Readonly<Record<string, NoulQuestion>>;
