import { describe, expect, it, vi } from 'vitest';
import {
    attachVisualCursorFix,
    findMatchingSymbolPosition,
    getExYankRegister,
    getLinewiseRangeText,
    getNormalModeClickClipColumn,
    getVisualCursorRange,
    yankLineRangeToRegister
} from './vimMode';

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
