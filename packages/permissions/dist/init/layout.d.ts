import type { TerminalPalette } from "./theme.ts";
export declare const graphemes: (value: string) => readonly string[];
export declare const paint: (value: string, color: string) => string;
export declare const wrapText: (value: string, width: number, options?: {
    readonly words?: boolean;
}) => readonly string[];
export declare const bodyRows: (message: string, width: number, rows: number) => number;
export declare const promptFrame: (message: string, lines: readonly string[], width: number, colors: TerminalPalette, complete: boolean, viewport?: {
    readonly rows: number;
    readonly columns: number;
}) => string;
export declare const clearFrame: (frame: string, columns: number) => string;
