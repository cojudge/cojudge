import type { Param } from "./util";

// Generic interactive-judge config (currently only guess-word).
// metadata.json example:
//   "interactive": { "kind": "guess-word", "secretField": "secret", "maxGuesses": 10 }
// params keep BOTH wordlist (string_array) and secret (string) so that
// Marker.isCorrect(wordlist, secret, transcript) typechecks, but runners
// NEVER pass `secret` to user code — they build a Master(secret, wordlist)
// and call sol.findSecretWord(wordlist, master).
export type InteractiveConfig = {
    kind: string;
    secretField: string;
    maxGuesses: number;
};

export function getInteractive(problemData: any): InteractiveConfig | null {
    const it = problemData?.interactive;
    if (!it || typeof it !== "object") return null;
    if (!it.secretField) return null;
    return {
        kind: String(it.kind ?? "guess-word"),
        secretField: String(it.secretField),
        maxGuesses: Number(it.maxGuesses ?? 10),
    };
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
