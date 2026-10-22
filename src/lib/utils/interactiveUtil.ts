import type { Param } from "./util";

// Generic interactive-judge config.
// metadata.json example (Guess the Word):
//   "interactive": { "kind": "guess-word", "secretField": "secret", "maxGuesses": 10 }
// Return-value judge kinds (user function returns the answer; the judge
// only hides the secret and counts API calls):
//   "interactive": { "kind": "guess-number", "secretField": "pick", "maxGuesses": 100 }
//   "interactive": { "kind": "first-bad", "secretField": "bad", "maxGuesses": 100 }
//   "interactive": { "kind": "array-reader", "secretField": "secret", "maxGuesses": 10000 }
//   "interactive": { "kind": "mountain-array", "secretField": "mountainArr", "maxGuesses": 100 }
//   "interactive": { "kind": "celebrity", "secretField": "graph", "maxGuesses": 10, "perN": 5 }
// params keep the judge-only field (pick/bad/secret/mountainArr/graph) so that
// Marker.isCorrect typechecks, but runners NEVER pass it to user code.
// Instead they build a judge object and call e.g.
// sol.guessNumber(n, game) / sol.search(reader, target).
// Over-budget runs print an "over-budget:N" result which every marker rejects.
export type InteractiveConfig = {
    kind: string;
    secretField: string;
    maxGuesses: number;
    /** Extra call budget per unit of n (celebrity: budget = maxGuesses + perN * n). */
    perN?: number;
};

export function getInteractive(problemData: any): InteractiveConfig | null {
    const it = problemData?.interactive;
    if (!it || typeof it !== "object") return null;
    if (!it.secretField) return null;
    const cfg: InteractiveConfig = {
        kind: String(it.kind ?? "guess-word"),
        secretField: String(it.secretField),
        maxGuesses: Number(it.maxGuesses ?? 10),
    };
    if (it.perN !== undefined) cfg.perN = Number(it.perN);
    return cfg;
}

/** Transcript verdict kinds (void user function, solved:N/failed:N). Only guess-word. */
export function isTranscriptKind(kind: string): boolean {
    return kind === "guess-word";
}

/** Judge class name for a kind, identical across all languages. */
export function judgeClassForKind(kind: string): string {
    switch (kind) {
        case "guess-word": return "Master";
        case "guess-number": return "GuessGame";
        case "first-bad": return "VersionControl";
        case "array-reader": return "ArrayReader";
        case "mountain-array": return "MountainArray";
        case "celebrity": return "Relation";
        default: throw new Error(`Unknown interactive kind: ${kind}`);
    }
}

function toSnake(name: string): string {
    return name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * Judge source file to pack alongside the runner, or null when the judge is
 * embedded in the generated runner (python/cpp/csharp/go/php).
 * Java and TypeScript need one public/exported class per file; the Rust debug
 * driver compiles a separate solution module that imports the judge.
 */
export function judgeFileForKind(kind: string, language: string): string | null {
    const cls = judgeClassForKind(kind);
    if (language === "java") return `${cls}.java`;
    if (language === "typescript") return `${cls}.ts`;
    if (language === "rust") return `${toSnake(cls)}.rs`;
    return null;
}

/** Rust module name for a judge kind (snake_case of the class name). */
export function judgeModuleForKind(kind: string): string {
    return toSnake(judgeClassForKind(kind));
}

function testCaseRowCount(tc: any, field: string): number {
    const raw = tc[field];
    if (Array.isArray(raw)) return raw.length;
    try {
        const parsed = JSON.parse(String(raw ?? "[]"));
        if (Array.isArray(parsed)) return parsed.length;
    } catch {}
    return 0;
}

/**
 * Call budget for one test case. Celebrity scales with n (matrix rows);
 * every other kind uses the flat maxGuesses cap.
 */
export function interactiveBudget(interactive: InteractiveConfig, tc: any): number {
    if (interactive.kind === "celebrity") {
        const n = testCaseRowCount(tc, interactive.secretField);
        return interactive.maxGuesses + (interactive.perN ?? 0) * n;
    }
    return interactive.maxGuesses;
}

// The non-secret list param (wordlist). Convention: first string_array
// param whose name differs from secretField.
export function getWordlistParam(params: Param[], interactive: InteractiveConfig): Param | null {
    for (const p of params) {
        if (p.name !== interactive.secretField && (p.type === "string_array" || p.type === "string_list")) {
            return p;
        }
    }
    return params.find((p) => p.name !== interactive.secretField) ?? null;
}

export function getSecretParam(params: Param[], interactive: InteractiveConfig): Param | null {
    return params.find((p) => p.name === interactive.secretField) ?? null;
}
