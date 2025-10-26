<script lang="ts">
    import { onMount } from 'svelte';
    export let value = '';
    export let language = 'javascript';

    let editor;
    let editorElement;
    let monacoRef: any;

    onMount(async () => {
    const monaco = await import('monaco-editor');
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
            fontSize: 14,
            minimap: {
                enabled: false
            }
        });

        editor.onDidChangeModelContent(() => {
            value = editor.getValue();
        });

        return () => {
            editor.dispose();
        };
    });

    // Update language reactively
    $: if (editor && monacoRef) {
        const model = editor.getModel();
        if (model) {
            monacoRef.editor.setModelLanguage(model, language);
        }
    }

    // Update editor content when `value` prop changes externally (e.g., language switch)
    $: if (editor && typeof value === 'string') {
        const current = editor.getValue();
        if (current !== value) {
            editor.setValue(value);
        }
    }
</script>

<div bind:this={editorElement} />

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>