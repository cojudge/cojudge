import messages from './monaco-ru.json';

/** Monaco reads its global message table when the editor modules are imported. */
export function installRussianMonacoMessages(): void {
    const scope = globalThis as typeof globalThis & {
        _VSCODE_NLS_MESSAGES?: string[];
        _VSCODE_NLS_LANGUAGE?: string;
    };
    scope._VSCODE_NLS_MESSAGES = messages;
    scope._VSCODE_NLS_LANGUAGE = 'ru';
}
