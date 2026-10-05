import { describe, expect, it, vi } from 'vitest';
import {
    attachVisualCursorFix,
    createHistoryAwareStatusBar,
    deleteLineRangeToRegister,
    enableVimHistoryPersistence,
    findMatchingSymbolPosition,
    getExYankRegister,
    getLinewiseDeleteRange,
    getLinewiseRangeText,
    getNormalModeClickClipColumn,
    getVisualCursorRange,
    normalizeExPromptKeyName,
    patchMonacoVimKeyName,
    readPersistedVimHistory,
    sanitizePersistedVimHistory,
    writePersistedVimHistory,
    yankLineRangeToRegister
} from './vimMode';

function createMemoryStorage(initial: Record<string, string> = {}) {
    const data = new Map(Object.entries(initial));
    return {
        data,
        getItem: (key: string) => (data.has(key) ? (data.get(key) as string) : null),
        setItem: (key: string, value: string) => {
            data.set(key, value);
        }
    };
}

function createHistoryController(initial: string[] = []) {
    const controller = {
        historyBuffer: [...initial],
        iterator: initial.length,
        initialPrefix: null as string | null,
        pushInput(this: { historyBuffer: string[] }, input: string) {
            const index = this.historyBuffer.indexOf(input);
            if (index > -1) this.historyBuffer.splice(index, 1);
            if (input.length) this.historyBuffer.push(input);
        },
        reset(this: { iterator: number; initialPrefix: null; historyBuffer: string[] }) {
            this.initialPrefix = null;
            this.iterator = this.historyBuffer.length;
        }
    };
    return controller;
}

function createCm(lines: string[], cursor = { line: 0, ch: 0 }) {
    return {
        firstLine: () => 0,
        lastLine: () => lines.length - 1,
        getCursor: () => cursor,
        getLine: (line: number) => lines[line] ?? ''
    };
}

