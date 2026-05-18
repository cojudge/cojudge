<script lang="ts">
    import type * as Monaco from 'monaco-editor';
    import { configureMonacoVim } from '$lib/utils/vimMode';
    import { onMount } from 'svelte';
    export let value = '';
    export let language = 'javascript';
    export let fontSize: number = 14;
    export let theme: 'dark' | 'light' = 'light';
    export let vimMode: 'off' | 'on' = 'off';
    export let readOnly: boolean = false;
    export let viewState: string | null = null;

    let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
    let editorElement: HTMLDivElement;
    let monacoRef: any;
    let vimModeInstance: any = null;
    let vimStatusElement: HTMLDivElement;

    export function getViewState() {
        if (!editor) return null;
        const state = editor.saveViewState();
        return state ? JSON.stringify(state) : null;
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
                minimap: {
                    enabled: false
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
    <div class="code-editor" bind:this={editorElement}></div>
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
</style>
