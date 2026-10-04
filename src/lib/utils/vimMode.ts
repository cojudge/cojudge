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

export type MonacoVisualCursorRange = {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
};

export const MONACO_VIM_VISUAL_MODE_CLASS = 'monaco-vim-visual-mode';
export const MONACO_VIM_NORMAL_MODE_CLASS = 'monaco-vim-normal-mode';
export const MONACO_VIM_VISUAL_CURSOR_CLASS = 'monaco-vim-visual-cursor';

/**
 * Pure helper for the monaco-vim visual cursor fix.
 *
 * monaco-vim renders visual selections as half-open Monaco ranges
 * ([anchor, head + 1)), so the native block cursor lands one character to
 * the right of Vim's inclusive head (e.g. on `m` instead of `h` for `hm`).
 * The editor fix draws its own block at the inclusive head and hides the
 * native cursor. This returns the 1-based single-character range to decorate,
 * or null when the native cursor should be left alone (not in visual mode,
 * or head is on an empty/EOL position with no character to cover).
 */
export function getVisualCursorRange(
    head: CmPosition | null | undefined,
    lineContent: string | null | undefined
): MonacoVisualCursorRange | null {
    if (!head || head.line == null || head.ch == null) return null;
    if (lineContent == null) return null;
    if (!Number.isInteger(head.line) || !Number.isInteger(head.ch)) return null;
    if (head.line < 0 || head.ch < 0 || head.ch >= lineContent.length) return null;
    const lineNumber = head.line + 1;
    return {
        startLineNumber: lineNumber,
        startColumn: head.ch + 1,
        endLineNumber: lineNumber,
        endColumn: head.ch + 2
    };
}

type VisualCursorFixEditor = {
    getModel?: () => { getLineCount: () => number; getLineContent: (lineNumber: number) => string } | null;
    getDomNode?: () => HTMLElement | null;
    getPosition?: () => { lineNumber: number; column: number } | null;
    deltaDecorations?: (oldIds: string[], newDecos: unknown[]) => string[];
    onDidChangeCursorSelection?: (listener: () => void) => { dispose: () => void };
    onDidChangeCursorPosition?: (listener: () => void) => { dispose: () => void };
    updateOptions?: (options: Record<string, unknown>) => void;
};

type VisualCursorFixAdapter = {
    on?: (event: string, handler: () => void) => void;
    off?: (event: string, handler: () => void) => void;
    state?: { vim?: { visualMode?: boolean; insertMode?: boolean; sel?: { head?: CmPosition } } };
    enterVimMode?: (...args: unknown[]) => unknown;
};

/**
 * Attaches the cursor correction to a live vim-mode editor.
 *
 * Visual mode keeps the exclusive Monaco selection (so yank/delete stay
 * correct) but hides the native block — which sits on the exclusive end —
 * and decorates the inclusive Vim head instead.
 *
 * Normal mode uses the same slow-blinking custom block (the native solid
 * block permanently hides the covered character, e.g. orange keyword text on
 * an orange background). Insert mode is left alone so the native line cursor
 * shows. Falls back to the native cursor when there is no character to cover.
 */
