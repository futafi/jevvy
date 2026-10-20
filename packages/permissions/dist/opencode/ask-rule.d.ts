interface Rule {
    readonly action: string;
    readonly resource: string;
    readonly effect: "allow" | "ask" | "deny";
}
export declare const hasExplicitAsk: (action: string, resources: readonly string[], rules: readonly Rule[]) => boolean;
export {};