describe('vim mode helpers', () => {
    it('extracts linewise text for Ex yank ranges', () => {
        const cm = createCm(['alpha', 'beta', 'gamma']);

        expect(getLinewiseRangeText(cm, 0, 2)).toBe('alpha\nbeta\ngamma');
    });

    it('passes range and clipboard register through Ex yank', () => {
        const cm = createCm(['alpha', 'beta', 'gamma']);
        const pushed: unknown[][] = [];
        const Vim = {
            defineMotion: () => {},
            defineEx: () => {},
            getRegisterController: () => ({
                pushText: (...args: unknown[]) => pushed.push(args)
            })
        };

        yankLineRangeToRegister(Vim, cm, { line: 0, lineEnd: 2, args: ['+'] });

        expect(pushed).toEqual([['+', 'yank', 'alpha\nbeta\ngamma', true, false]]);
    });

    it('parses compact Ex yank registers', () => {
        expect(getExYankRegister({ args: ['+'] })).toBe('+');
        expect(getExYankRegister({ args: ['a'] })).toBe('a');
        expect(getExYankRegister({})).toBeUndefined();
    });

    it('finds matching symbols in both directions', () => {
        const cm = createCm(['if (a[0]) {', '  return a[0];', '}']);

        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 3 })).toEqual({ line: 0, ch: 8 });
        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 7 })).toEqual({ line: 0, ch: 5 });
        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 10 })).toEqual({ line: 2, ch: 0 });
    });

    it('keeps the cursor position when no match exists', () => {
        const cm = createCm(['const value = 1;']);

        expect(findMatchingSymbolPosition(cm, { line: 0, ch: 0 })).toEqual({ line: 0, ch: 0 });
    });

    it('places the visual cursor on the inclusive head instead of one right', () => {
        // `hm` with visual head on `h` (ch 0) should decorate `h`, not `m`.
        expect(getVisualCursorRange({ line: 4, ch: 8 }, '    hm := make(')).toEqual({
            startLineNumber: 5,
            startColumn: 9,
            endLineNumber: 5,
            endColumn: 10
        });
    });

    it('falls back to the native cursor when there is no character to cover', () => {
        expect(getVisualCursorRange({ line: 0, ch: 0 }, '')).toBeNull();
        expect(getVisualCursorRange({ line: 0, ch: 3 }, 'abc')).toBeNull();
        expect(getVisualCursorRange(null, 'abc')).toBeNull();
    });

    it('clips a normal-mode click past end-of-line back to the last character', () => {
        // `print('x')` is 10 chars; clicking after `)` gives column 11.
        expect(getNormalModeClickClipColumn(10, 11)).toBe(10);
        expect(getNormalModeClickClipColumn(10, 10)).toBeNull();
        expect(getNormalModeClickClipColumn(10, 1)).toBeNull();
        expect(getNormalModeClickClipColumn(0, 1)).toBeNull();
    });

    it('attaches a single-character decoration at the visual head and hides the native cursor', () => {
        const classList = { add: vi.fn(), remove: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 5,
                getLineContent: (line: number) => (line === 5 ? '    hm := make(' : '')
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            enterVimMode: vi.fn(),
            state: { vim: { visualMode: true, sel: { head: { line: 4, ch: 8 } } } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);

        // Initial update is deferred; force it via the selection listener.
        const calls = editor.onDidChangeCursorSelection.mock.calls as unknown[][] | undefined;
        const listener = calls?.[0]?.[0] as (() => void) | undefined;
        listener?.();

        expect(editor.deltaDecorations).toHaveBeenCalledWith([], [
            expect.objectContaining({
                range: {
                    startLineNumber: 5,
                    startColumn: 9,
                    endLineNumber: 5,
                    endColumn: 10
                }
            })
        ]);
        expect(classList.add).toHaveBeenCalledWith('monaco-vim-visual-mode');
        expect(editor.updateOptions).toHaveBeenCalledWith({ cursorBlinking: 'blink' });

        // Entering vim mode again (e.g. after leaving insert) keeps blinking.
        (adapter.enterVimMode as unknown as (...args: unknown[]) => unknown)();
        expect(editor.updateOptions).toHaveBeenCalledWith({ cursorBlinking: 'blink' });

        dispose();
        expect(adapter.off).toHaveBeenCalledWith('vim-mode-change', expect.any(Function));
        expect(classList.remove).toHaveBeenCalledWith('monaco-vim-visual-mode');
    });

    it('uses the same slow-blinking custom block for the normal-mode cursor', () => {
        const classList = { add: vi.fn(), remove: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 1,
                getLineContent: () => 'hm'
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            getPosition: () => ({ lineNumber: 1, column: 1 }),
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            enterVimMode: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);

        const calls = editor.onDidChangeCursorPosition.mock.calls as unknown[][] | undefined;
        const listener = calls?.[0]?.[0] as (() => void) | undefined;
        listener?.();

        expect(editor.deltaDecorations).toHaveBeenCalledWith([], [
            expect.objectContaining({
                range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 1,
                    endColumn: 2
                }
            })
        ]);
        expect(classList.add).toHaveBeenCalledWith('monaco-vim-normal-mode');

        dispose();
        expect(classList.remove).toHaveBeenCalledWith('monaco-vim-normal-mode');
    });

    it('leaves insert mode alone so the native line cursor shows', () => {
        const classList = { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 1,
                getLineContent: () => 'hm'
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            getPosition: () => ({ lineNumber: 1, column: 1 }),
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            onDidBlurEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            onDidFocusEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: true } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);

        const calls = editor.onDidChangeCursorPosition.mock.calls as unknown[][] | undefined;
        const listener = calls?.[0]?.[0] as (() => void) | undefined;
        listener?.();

        expect(editor.deltaDecorations).not.toHaveBeenCalled();
        expect(classList.add).not.toHaveBeenCalled();

        dispose();
    });

    it('hollows the custom block when the editor loses focus', () => {
        const classList = { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 1,
                getLineContent: () => 'hm'
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            getPosition: () => ({ lineNumber: 1, column: 1 }),
            hasTextFocus: () => true,
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            onDidBlurEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            onDidFocusEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);

        const blurCalls = editor.onDidBlurEditorWidget.mock.calls as unknown[][] | undefined;
        const blur = blurCalls?.[0]?.[0] as (() => void) | undefined;
        blur?.();
        expect(classList.toggle).toHaveBeenCalledWith('monaco-vim-blurred', true);

        const focusCalls = editor.onDidFocusEditorWidget.mock.calls as unknown[][] | undefined;
        const focus = focusCalls?.[0]?.[0] as (() => void) | undefined;
        focus?.();
        expect(classList.toggle).toHaveBeenCalledWith('monaco-vim-blurred', false);

        dispose();
        expect(classList.remove).toHaveBeenCalledWith('monaco-vim-blurred');
    });

    it('starts hollow when attaching while already blurred', () => {        const classList = { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 1,
                getLineContent: () => 'hm'
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            getPosition: () => ({ lineNumber: 1, column: 1 }),
            hasTextFocus: () => false,
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            onDidBlurEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            onDidFocusEditorWidget: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);
        expect(classList.toggle).toHaveBeenCalledWith('monaco-vim-blurred', true);
        dispose();
    });

    it('pulls a normal-mode click past end-of-line back to the last character', () => {
        const classList = { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() };
        const editor = {
            getModel: () => ({
                getLineCount: () => 5,
                getLineContent: () => "print('x')"
            }),
            getDomNode: () => ({ classList }) as unknown as HTMLElement,
            // Click after the `)` on line 2: column 11 on a 10-char line.
            getPosition: () => ({ lineNumber: 2, column: 11 }),
            getSelection: () => ({ isEmpty: () => true }),
            setPosition: vi.fn(),
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        };
        const adapter = {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        };

        const dispose = attachVisualCursorFix(editor, adapter);

        const calls = editor.onDidChangeCursorPosition.mock.calls as unknown[][] | undefined;
        const listener = calls?.[0]?.[0] as (() => void) | undefined;
        listener?.();

        expect(editor.setPosition).toHaveBeenCalledWith({ lineNumber: 2, column: 10 });
        // No decoration this round; the follow-up cursor event re-decorates.
        expect(editor.deltaDecorations).not.toHaveBeenCalled();

        dispose();
    });

    it('leaves clicks alone in insert/visual mode, on selections, or on the last character', () => {
        const makeEditor = (position: { lineNumber: number; column: number }, empty: boolean) => ({
            getModel: () => ({
                getLineCount: () => 5,
                getLineContent: () => "print('x')"
            }),
            getDomNode: () => ({ classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() } }) as unknown as HTMLElement,
            getPosition: () => position,
            getSelection: () => ({ isEmpty: () => empty }),
            setPosition: vi.fn(),
            deltaDecorations: vi.fn(() => ['deco-1']),
            onDidChangeCursorSelection: vi.fn(() => ({ dispose: vi.fn() })),
            onDidChangeCursorPosition: vi.fn(() => ({ dispose: vi.fn() })),
            updateOptions: vi.fn()
        });
        const firePosition = (selectionMock: { mock: { calls: unknown[][] } }) => {
            const listener = selectionMock.mock.calls?.[0]?.[0] as (() => void) | undefined;
            listener?.();
        };

        // Insert mode: appending past end is legal.
        const insertEditor = makeEditor({ lineNumber: 2, column: 11 }, true);
        const disposeInsert = attachVisualCursorFix(insertEditor, {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: true } }
        });
        firePosition(insertEditor.onDidChangeCursorPosition);
        expect(insertEditor.setPosition).not.toHaveBeenCalled();
        disposeInsert();

        // Visual mode: EOL positions select the newline.
        const visualEditor = makeEditor({ lineNumber: 2, column: 11 }, false);
        const disposeVisual = attachVisualCursorFix(visualEditor, {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: true, insertMode: false, sel: { head: { line: 1, ch: 10 } } } }
        });
        firePosition(visualEditor.onDidChangeCursorPosition);
        expect(visualEditor.setPosition).not.toHaveBeenCalled();
        disposeVisual();

        // Normal mode with a non-empty selection (drag): leave alone.
        const dragEditor = makeEditor({ lineNumber: 2, column: 11 }, false);
        const disposeDrag = attachVisualCursorFix(dragEditor, {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        });
        firePosition(dragEditor.onDidChangeCursorPosition);
        expect(dragEditor.setPosition).not.toHaveBeenCalled();
        disposeDrag();

        // Normal mode already on the last character: no move.
        const okEditor = makeEditor({ lineNumber: 2, column: 10 }, true);
        const disposeOk = attachVisualCursorFix(okEditor, {
            on: vi.fn(),
            off: vi.fn(),
            state: { vim: { visualMode: false, insertMode: false } }
        });
        firePosition(okEditor.onDidChangeCursorPosition);
        expect(okEditor.setPosition).not.toHaveBeenCalled();
        expect(okEditor.deltaDecorations).toHaveBeenCalled();
        disposeOk();
    });
});