export function attachVisualCursorFix(
    editor: VisualCursorFixEditor,
    vimAdapter: VisualCursorFixAdapter
): () => void {
    let decoIds: string[] = [];
    let disposed = false;

    const getDomNode = (): HTMLElement | null => {
        try {
            return editor?.getDomNode?.() ?? null;
        } catch {
            return null;
        }
    };

    const clear = () => {
        if (decoIds.length > 0) {
            try {
                const result = editor.deltaDecorations?.(decoIds, []);
                decoIds = Array.isArray(result) ? result : [];
            } catch {
                decoIds = [];
            }
        }
        try {
            const classList = getDomNode()?.classList;
            classList?.remove(MONACO_VIM_VISUAL_MODE_CLASS);
            classList?.remove(MONACO_VIM_NORMAL_MODE_CLASS);
        } catch {
            // ignore
        }
    };

    const showRange = (range: MonacoVisualCursorRange, modeClass: string, otherClass: string) => {
        try {
            decoIds =
                editor.deltaDecorations?.(decoIds, [
                    {
                        range,
                        options: {
                            className: MONACO_VIM_VISUAL_CURSOR_CLASS,
                            stickiness: 1,
                            zIndex: 20
                        }
                    }
                ]) ?? decoIds;
            const classList = getDomNode()?.classList;
            classList?.add(modeClass);
            classList?.remove(otherClass);
        } catch {
            // ignore decoration failures; native cursor remains as fallback
        }
    };

    const update = () => {
        if (disposed) return;
        const vim = vimAdapter?.state?.vim;
        // Insert mode keeps the native line cursor.
        if (!vim || vim.insertMode) {
            clear();
            return;
        }
        const model = editor?.getModel?.() ?? null;
        if (!model) {
            clear();
            return;
        }
        if (vim.visualMode) {
            const head = vim.sel?.head;
            const lineContent =
                head && head.line + 1 >= 1 && head.line + 1 <= model.getLineCount()
                    ? model.getLineContent(head.line + 1)
                    : null;
            const range = getVisualCursorRange(head, lineContent);
            if (!range) {
                clear();
                return;
            }
            showRange(range, MONACO_VIM_VISUAL_MODE_CLASS, MONACO_VIM_NORMAL_MODE_CLASS);
            return;
        }
        // Normal mode: same slow-blinking custom block so the covered
        // character stays readable (native solid block hides it).
        const pos = editor.getPosition?.() ?? null;
        if (!pos || pos.lineNumber < 1 || pos.lineNumber > model.getLineCount()) {
            clear();
            return;
        }
        const range = getVisualCursorRange(
            { line: pos.lineNumber - 1, ch: pos.column - 1 },
            model.getLineContent(pos.lineNumber)
        );
        if (!range) {
            clear();
            return;
        }
        showRange(range, MONACO_VIM_NORMAL_MODE_CLASS, MONACO_VIM_VISUAL_MODE_CLASS);
    };

    const disposables: { dispose: () => void }[] = [];
    try {
        const selectionDisposable = editor.onDidChangeCursorSelection?.(() => update());
        if (selectionDisposable) disposables.push(selectionDisposable);
    } catch {
        // ignore
    }
    try {
        // Normal-mode moves keep an empty selection; position events catch them.
        const positionDisposable = editor.onDidChangeCursorPosition?.(() => update());
        if (positionDisposable) disposables.push(positionDisposable);
    } catch {
        // ignore
    }

    const modeHandler = () => {
        // vim-mode-change fires before updateCmSelection; defer so vim.sel is current.
        setTimeout(update, 0);
    };
    try {
        vimAdapter?.on?.('vim-mode-change', modeHandler);
    } catch {
        // ignore
    }

    // monaco-vim forces cursorBlinking: "solid" in enterVimMode (called on
    // attach and on every exitInsertMode), which hides the covered character
    // in NORMAL mode too. Wrap it so the native block blinks instead.
    const adapterAny = vimAdapter as Record<string, unknown>;
    const originalEnterVimMode = typeof adapterAny['enterVimMode'] === 'function'
        ? (adapterAny['enterVimMode'] as (...args: unknown[]) => unknown)
        : null;
    const applyBlink = () => {
        try {
            editor.updateOptions?.({ cursorBlinking: 'blink' });
        } catch {
            // ignore
        }
    };
    if (originalEnterVimMode) {
        adapterAny['enterVimMode'] = (...args: unknown[]) => {
            const result = originalEnterVimMode.apply(vimAdapter, args);
            applyBlink();
            return result;
        };
    }
    applyBlink();

    setTimeout(update, 0);

    return () => {
        disposed = true;
        try {
            disposables.forEach((d) => d?.dispose?.());
        } catch {
            // ignore
        }
        try {
            vimAdapter?.off?.('vim-mode-change', modeHandler);
        } catch {
            // ignore
        }
        if (originalEnterVimMode) {
            try {
                adapterAny['enterVimMode'] = originalEnterVimMode;
            } catch {
                // ignore
            }
        }
        clear();
    };
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
