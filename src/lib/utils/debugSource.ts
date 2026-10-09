export interface SourceToken {
    offset: number;
    type: string;
}

export function isNonCodeToken(type: string): boolean {
    return /(^|\.)(comment|string|regexp)(\.|$)/.test(type);
}

export function canInspectToken(tokens: SourceToken[], offset: number): boolean {
    const token = tokens.find((token, index) =>
        token.offset <= offset && (index + 1 === tokens.length || tokens[index + 1].offset > offset)
    );
    return !!token && !isNonCodeToken(token.type);
}

// Monaco's word pattern excludes `$`, so hovering `$nums` yields `nums`.
// Expand the hovered word back to a valid PHP expression: `$nums`, or a
// property chain like `$root->val` when hovering `val`.
export function phpHoverVariable(lineText: string, startColumn: number, endColumn: number, fallback: string): string {
    const line = lineText ?? '';
    const wordEnd = Math.min(endColumn - 1, line.length);
    let i = Math.min(startColumn - 1, wordEnd);
    // Walk left over identifier chars and `->` links to the owning `$`.
    while (i > 0) {
        const prev = line[i - 1];
        if (/[A-Za-z0-9_]/.test(prev)) { i--; continue; }
        if (prev === '$') { i--; break; }
        if (prev === '>' && i >= 2 && line[i - 2] === '-') { i -= 2; continue; }
        break;
    }
    if (i < wordEnd && line[i] === '$') return line.slice(i, wordEnd);
    return fallback;
}
// Before a program is compiled we can reject clearly non-executable source.
// Exact breakpoint resolution still belongs to the language debugger.
export function isBreakpointCandidate(line: string, tokens: SourceToken[], language: string): boolean {
    const code = tokens.map((token, index) => {
        const text = line.slice(token.offset, tokens[index + 1]?.offset ?? line.length);
        if (/(^|\.)comment(\.|$)/.test(token.type)) return ' '.repeat(text.length);
        // Preserve literals as expressions, without interpreting their contents as syntax.
        return isNonCodeToken(token.type) ? '0'.padEnd(text.length) : text;
    }).join('').trim();
    if (!code || /^[\s{}\[\]();,:]+$/.test(code)) return false;
    if (language === 'cpp' && /^#/.test(code)) return false;
    if (['java', 'go', 'typescript', 'csharp', 'rust'].includes(language)
        && /^(?:package|import|namespace|use|interface|type)\b/.test(code)) return false;
    if (language === 'csharp' && /^using\s+(?:static\s+)?[\w.]+\s*;?$/.test(code)) return false;
    if ((language === 'php' || language === 'phpcode')
        && /^(?:require|require_once|include|include_once|namespace|use|declare)\b/.test(code)) return false;
    // The PHP debug driver never instruments declaration lines themselves
    // (only their bodies), so a breakpoint there could never bind.
    if ((language === 'php' || language === 'phpcode') && /\bfunction\b|\bfn\s*\(/.test(code)) return false;
    if (language !== 'python'
        && /^(?:(?:public|private|protected|internal|static|abstract|final|sealed|export|default|pub)\s+)*(?:class|struct|enum|trait|impl)\b/.test(code)) return false;
    if (/^(?:public|private|protected)\s*:\s*$/.test(code)) return false;
    return true;
}
