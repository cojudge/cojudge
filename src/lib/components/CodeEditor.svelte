<script lang="ts">
    import { onMount } from 'svelte';
    import type * as Monaco from 'monaco-editor';
    export let value = '';
    export let language = 'javascript';
    export let fontSize: number = 14;

    let editor: Monaco.editor.IStandaloneCodeEditor | null = null;
    let editorElement: HTMLDivElement;
    let monacoRef: any;

    onMount(() => {
        let disposed = false;
        import('monaco-editor').then((monaco) => {
            if (disposed) return;
            monacoRef = monaco;
            monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark', // Start with the vs-dark theme as a base
            inherit: true,
            rules: [
                { token: 'comment', foreground: '808080' },
                { token: 'keyword', foreground: 'D48F43' },
                { token: 'number', foreground: '8AAC55' },
                { token: 'string', foreground: 'CE9178' },
            ],
            colors: {
                // --- Override the editor's "chrome" colors ---
                'editor.background': '#3A302E', 
                'editor.foreground': '#F0F0F0',
                'editorGutter.background': '#3A302E',
                'editorLineNumber.foreground': '#858585',
                'editorLineNumber.activeForeground': '#C5C5C5',
                'editorCursor.foreground': '#42c882',
                'editor.selectionBackground': '#FFFFFF20',
                'editor.lineHighlightBackground': '#FFFFFF10',
            }
        });
        // --- End of theme definition ---

            editor = monaco.editor.create(editorElement, {
            value,
            language,
            theme: 'custom-dark',
            automaticLayout: true,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize,
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

    // Update editor content when `value` prop changes externally (e.g., language switch)
    $: if (editor && typeof value === 'string') {
        const current = editor.getValue();
        if (current !== value) {
            editor.setValue(value);
        }
    }
</script>

<div bind:this={editorElement}></div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>