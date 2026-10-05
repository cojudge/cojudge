type CmPosition = {
    line: number;
    ch: number;
};

type CmAdapter = {
    firstLine: () => number;
    lastLine: () => number;
    getCursor: () => CmPosition;
    getLine: (line: number) => string;
    replaceRange?: (text: string, from: CmPosition, to: CmPosition) => void;
    setCursor?: (line: number, ch: number) => void;
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

type VimHistoryController = {
    historyBuffer: string[];
    iterator: number;
    initialPrefix: string | null;
    pushInput: (input: string) => void;
    reset: () => void;
};

type VimGlobalState = {
    exCommandHistoryController?: VimHistoryController;
    searchHistoryController?: VimHistoryController;
};

type VimApi = {
    defineMotion: (name: string, fn: (cm: CmAdapter, head: CmPosition) => CmPosition) => void;
    defineEx: (name: string, prefix: string, fn: (cm: CmAdapter, params: Record<string, any>) => void) => void;
    defineRegister?: (name: string, register: VimRegister) => void;
    unmap?: (lhs: string, ctx?: string) => boolean;
    getRegisterController: () => VimRegisterController;
    getVimGlobalState_?: () => VimGlobalState;
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
    // monaco-vim ships :yank but no :delete, so :%d / :1,2d / :3d fail with
    // `Not an editor command`. Register it here with matching range semantics.
    Vim.defineEx('delete', 'd', (cm, params) => deleteLineRangeToRegister(Vim, cm, params));
    // monaco-vim keeps ex/search history in memory only, so it is lost on
    // reload. Persist it to localStorage (browser-only, never cloud-synced).
    try {
        enableVimHistoryPersistence(Vim);
    } catch {
        // ignore storage failures; vim still works without persistence
    }
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

export type LinewiseDeleteRange = {
    from: CmPosition;
    to: CmPosition;
    cursorLine: number;
};

/**
 * Pure helper computing the buffer range to remove for a linewise `:delete`.
 *
 * CodeMirror positions are `{ line, ch }` with `ch` an index into the line
 * (no newline). To delete whole lines we must also remove one newline:
 * prefer the trailing newline (delete through the start of the next line),
 * or the preceding newline when deleting through the last line.
 */
export function getLinewiseDeleteRange(
    lineStart: number,
    lineEnd: number,
    firstLine: number,
    lastLine: number,
    getLineLength: (line: number) => number
): LinewiseDeleteRange {
    const start = Math.min(lineStart, lineEnd);
    const end = Math.max(lineStart, lineEnd);

    if (start <= firstLine && end >= lastLine) {
        return {
            from: { line: start, ch: 0 },
            to: { line: end, ch: getLineLength(end) },
            cursorLine: start
        };
    }

    if (end < lastLine) {
        return {
            from: { line: start, ch: 0 },
            to: { line: end + 1, ch: 0 },
            cursorLine: start
        };
    }

    const deletedCount = end - start + 1;
    const newLastLine = lastLine - deletedCount;
    return {
        from: { line: start - 1, ch: getLineLength(start - 1) },
        to: { line: end, ch: getLineLength(end) },
        cursorLine: Math.min(Math.max(start, firstLine), Math.max(newLastLine, firstLine))
    };
}

export function deleteLinewiseRange(cm: CmAdapter, lineStart: number, lineEnd: number) {
    const range = getLinewiseDeleteRange(
        lineStart,
        lineEnd,
        cm.firstLine(),
        cm.lastLine(),
        (line) => cm.getLine(line).length
    );
    cm.replaceRange?.('', range.from, range.to);
    try {
        const clampedLine = Math.min(Math.max(range.cursorLine, cm.firstLine()), cm.lastLine());
        const content = cm.getLine(clampedLine) ?? '';
        const firstNonBlank = content.search(/[^ \t]/);
        cm.setCursor?.(clampedLine, firstNonBlank < 0 ? 0 : firstNonBlank);
    } catch {
        // ignore cursor failures; the deletion itself already happened
    }
}

export function deleteLineRangeToRegister(Vim: VimApi, cm: CmAdapter, params: Record<string, any>) {
    const cursorLine = cm.getCursor().line;
    const lineStart = normalizeLine(params.line ?? cursorLine, cm);
    const lineEnd = normalizeLine(params.lineEnd ?? lineStart, cm);
    const start = Math.min(lineStart, lineEnd);
    const end = Math.max(lineStart, lineEnd);

    Vim.getRegisterController().pushText(
        getExYankRegister(params),
        'delete',
        getLinewiseRangeText(cm, start, end),
        true,
        false
    );
    deleteLinewiseRange(cm, start, end);
}

const EX_PROMPT_KEY_ALIASES: Record<string, string> = {
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Escape: 'Esc'
};

/**
 * The `:` prompt input is a plain DOM `<input>` (not a Monaco editor), so
 * `monacoToCmKey` sees a DOM KeyboardEvent with `key: "ArrowUp"` and returns
 * it verbatim. The vim keymap, however, expects CodeMirror names (`"Up"`),
 * so Up/Down/Esc never match and history navigation silently breaks.
 */
export function normalizeExPromptKeyName(keyName: string | null | undefined): string | null | undefined {
    if (typeof keyName !== 'string') return keyName;
    return EX_PROMPT_KEY_ALIASES[keyName] ?? keyName;
}

export function patchMonacoVimKeyName(VimModeClass: { keyName: (e: unknown) => string }) {
    const holder = VimModeClass as unknown as Record<string, unknown>;
    const current = holder['keyName'];
    if (typeof current !== 'function' || (current as unknown as Record<string, unknown>)['__cojudgePatched']) return;
    const original = current as (e: unknown) => string;
    const wrapped = function (this: unknown, e: unknown) {
        const raw = original.call(this, e);
        return normalizeExPromptKeyName(raw) ?? raw;
    };
    (wrapped as unknown as Record<string, unknown>)['__cojudgePatched'] = true;
    holder['keyName'] = wrapped;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StatusBarConstructor = new (node: HTMLElement, editor: any, sanitizer?: any) => {
    closeInput: (newValue?: string) => void;
    [key: string]: unknown;
};

/**
 * monaco-vim's `StatusBar.closeInput()` ignores its argument and always
 * closes the prompt. CodeMirror's dialog `close(value)`, which the vim
 * keymap relies on for Up/Down history (`close(historyMatch)`) and Ctrl-U
 * (`close("")`), instead replaces the input value and keeps the prompt open.
 * This subclass restores that contract so history navigation works.
 */
export function createHistoryAwareStatusBar<T extends StatusBarConstructor>(Base: T): T {
    const cache = Base as unknown as Record<string, unknown>;
    if (cache['__cojudgeHistoryAware']) return cache['__cojudgeHistoryAware'] as T;
    class HistoryAwareStatusBar extends (Base as unknown as new (
        node: HTMLElement,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sanitizer?: any
    ) => Record<string, unknown>) {
        closeInput = (newValue?: unknown) => {
            const self = this as unknown as Record<string, any>;
            if (typeof newValue === 'string') {
                const input = self['input'] as { node?: HTMLInputElement } | null | undefined;
                if (input?.node) {
                    input.node.value = newValue;
                    try {
                        input.node.focus();
                    } catch {
                        // ignore
                    }
                    return;
                }
            }
            try {
                (self['removeInputListeners'] as (() => void) | undefined)?.();
            } catch {
                // ignore
            }
            self['input'] = null;
            try {
                (self['setSec'] as ((text: string) => void) | undefined)?.('');
            } catch {
                // ignore
            }
            try {
                (self['editor'] as { focus?: () => void } | null | undefined)?.focus?.();
            } catch {
                // ignore
            }
        };
    }
    const result = HistoryAwareStatusBar as unknown as T;
    cache['__cojudgeHistoryAware'] = result;
    return result;
}

export const VIM_EX_HISTORY_STORAGE_KEY = 'cojudge:vim:ex-history';
export const VIM_SEARCH_HISTORY_STORAGE_KEY = 'cojudge:vim:search-history';
export const MAX_PERSISTED_VIM_HISTORY = 100;

export type VimHistoryStorage = Pick<Storage, 'getItem' | 'setItem'>;

function getBrowserHistoryStorage(): VimHistoryStorage | null {
    try {
        if (typeof localStorage === 'undefined') return null;
        return localStorage;
    } catch {
        return null;
    }
}

/**
 * Clean persisted history for storage: drop non-strings/empties, de-dupe
 * (keeping first occurrence), and keep only the most recent `max` entries.
 */
export function sanitizePersistedVimHistory(value: unknown, max: number = MAX_PERSISTED_VIM_HISTORY): string[] {
    if (!Array.isArray(value)) return [];
    const limit = Number.isInteger(max) && max > 0 ? max : MAX_PERSISTED_VIM_HISTORY;
    const seen = new Set<string>();
    const cleaned: string[] = [];
    for (const item of value) {
        if (typeof item !== 'string' || item.length === 0 || seen.has(item)) continue;
        seen.add(item);
        cleaned.push(item);
    }
    return cleaned.slice(-limit);
}

export function readPersistedVimHistory(
    storage: VimHistoryStorage | null | undefined,
    key: string,
    max: number = MAX_PERSISTED_VIM_HISTORY
): string[] {
    try {
        const raw = storage?.getItem(key);
        if (!raw) return [];
        return sanitizePersistedVimHistory(JSON.parse(raw), max);
    } catch {
        return [];
    }
}

export function writePersistedVimHistory(
    storage: VimHistoryStorage | null | undefined,
    key: string,
    history: readonly string[],
    max: number = MAX_PERSISTED_VIM_HISTORY
): void {
    try {
        storage?.setItem(key, JSON.stringify(sanitizePersistedVimHistory(history, max)));
    } catch {
        // ignore quota/private-mode failures; history just won't persist
    }
}

function restoreVimHistoryController(
    controller: VimHistoryController | undefined,
    entries: string[]
): void {
    if (!controller || entries.length === 0) return;
    controller.historyBuffer = entries.slice();
    controller.iterator = controller.historyBuffer.length;
    controller.initialPrefix = null;
}

export type VimHistoryPersistenceOptions = {
    storage?: VimHistoryStorage | null;
    exKey?: string;
    searchKey?: string;
    max?: number;
};

/**
 * Persist monaco-vim's ex (`:`) and search (`/`) history to browser
 * localStorage so Up/Down recall survives app restarts. This is intentionally
 * local-only: the keys are never added to cloud sync.
 *
 * Idempotent per controller (safe to call from both vim-mode setup paths).
 * Returns a dispose function restoring the original `pushInput` methods.
 */
export function enableVimHistoryPersistence(
    Vim: VimApi,
    options: VimHistoryPersistenceOptions = {}
): () => void {
    const storage = options.storage !== undefined ? options.storage : getBrowserHistoryStorage();
    const exKey = options.exKey ?? VIM_EX_HISTORY_STORAGE_KEY;
    const searchKey = options.searchKey ?? VIM_SEARCH_HISTORY_STORAGE_KEY;
    const max = options.max ?? MAX_PERSISTED_VIM_HISTORY;
    const state = Vim.getVimGlobalState_?.();
    if (!state) return () => {};

    restoreVimHistoryController(state.exCommandHistoryController, readPersistedVimHistory(storage, exKey, max));
    restoreVimHistoryController(state.searchHistoryController, readPersistedVimHistory(storage, searchKey, max));

    const disposers: Array<() => void> = [];
    const persistOnPush = (controller: VimHistoryController | undefined, key: string) => {
        if (!controller || typeof controller.pushInput !== 'function') return;
        const marker = controller as unknown as Record<string, unknown>;
        if (marker['__cojudgeHistoryPersisted']) return;
        marker['__cojudgeHistoryPersisted'] = true;
        const original = controller.pushInput.bind(controller);
        const wrapped = (input: string) => {
            original(input);
            writePersistedVimHistory(storage, key, controller.historyBuffer, max);
        };
        controller.pushInput = wrapped;
        disposers.push(() => {
            try {
                if (controller.pushInput === wrapped) controller.pushInput = original;
                delete marker['__cojudgeHistoryPersisted'];
            } catch {
                // ignore
            }
        });
    };
    persistOnPush(state.exCommandHistoryController, exKey);
    persistOnPush(state.searchHistoryController, searchKey);

    return () => {
        disposers.forEach((dispose) => dispose());
    };
}

export type MonacoVisualCursorRange = {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
};

export const MONACO_VIM_VISUAL_MODE_CLASS = 'monaco-vim-visual-mode';
export const MONACO_VIM_NORMAL_MODE_CLASS = 'monaco-vim-normal-mode';
export const MONACO_VIM_BLURRED_CLASS = 'monaco-vim-blurred';
export const MONACO_VIM_VISUAL_CURSOR_CLASS = 'monaco-vim-visual-cursor';

/**
 * Pure helper for Normal-mode mouse clicks past end-of-line.
 *
 * In Vim Normal mode the cursor must stay on a character, but a mouse click
 * past the last character (e.g. after the `)` in `print('x')`) lands one
 * column too far right, while `hjkl` motions clip correctly. Returns the
 * corrected 1-based column, or null when no correction is needed.
 */
export function getNormalModeClickClipColumn(lineLength: number, column: number): number | null {
    if (!Number.isInteger(lineLength) || !Number.isInteger(column)) return null;
    if (lineLength <= 0) return null;
    if (column > lineLength) return lineLength;
    return null;
}

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
    getSelection?: () => { isEmpty?: () => boolean } | null;
    setPosition?: (position: { lineNumber: number; column: number }) => void;
    hasTextFocus?: () => boolean;
    deltaDecorations?: (oldIds: string[], newDecos: unknown[]) => string[];
    onDidChangeCursorSelection?: (listener: () => void) => { dispose: () => void };
    onDidChangeCursorPosition?: (listener: () => void) => { dispose: () => void };
    onDidBlurEditorWidget?: (listener: () => void) => { dispose: () => void };
    onDidFocusEditorWidget?: (listener: () => void) => { dispose: () => void };
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
            classList?.remove(MONACO_VIM_BLURRED_CLASS);
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
        if (!vim.visualMode) {
            // Normal mode: a mouse click past the last character lands one
            // column too far right (monaco-vim only guards mouse events, while
            // `hjkl` motions clip via clipCursorToContent). Pull it back to
            // the last character; the follow-up cursor event re-decorates.
            // Skip when a range is selected so drags are left alone.
            const sel = editor.getSelection?.() ?? null;
            const selEmpty = !sel || typeof sel.isEmpty !== 'function' || sel.isEmpty();
            const pos = editor.getPosition?.() ?? null;
            if (
                selEmpty &&
                pos &&
                pos.lineNumber >= 1 &&
                pos.lineNumber <= model.getLineCount()
            ) {
                const clipped = getNormalModeClickClipColumn(
                    model.getLineContent(pos.lineNumber).length,
                    pos.column
                );
                if (clipped !== null) {
                    try {
                        editor.setPosition?.({ lineNumber: pos.lineNumber, column: clipped });
                    } catch {
                        // ignore
                    }
                    return;
                }
            }
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
    const setBlurred = (blurred: boolean) => {
        try {
            getDomNode()?.classList.toggle(MONACO_VIM_BLURRED_CLASS, blurred);
        } catch {
            // ignore
        }
    };
    try {
        const blurDisposable = editor.onDidBlurEditorWidget?.(() => setBlurred(true));
        if (blurDisposable) disposables.push(blurDisposable);
    } catch {
        // ignore
    }
    try {
        const focusDisposable = editor.onDidFocusEditorWidget?.(() => setBlurred(false));
        if (focusDisposable) disposables.push(focusDisposable);
    } catch {
        // ignore
    }
    try {
        if (typeof editor.hasTextFocus === 'function' && !editor.hasTextFocus()) {
            setBlurred(true);
        }
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
