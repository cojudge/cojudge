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
    if (language !== 'python'
        && /^(?:(?:public|private|protected|internal|static|abstract|final|sealed|export|default|pub)\s+)*(?:class|struct|enum|trait|impl)\b/.test(code)) return false;
    if (/^(?:public|private|protected)\s*:\s*$/.test(code)) return false;
    return true;
}