describe('ex :delete command', () => {
    const len = (lines: string[]) => (line: number) => lines[line]?.length ?? 0;

    it('deletes middle lines through the start of the next line', () => {
        const lines = ['a', 'b', 'c', 'd'];
        // :2,3d -> lines 1..2
        expect(getLinewiseDeleteRange(1, 2, 0, 3, len(lines))).toEqual({
            from: { line: 1, ch: 0 },
            to: { line: 3, ch: 0 },
            cursorLine: 1
        });
    });

    it('deletes a single middle line (:3d)', () => {
        const lines = ['a', 'b', 'c'];
        expect(getLinewiseDeleteRange(2, 2, 0, 2, len(lines))).toEqual({
            from: { line: 1, ch: 1 },
            to: { line: 2, ch: 1 },
            cursorLine: 1
        });
    });

    it('deletes the whole buffer (:%d) without shifting lines', () => {
        const lines = ['a', 'b'];
        expect(getLinewiseDeleteRange(0, 1, 0, 1, len(lines))).toEqual({
            from: { line: 0, ch: 0 },
            to: { line: 1, ch: 1 },
            cursorLine: 0
        });
    });

    it('orders reversed ranges (:2,1d)', () => {
        const lines = ['a', 'b', 'c'];
        expect(getLinewiseDeleteRange(1, 0, 0, 2, len(lines))).toEqual({
            from: { line: 0, ch: 0 },
            to: { line: 2, ch: 0 },
            cursorLine: 0
        });
    });

    it('pushes deleted text to the delete register and removes the lines', () => {
        const lines = ['alpha', 'beta', 'gamma'];
        const pushed: unknown[][] = [];
        const replaced: unknown[] = [];
        const cursors: unknown[] = [];
        const cm = {
            firstLine: () => 0,
            lastLine: () => lines.length - 1,
            getCursor: () => ({ line: 0, ch: 0 }),
            getLine: (line: number) => lines[line] ?? '',
            replaceRange: (text: string, from: unknown, to: unknown) => {
                replaced.push([text, from, to]);
            },
            setCursor: (line: number, ch: number) => {
                cursors.push([line, ch]);
            }
        };
        const Vim = {
            defineMotion: () => {},
            defineEx: () => {},
            getRegisterController: () => ({
                pushText: (...args: unknown[]) => pushed.push(args)
            })
        };

        // :1,2d
        deleteLineRangeToRegister(Vim, cm, { line: 0, lineEnd: 1 });

        expect(pushed).toEqual([[undefined, 'delete', 'alpha\nbeta', true, false]]);
        expect(replaced).toEqual([['', { line: 0, ch: 0 }, { line: 2, ch: 0 }]]);
        expect(cursors.length).toBe(1);
    });
});

