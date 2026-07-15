<script lang="ts">
    import type * as Monaco from 'monaco-editor';
    import { configureMonacoVim } from '$lib/utils/vimMode';
    import { isDebugSupported } from '$lib/utils/util';
    import { onMount } from 'svelte';
    export let value = '';
    export let language = 'javascript';
    export let fontSize: number = 14;
    export let theme: 'dark' | 'light' = 'light';
    export let vimMode: 'off' | 'on' = 'off';
    export let readOnly: boolean = false;
    export let viewState: string | null = null;
    export let breakpoints: number[] = [];
    export let activeDebugLine: number | null = null;

    let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
    let editorElement: HTMLDivElement;
    let monacoRef: any;
    let vimModeInstance: any = null;
    let vimStatusElement: HTMLDivElement;
    let bpDecos: string[] = [];
    let activeLineDecos: string[] = [];

    export function getViewState() {
        if (!editor) return null;
        const state = editor.saveViewState();
        return state ? JSON.stringify(state) : null;
    }

    function updateBreakpointDecorations() {
        if (!editor || !monacoRef) return;
        const model = editor.getModel();
        if (!model) return;
        const decos = breakpoints.map(line => ({
            range: new monacoRef.Range(line, 1, line, 1),
            options: {
                glyphMarginClassName: 'cojudge-breakpoint',
                glyphMarginHoverMessage: { value: 'Breakpoint' },
            }
        }));
        bpDecos = model.deltaDecorations(bpDecos, decos);
    }

    $: if (editor && monacoRef && breakpoints) {
        if (isDebugSupported(language)) {
            updateBreakpointDecorations();
        } else {
            if (bpDecos.length > 0 && editor) {
                const model = editor.getModel();
                if (model) bpDecos = model.deltaDecorations(bpDecos, []);
            }
        }
    }

    function updateActiveDebugLineDecoration() {
        if (!editor || !monacoRef) return;
        const model = editor.getModel();
        if (!model) return;
        const decos: any[] = [];
        if (activeDebugLine && activeDebugLine > 0) {
            decos.push({
                range: new monacoRef.Range(activeDebugLine, 1, activeDebugLine, 1),
                options: {
                    isWholeLine: true,
                    className: 'cojudge-debug-active-line-bg',
                    glyphMarginClassName: 'cojudge-debug-active-line-glyph',
                    glyphMarginHoverMessage: { value: 'Paused here' }
                }
            });
        }
        activeLineDecos = model.deltaDecorations(activeLineDecos, decos);
        if (activeDebugLine && activeDebugLine > 0) {
            editor.revealLineInCenterIfOutsideViewport(activeDebugLine);
        }
    }

    $: if (editor && monacoRef && activeDebugLine !== undefined) {
        updateActiveDebugLineDecoration();
    }

    onMount(() => {
        let disposed = false;
        Promise.all([
            import('monaco-editor'),
            import('monaco-vim')
        ]).then(([monaco, vim]) => {
            if (disposed) return;
            const { initVimMode, VimMode } = vim as any;
            monacoRef = monaco;
            configureMonacoVim(VimMode.Vim);
            
            monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: 'b2ff66' },
                    { token: 'keyword', foreground: 'd48f43' },
                    { token: 'number', foreground: '8aac55' },
                    { token: 'string', foreground: 'ce9178' },
                ],
                colors: {
                    'editor.background': '#3a302e',
                    'editor.foreground': '#f0f0f0',
                    'editorGutter.background': '#3a302e',
                    'editorLineNumber.foreground': '#858585',
                    'editorLineNumber.activeForeground': '#c5c5c5',
                    'editorCursor.foreground': '#42c882',
                    'editor.selectionBackground': '#ffffff20',
                    'editor.lineHighlightBackground': '#ffffff10',
                }
            });

            monaco.editor.defineTheme('custom-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '66cc00' },
                    { token: 'keyword', foreground: 'd48f43' },
                    { token: 'number', foreground: '047857' },
                    { token: 'string', foreground: 'b45309' },
                ],
                colors: {
                    'editor.background': '#f8fafc',
                    'editor.foreground': '#1f2937',
                    'editorGutter.background': '#f1f5f9',
                    'editorLineNumber.foreground': '#94a3b8',
                    'editorLineNumber.activeForeground': '#475569',
                    'editorCursor.foreground': '#d48f43',
                    'editor.selectionBackground': '#d48f4330',
                    'editor.lineHighlightBackground': '#f1f5f9',
                }
            });

            const themeId = theme === 'light' ? 'custom-light' : 'custom-dark';

            editor = monaco.editor.create(editorElement, {
                value,
                language,
                theme: themeId,
                automaticLayout: true,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize,
                readOnly,
                glyphMargin: true,
                minimap: {
                    enabled: false
                }
            });

            editor.onMouseDown((e: any) => {
                if (!isDebugSupported(language)) return;
                if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
                    || e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
                    const prevSelection = editor.getSelection();
                    const line = e.target.position.lineNumber;
                    const idx = breakpoints.indexOf(line);
                    if (idx >= 0) {
                        breakpoints = breakpoints.filter(l => l !== line);
                    } else {
                        breakpoints = [...breakpoints, line].sort((a, b) => a - b);
                    }
                    updateBreakpointDecorations();
                    requestAnimationFrame(() => {
                        if (prevSelection && editor) editor.setSelection(prevSelection);
                    });
                }
            });

            editor.onDidChangeModelContent(() => {
                if (!editor) return;
                value = editor.getValue();
            });

            // Reactively handle vim mode after editor creation
            const updateVimMode = (enabled: string) => {
                if (!editor) return;
                if (enabled === 'on') {
                    if (!vimModeInstance) {
                        vimModeInstance = initVimMode(editor, vimStatusElement);
                    }
                } else {
                    if (vimModeInstance) {
                        vimModeInstance.dispose();
                        vimModeInstance = null;
                    }
                }
            };
            
            // Initial vim mode
            updateVimMode(vimMode);

        });

        return () => {
            disposed = true;
            if (vimModeInstance) {
                vimModeInstance.dispose();
            }
            editor?.dispose();
        };
    });

    // Update language reactively
    $: if (editor && monacoRef) {
        const model = editor.getModel();
        if (model) {
            monacoRef.editor.setModelLanguage(model, language);
        }
    }

    $: if (editor && typeof vimMode === 'string') {
        import('monaco-vim').then(({ initVimMode }) => {
            if (!editor) return;
            if (vimMode === 'on') {
                if (!vimModeInstance) {
                    vimModeInstance = initVimMode(editor, vimStatusElement);
                }
            } else {
                if (vimModeInstance) {
                    vimModeInstance.dispose();
                    vimModeInstance = null;
                }
            }
        });
    }

    $: if (editor && typeof fontSize === 'number') {
        editor.updateOptions({ fontSize });
    }

    $: if (editor && typeof readOnly === 'boolean') {
        editor.updateOptions({ readOnly });
    }

    // Update editor content when `value` prop changes externally (e.g., language switch)
    $: if (editor && typeof value === 'string') {
        const current = editor.getValue();
        if (current !== value) {
            editor.setValue(value);
        }
    }

    // Restore viewState when the prop changes (e.g., switching files/tabs)
    $: if (editor && viewState !== undefined) {
        if (viewState) {
            try {
                editor.restoreViewState(JSON.parse(viewState));
            } catch (e) {
                console.error('Failed to restore view state', e);
            }
        } else {
            const model = editor.getModel();
            if (model) {
                editor.trigger('viewState', 'editor.unfoldAll', {});
            }
            editor.setScrollTop(0);
            editor.setPosition({ lineNumber: 1, column: 1 });
        }
    }

    $: if (monacoRef) {
        const themeId = theme === 'light' ? 'custom-light' : 'custom-dark';
        monacoRef.editor.setTheme(themeId);
    }
