type CmPosition = {
    line: number;
    ch: number;
};

type CmAdapter = {
    firstLine: () => number;
    lastLine: () => number;
    getCursor: () => CmPosition;
    getLine: (line: number) => string;
};

type VimRegisterController = {
    pushText: (
        registerName: string | undefined,
        operator: string,
        text: string,
        linewise?: boolean,
        blockwise?: boolean
    ) => void;
};

type VimApi = {
    defineMotion: (name: string, fn: (cm: CmAdapter, head: CmPosition) => CmPosition) => void;
    defineEx: (name: string, prefix: string, fn: (cm: CmAdapter, params: Record<string, any>) => void) => void;
    defineRegister?: (name: string, register: VimRegister) => void;
    unmap?: (lhs: string, ctx?: string) => boolean;
    getRegisterController: () => VimRegisterController;
};

type VimRegister = {
    linewise: boolean;
    blockwise: boolean;
    setText: (text: string, linewise?: boolean, blockwise?: boolean) => void;
    pushText: (text: string, linewise?: boolean) => void;
    clear: () => void;
    toString: () => string;
};

let vimGlobalsConfigured = false;

const OPEN_TO_CLOSE: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
};

const CLOSE_TO_OPEN = Object.fromEntries(
    Object.entries(OPEN_TO_CLOSE).map(([open, close]) => [close, open])
);

export function configureMonacoVim(Vim: VimApi) {
    if (vimGlobalsConfigured) return;
    vimGlobalsConfigured = true;

    defineClipboardRegister(Vim, '+');
    defineClipboardRegister(Vim, '*');

    Vim.unmap?.('%', 'normal');
    Vim.unmap?.('%', 'visual');
    Vim.defineMotion('moveToMatchedSymbol', findMatchingSymbolPosition);
    Vim.defineEx('yank', 'y', (cm, params) => yankLineRangeToRegister(Vim, cm, params));
}

export function findMatchingSymbolPosition(cm: CmAdapter, head: CmPosition): CmPosition {
    const symbol = findNextMatchableSymbol(cm, head);
    if (!symbol) return head;

    const { char, position } = symbol;

    if (OPEN_TO_CLOSE[char]) {
        return scanForMatchingSymbol(cm, position, char, OPEN_TO_CLOSE[char], 1) ?? head;
    }

    return scanForMatchingSymbol(cm, position, char, CLOSE_TO_OPEN[char], -1) ?? head;
}

export function yankLineRangeToRegister(Vim: VimApi, cm: CmAdapter, params: Record<string, any>) {
    const cursorLine = cm.getCursor().line;
    const lineStart = normalizeLine(params.line ?? cursorLine, cm);
    const lineEnd = normalizeLine(params.lineEnd ?? lineStart, cm);
    const start = Math.min(lineStart, lineEnd);
    const end = Math.max(lineStart, lineEnd);

    Vim.getRegisterController().pushText(
        getExYankRegister(params),
        'yank',
        getLinewiseRangeText(cm, start, end),
        true,
        false
    );
}

export function getLinewiseRangeText(cm: CmAdapter, lineStart: number, lineEnd: number) {
    const lines: string[] = [];
    for (let line = lineStart; line <= lineEnd; line += 1) {
        lines.push(cm.getLine(line));
    }
    return lines.join('\n');
}

export function getExYankRegister(params: Record<string, any>) {
    const registerArg = params.args?.[0] ?? '';
    const registerName = String(registerArg).trim();
    return registerName ? registerName.charAt(0) : undefined;
}

function normalizeLine(line: number, cm: CmAdapter) {
    return Math.min(Math.max(line, cm.firstLine()), cm.lastLine());
}

function findNextMatchableSymbol(cm: CmAdapter, head: CmPosition) {
    const lineText = cm.getLine(head.line);
    const includeAngles = lineText.charAt(head.ch) === '<' || lineText.charAt(head.ch) === '>';

    for (let ch = head.ch; ch < lineText.length; ch += 1) {
        const char = lineText.charAt(ch);
        if (isMatchableSymbol(char, includeAngles)) {
            return { char, position: { line: head.line, ch } };
        }
    }

    return null;
}

function isMatchableSymbol(char: string, includeAngles: boolean) {
    if (!includeAngles && (char === '<' || char === '>')) return false;
    return Boolean(OPEN_TO_CLOSE[char] || CLOSE_TO_OPEN[char]);
}

function scanForMatchingSymbol(
    cm: CmAdapter,
    start: CmPosition,
    startChar: string,
    matchingChar: string,
    direction: 1 | -1
) {
    let depth = 1;
    let line = start.line;
    let ch = start.ch + direction;

    while (line >= cm.firstLine() && line <= cm.lastLine()) {
        const lineText = cm.getLine(line);

        while (ch >= 0 && ch < lineText.length) {
            const char = lineText.charAt(ch);
            if (char === startChar) {
                depth += 1;
            } else if (char === matchingChar) {
                depth -= 1;
                if (depth === 0) return { line, ch };
            }

            ch += direction;
        }

        line += direction;
        ch = direction === 1 ? 0 : cm.getLine(line).length - 1;
    }

    return null;
}

function defineClipboardRegister(Vim: VimApi, name: string) {
    if (!Vim.defineRegister) return;

    try {
        Vim.defineRegister(name, createClipboardRegister());
    } catch (error) {
        if (!String(error).includes('Register already defined')) {
            throw error;
        }
    }
}

function createClipboardRegister(): VimRegister {
    let text = '';
    let linewise = false;
    let blockwise = false;

    return {
        get linewise() {
            return linewise;
        },
        get blockwise() {
            return blockwise;
        },
        setText(nextText, nextLinewise = false, nextBlockwise = false) {
            text = nextText;
            linewise = nextLinewise;
            blockwise = nextBlockwise;
            writeClipboardText(text);
        },
        pushText(nextText, nextLinewise = false) {
            text += nextText;
            linewise = linewise || nextLinewise;
            writeClipboardText(text);
        },
        clear() {
            text = '';
            linewise = false;
            blockwise = false;
            writeClipboardText(text);
        },
        toString() {
            return text;
        }
    };
}

function writeClipboardText(text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(text).catch(() => fallbackWriteClipboardText(text));
        return;
    }

    fallbackWriteClipboardText(text);
}

function fallbackWriteClipboardText(text: string) {
    if (typeof document === 'undefined') return;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
    } finally {
        textarea.remove();
    }
}