describe('ex prompt history', () => {
    it('normalizes DOM arrow/escape names to CodeMirror names', () => {
        expect(normalizeExPromptKeyName('ArrowUp')).toBe('Up');
        expect(normalizeExPromptKeyName('ArrowDown')).toBe('Down');
        expect(normalizeExPromptKeyName('ArrowLeft')).toBe('Left');
        expect(normalizeExPromptKeyName('Escape')).toBe('Esc');
        expect(normalizeExPromptKeyName('Up')).toBe('Up');
        expect(normalizeExPromptKeyName('a')).toBe('a');
        expect(normalizeExPromptKeyName(null)).toBeNull();
    });

    it('patches keyName once and maps ArrowUp to Up', () => {
        const target = { keyName: (e: unknown) => (e as { key: string }).key };
        patchMonacoVimKeyName(target);
        expect(target.keyName({ key: 'ArrowUp' })).toBe('Up');
        const first = target.keyName;
        patchMonacoVimKeyName(target);
        expect(target.keyName).toBe(first);
    });

    it('history-aware closeInput updates the value instead of closing', () => {
        const focus = vi.fn();
        const node = { value: ':', focus: vi.fn() };
        class Base {
            input: unknown = { node };
            editor = { focus };
            removeInputListeners = vi.fn();
            setSec = vi.fn();
            constructor() {}
        }
        const Fixed = createHistoryAwareStatusBar(Base as never) as unknown as new () => {
            closeInput: (v?: string) => void;
            input: unknown;
            setSec: ReturnType<typeof vi.fn>;
        };
        const bar = new Fixed();
        bar.closeInput(':%d');
        expect((node as { value: string }).value).toBe(':%d');
        expect(bar.setSec).not.toHaveBeenCalled();
        expect(focus).not.toHaveBeenCalled();
    });

    it('history-aware closeInput without a value still closes', () => {
        const focus = vi.fn();
        class Base {
            input: unknown = { node: { value: 'x' } };
            editor = { focus };
            removeInputListeners = vi.fn();
            setSec = vi.fn();
            constructor() {}
        }
        const Fixed = createHistoryAwareStatusBar(Base as never) as unknown as new () => {
            closeInput: (v?: string) => void;
            input: unknown;
        };
        const bar = new Fixed();
        bar.closeInput();
        expect(bar.input).toBeNull();
        expect(focus).toHaveBeenCalled();
    });
});