</script>

<div class="editor-container">
    <div class="code-editor" bind:this={editorElement} data-language={language} data-debug={isDebugSupported(language)}></div>
    <div class="vim-status" class:hidden={vimMode !== 'on'} bind:this={vimStatusElement}></div>
</div>

<style>
    .editor-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .code-editor {
        flex: 1;
        width: 100%;
        min-height: 0;
    }
    .vim-status {
        display: flex;
        align-items: center;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 11px;
        padding: 0 12px;
        height: 22px;
        background-color: var(--color-bg);
        border-top: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
    }
    .hidden {
        display: none;
    }
    :global(.cojudge-breakpoint) {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    :global(.cojudge-breakpoint::after) {
        content: '';
        background: #ef4444;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
        transition: transform 0.1s ease-in-out;
    }
    :global(.cojudge-breakpoint:hover::after) {
        transform: scale(1.25);
        background: #f87171;
    }
    :global(.cojudge-debug-active-line-bg) {
        background: rgba(234, 179, 8, 0.18) !important;
        border-top: 1px solid rgba(234, 179, 8, 0.35);
        border-bottom: 1px solid rgba(234, 179, 8, 0.35);
    }
    :global(.cojudge-debug-active-line-glyph) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    :global(.cojudge-debug-active-line-glyph::after) {
        content: '';
        width: 11px;
        height: 11px;
        background-color: #f59e0b;
        clip-path: polygon(15% 15%, 85% 50%, 15% 85%);
        box-shadow: 0 0 5px rgba(245, 158, 11, 0.8);
    }
    :global([data-debug="true"] .monaco-editor .margin-view-overlays),
    :global([data-debug="true"] .monaco-editor .margin-view-overlays *) {
        cursor: pointer !important;
    }
    :global([data-debug="true"] .monaco-editor .margin-view-overlays > div:hover:not(.cojudge-breakpoint):not(.cojudge-debug-active-line-glyph))::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        background-color: #ef4444;
        border-radius: 50%;
        opacity: 0.5;
        pointer-events: none;
    }
</style>
