<script lang="ts">
    import type * as Monaco from 'monaco-editor';
    import { onMount } from 'svelte';
    export let value = '';
    export let language = 'javascript';
    export let fontSize: number = 14;
    export let theme: 'dark' | 'light' = 'light';
    export let readOnly: boolean = false;

    let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
    let editorElement: HTMLDivElement;
    let monacoRef: any;

    onMount(() => {
        let disposed = false;
        import('monaco-editor').then((monaco) => {
            if (disposed) return;
            monacoRef = monaco;
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
        });

        return () => {
            disposed = true;
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

    $: if (monacoRef) {
        const themeId = theme === 'light' ? 'custom-light' : 'custom-dark';
        monacoRef.editor.setTheme(themeId);
    }
</script>

<div bind:this={editorElement}></div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>