describe('vim history persistence', () => {
    it('sanitizes persisted history (drops junk, dedupes, caps)', () => {
        expect(sanitizePersistedVimHistory(['%d', '', '%d', 42, null, 'w'], 10)).toEqual(['%d', 'w']);
        expect(sanitizePersistedVimHistory(['a', 'b', 'c'], 2)).toEqual(['b', 'c']);
        expect(sanitizePersistedVimHistory('nope')).toEqual([]);
        expect(sanitizePersistedVimHistory(null)).toEqual([]);
    });

    it('round-trips history through storage', () => {
        const storage = createMemoryStorage();
        writePersistedVimHistory(storage, 'ex', ['%d', 'w']);
        expect(readPersistedVimHistory(storage, 'ex')).toEqual(['%d', 'w']);
        expect(readPersistedVimHistory(storage, 'missing')).toEqual([]);
    });

    it('returns empty history for corrupt storage payloads', () => {
        const storage = createMemoryStorage({ ex: 'not-json{{{' });
        expect(readPersistedVimHistory(storage, 'ex')).toEqual([]);
    });

    it('restores persisted history into controllers and saves new entries', () => {
        const storage = createMemoryStorage({ ex: JSON.stringify(['%d', 'w']), search: JSON.stringify(['/foo']) });
        const ex = createHistoryController();
        const search = createHistoryController();
        const Vim = {
            defineMotion: () => {},
            defineEx: () => {},
            getRegisterController: () => ({ pushText: () => {} }),
            getVimGlobalState_: () => ({
                exCommandHistoryController: ex,
                searchHistoryController: search
            })
        };

        const dispose = enableVimHistoryPersistence(Vim, { storage, exKey: 'ex', searchKey: 'search' });
        expect(ex.historyBuffer).toEqual(['%d', 'w']);
        expect(search.historyBuffer).toEqual(['/foo']);

        ex.pushInput('q');
        expect(JSON.parse((storage.data.get('ex') as string) as string)).toEqual(['%d', 'w', 'q']);

        // Idempotent: second enable does not double-wrap or duplicate.
        enableVimHistoryPersistence(Vim, { storage, exKey: 'ex', searchKey: 'search' });
        ex.pushInput('q!');
        expect(JSON.parse((storage.data.get('ex') as string) as string)).toEqual(['%d', 'w', 'q', 'q!']);

        dispose();
    });

    it('is a no-op without a vim global state', () => {
        const storage = createMemoryStorage();
        const Vim = {
            defineMotion: () => {},
            defineEx: () => {},
            getRegisterController: () => ({ pushText: () => {} })
        };
        expect(() => enableVimHistoryPersistence(Vim, { storage })).not.toThrow();
    });
});
