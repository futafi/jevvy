import * as Effect from "effect/Effect";
import * as Terminal from "effect/Terminal";
export declare const colorizeAccent: (text: string, colorDepth: number) => string;
export declare const accent: (text: string) => string;
export declare const terminalPalette: () => {
    primary: string;
    secondary: string;
    muted: string;
    error: string;
    foreground: string;
};
export type TerminalPalette = ReturnType<typeof terminalPalette>;
export declare const showInitSection: (title: string, body?: string | undefined) => Effect.Effect<void, never, Terminal.Terminal>;
