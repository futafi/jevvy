import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as Terminal from "effect/Terminal";
import * as Prompt from "effect/cli/Prompt";
export interface Choice<A> {
    readonly title: string;
    readonly value: A;
    readonly description?: string;
    readonly selected?: boolean;
}
export interface SelectOptions<A> {
    readonly message: string;
    readonly choices: readonly Choice<A>[];
}
export interface TextOptions {
    readonly message: string;
    readonly default?: string;
    readonly validate?: (value: string) => Effect.Effect<string, string>;
}
export interface ConfirmOptions {
    readonly message: string;
    readonly initial?: boolean;
}
export declare const select: <A>(options: SelectOptions<A>) => Effect.Effect<A, Terminal.QuitError, Prompt.Environment>;
export declare const multiSelect: <A>(options: SelectOptions<A> & {
    readonly min: number;
}) => Effect.Effect<A[], Terminal.QuitError, Prompt.Environment>;
export declare const confirm: (options: ConfirmOptions) => Effect.Effect<boolean, Terminal.QuitError, Prompt.Environment>;
export declare const text: (options: TextOptions) => Effect.Effect<string, Terminal.QuitError, Prompt.Environment>;
export declare const password: (options: TextOptions) => Effect.Effect<Redacted.Redacted<string>, Terminal.QuitError, Prompt.Environment>;
