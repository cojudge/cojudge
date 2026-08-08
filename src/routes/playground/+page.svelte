<script lang="ts">
    import { page } from '$app/stores';
    import PlaygroundExecutionPanel from '$lib/components/PlaygroundExecutionPanel.svelte';
    import CloudSyncModal from '$lib/components/CloudSyncModal.svelte';
    import LanguageIcon from '$lib/components/LanguageIcon.svelte';
    import ShareModal from '$lib/components/ShareModal.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Whiteboard from '$lib/components/Whiteboard.svelte';
    import { showAlert, showConfirm } from '$lib/dialogs';
    import { consumeForkTransfer } from '$lib/forkTransfer';
    import { ensureAuthenticated, initFirebase } from '$lib/firebase';
    import { isDesktopRuntime } from '$lib/firebaseSettings';
    import { cloudSyncState } from '$lib/cloudSync';
    import { WHITEBOARD_FILE_ID } from '$lib/cloudFileChange';
    import { CLOUD_FLUSH_EVENT, isCloudRestoreInProgress, writeProgressStorageItem } from '$lib/progressBackup';
    import codeStore from '$lib/stores/codeStore.js';
    import fileStore, { isDotFileName, type FileEntry, fileSyncVersion } from '$lib/stores/fileStore.js';
    import userSettingsStorage, { type ThemeChoice, type ActivePanel } from '$lib/stores/userSettingsStorage';
    import { type ProgrammingLanguage } from '$lib/utils/util.js';
    import { renderMarkdown, renderMarkdownPlain, htmlToMarkdown, wrapImageThumbnails, wrapCodeBlocksWithCopy, ensureTrailingEmptyLine, ensureFileMentionCarets, prepareTaskListCheckboxes, isTaskListItem, isEmptyTaskListItem, createTaskCheckbox, ensureTaskCheckbox, ensureTaskItemCaretAnchor, removeTaskCheckbox, inlineCodeSpanHtml, INLINE_CODE_STYLE_MARKER, THUMB_WRAPPER_CLASS, THUMB_DELETE_CLASS, CODE_COPY_WRAPPER_CLASS, resolvePastedImages, isUrlLike, normalizeUrl, linkHtml, parsePlaygroundFileId, playgroundFileHref, fileMentionHtml, FILE_MENTION_CLASS } from '$lib/utils/markdown';
    import { storePastedImage, deletePastedImage, inlinePastedImageLinks } from '$lib/utils/imageStore';
    import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
    import QRCode from 'qrcode';
    import { browser } from '$app/environment';
    import { onMount, tick, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { v4 as uuidv4 } from 'uuid';

    const problemId = 'playground';
    const isDesktopMode = browser && isDesktopRuntime();
    let CodeEditor: any = null;
    let language: ProgrammingLanguage = $userSettingsStorage.playgroundPreferredLanguage ?? 'java';
    const fileKey = () => `${problemId}`;
    const codeKey = () => `${problemId}:${language}`;
    let showCloudSettings = false;
    let cloudActivityButton: HTMLButtonElement | null = null;

    function openCloudSettings() {
        showCloudSettings = true;
    }

    async function closeCloudSettings() {
        showCloudSettings = false;
        await tick();
        cloudActivityButton?.focus();
    }

    const starterCode = {
        java: `public class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}`,
        python: `# your code goes here`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`,
        csharp: `using System;

class Program
{
    static void Main()
    {
        // your code goes here
    }
}`,
        rust: `fn main() {
    // your code goes here
}`,
        go: `package main

func main() {
    // your code goes here
}`,
        typescript: `// your code goes here`,
        plaintext: ``,
        markdown: ``
    };
    const programmingLanguages: ProgrammingLanguage[] = ['java', 'cpp', 'python', 'typescript', 'csharp', 'rust', 'go', 'plaintext', 'markdown'];

    // Tabs are grouped by fileId (language-agnostic). Folders are not tabs.
    type TabMeta = { fileId: string; fileName: string; isOpen: boolean; lastUpdated?: number; type?: 'editor' | 'preview' | 'whiteboard'; sourceFileId?: string };

    function isSpecialTabType(type?: string): type is 'preview' | 'whiteboard' {
        return type === 'preview' || type === 'whiteboard';
    }

    type ExplorerNode = {
        fileId: string;
        fileName: string;
        kind: 'file' | 'folder';
        lastUpdated?: number;
        order: number;
        children: ExplorerNode[];
    };

    type FlatExplorerItem =
        | (ExplorerNode & { depth: number; kind: 'file' | 'folder' })
        | { kind: 'empty'; fileId: string; depth: number };

    /** Portable folder/file tree for download/import. fileId is kept when possible. */
    type ExportNode =
        | { type: 'folder'; name: string; fileId?: string; children: ExportNode[] }
        | { type: 'file'; name: string; fileId?: string; languages: Array<{ language: string; content: string; lastLanguage?: string }> };

    function getFiles(): FileEntry[] {
        try {
            const s = get(fileStore);
            return JSON.parse(s[fileKey()] || '[]') as FileEntry[];
        } catch (err) {
            return [];
        }
    }

    function getParentId(fileId: string): string | null {
        const entry = getFiles().find((f) => f.fileId === fileId);
        return entry?.parentId ?? null;
    }

    function getFilePath(fileId: string): string {
        const files = getFiles();
        const entry = files.find((f) => f.fileId === fileId);
        if (!entry) return '/';

        const targetId = entry.type === 'preview' && entry.sourceFileId ? entry.sourceFileId : fileId;
        const targetEntry = files.find((f) => f.fileId === targetId) ?? entry;

        const pathSegments: string[] = [];
        let currentParentId = targetEntry.parentId;
        const seen = new Set<string>();

        while (currentParentId && !seen.has(currentParentId)) {
            seen.add(currentParentId);
            const parentFolder = files.find((f) => f.fileId === currentParentId && isFolderEntry(f));
            if (parentFolder && parentFolder.fileName) {
                pathSegments.unshift(parentFolder.fileName);
            }
            currentParentId = parentFolder?.parentId ?? null;
        }

        if (pathSegments.length === 0) {
            return '/';
        }
        return '/' + pathSegments.join('/') + '/';
    }

    function isFolderEntry(f: FileEntry): boolean {
        return f.type === 'folder';
    }

    function isProgrammingLanguage(value: string): value is ProgrammingLanguage {
        return programmingLanguages.includes(value as ProgrammingLanguage);
    }

    function normalizeContent(content: string | undefined | null): string {
        return (content ?? '').replace(/\r\n/g, '\n').trim();
    }

    function hasNonDefaultContent(entry: FileEntry): entry is FileEntry & { language: ProgrammingLanguage } {
        if (!isProgrammingLanguage(entry.language)) return false;
        const content = normalizeContent(entry.content);
        return content !== '' && content !== normalizeContent(starterCode[entry.language] ?? '');
    }

    // True while the active tab exists only in memory with untouched starter
    // content. Such tabs stay unpersisted so that merely opening the
    // playground does not create local data (e.g. for cloud sync).
    function isPristineStarterTab(): boolean {
        const tab = tabs[activeTabId];
        if (!tab || isSpecialTabType(tab.type)) return false;
        const persisted = getFiles().some((x) => x.fileId === tab.fileId && x.language === language);
        if (persisted) return false;
        return normalizeContent(code) === normalizeContent(starterCode[language] ?? '');
    }

    function getLanguageForTab(fileId: string): ProgrammingLanguage {
        const tabFiles = getFiles().filter((f) => f.fileId === fileId);

        const stored = tabFiles.find((f) => f.lastLanguage && isProgrammingLanguage(f.lastLanguage));
        if (stored) return stored.lastLanguage as ProgrammingLanguage;

        const nonDefaultFiles = tabFiles.filter(hasNonDefaultContent);
        if (nonDefaultFiles.length > 0) {
            const lastEditedFile = nonDefaultFiles.reduce((latest, candidate) =>
                (candidate.lastUpdated ?? 0) >= (latest.lastUpdated ?? 0) ? candidate : latest
            );
            return lastEditedFile.language;
        }

        const languageFiles = tabFiles.filter((f): f is FileEntry & { language: ProgrammingLanguage } =>
            isProgrammingLanguage(f.language)
        );
        if (languageFiles.length > 0) {
            const lastUsedFile = languageFiles.reduce((latest, candidate) =>
                (candidate.lastUpdated ?? 0) >= (latest.lastUpdated ?? 0) ? candidate : latest
            );
            return lastUsedFile.language;
        }

        return language;
    }

    function setLastLanguage(fileId: string, lang: ProgrammingLanguage) {
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            let changed = false;
            for (const f of files) {
                if (f.fileId === fileId && !isFolderEntry(f) && !isSpecialTabType(f.type) && f.lastLanguage !== lang) {
                    f.lastLanguage = lang;
                    changed = true;
                }
            }
            if (!changed) return s;
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    function getInitialTabs(): TabMeta[] {
        const files = getFiles();
        const nonFolderFiles = files.filter((f) => !isFolderEntry(f));
        if (!nonFolderFiles.length && !files.some(isFolderEntry)) {
            // Create a default tab; the language-specific entry will be created lazily
            return [{ fileId: uuidv4(), fileName: 'New File', isOpen: true, lastUpdated: Date.now() }];
        }
        if (!nonFolderFiles.length) {
            return [];
        }
        const groups = new Map<string, { fileId: string; fileName: string; order: number | null; firstIndex: number; lastUpdated: number; isOpen: boolean; type?: 'editor' | 'preview' | 'whiteboard'; sourceFileId?: string }>();
        nonFolderFiles.forEach((f, idx) => {
            const existing = groups.get(f.fileId);
            const orderVal = (typeof f.order === 'number') ? f.order : null;
            const lv = f.lastUpdated || (f as any).lastViewed || 0;
            const open = f.isOpen === true;
            const entryType: 'editor' | 'preview' | 'whiteboard' =
                f.type === 'preview' ? 'preview' : f.type === 'whiteboard' ? 'whiteboard' : 'editor';
            if (!existing) {
                let name = entryType === 'whiteboard' ? 'Whiteboard' : (f.fileName || 'Solution');
                if (entryType === 'preview' && name.startsWith('Preview: ')) {
                    name = name.slice('Preview: '.length) || 'Solution';
                }
                groups.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: name,
                    order: orderVal,
                    firstIndex: idx,
                    lastUpdated: lv,
                    isOpen: open,
                    type: entryType,
                    sourceFileId: f.sourceFileId
                });
            } else {
                if (orderVal !== null) {
                    if (existing.order === null || orderVal < existing.order) existing.order = orderVal;
                }
                if (lv > existing.lastUpdated) existing.lastUpdated = lv;
                if (f.isOpen !== undefined) existing.isOpen = f.isOpen;
                if (f.type === 'preview') {
                    existing.type = 'preview';
                    if (existing.fileName.startsWith('Preview: ')) {
                        existing.fileName = existing.fileName.slice('Preview: '.length) || 'Solution';
                    }
                }
                if (f.type === 'whiteboard') {
                    existing.type = 'whiteboard';
                    existing.fileName = 'Whiteboard';
                }
                if (f.sourceFileId) existing.sourceFileId = f.sourceFileId;
            }
        });
        const list = Array.from(groups.values());
        list.sort((a, b) => {
            const ao = a.order; const bo = b.order;
            if (ao !== null && bo !== null) return ao - bo;
            if (ao !== null) return -1;
            if (bo !== null) return 1;
            // Fallback to first appearance order in stored array
            return a.firstIndex - b.firstIndex;
        });
        if (nonFolderFiles.find(x => x.language === language)) {
            code = nonFolderFiles.find(x => x.language === language)!.content;
        }
        return list.map((g) => ({ fileId: g.fileId, fileName: g.fileName, isOpen: g.isOpen, lastUpdated: g.lastUpdated, type: g.type, sourceFileId: g.sourceFileId }));
    }

    let suppressSave = true; // prevent save during programmatic loads
    let skipNextSave = false; // prevent save when code was loaded from cross-tab sync

    async function loadOrInitFile(lang: ProgrammingLanguage) {
        if (activeTabId < 0 || activeTabId >= tabs.length) return;
        const currentId = tabs[activeTabId].fileId;
        const files = getFiles();
        const entry = files.find((x) => x.fileId === currentId && x.language === lang);
        suppressSave = true;
        if (entry) {
            code = entry.content;
            currentViewState = entry.viewState ?? null;
            output = entry.output || '';
            logs = entry.logs || '';
            lastSharedContent = entry.lastSharedContent;
        } else {
            // Keep untouched starter content in memory only; it is persisted
            // on the first real edit (see isPristineStarterTab).
            const cStore = get(codeStore);
            const starter = cStore[codeKey()] ?? starterCode[lang] ?? '';
            code = starter;
            currentViewState = null;
            output = '';
            logs = '';
            lastSharedContent = undefined;
        }

        await tick();
        suppressSave = false;
    }

    let code: string;
    let currentViewState: string | null = null;
    let editorComponent: any;
    let output: string = '';
    let logs: string = '';
    let lastSharedContent: string | undefined;
    let showSettings = false;
    let settingsContainer: HTMLElement | null = null;
    let debugBreakpoints: number[] = [];
    let activeDebugLine: number | null = null;
    let debugJobId: string | null = null;
    const fontSizes: number[] = Array.from({ length: 24 }, (_, i) => 12 + i); // 12..35
    let fontSize: number = $userSettingsStorage.editorFontSize ?? 14;
    let theme: ThemeChoice = $userSettingsStorage.theme ?? 'light';
    let vimMode: 'off' | 'on' = $userSettingsStorage.vimMode ?? 'off';

    let tabs: TabMeta[] = getInitialTabs();
    let activeTabId: number = (() => {
        let bestIdx = -1;
        let maxViewed = -1;
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].isOpen) {
                const lv = tabs[i].lastUpdated || 0;
                if (lv > maxViewed) {
                    maxViewed = lv;
                    bestIdx = i;
                }
            }
        }
        return bestIdx !== -1 ? bestIdx : 0;
    })();
    {
        const initialTab = tabs[activeTabId];
        if (initialTab && !isSpecialTabType(initialTab.type)) {
            language = getLanguageForTab(initialTab.fileId);
        }
    }
    let editingTabId: string | null = null;
    let editingName = '';
    let renameInputEl: HTMLInputElement | null = null;

    let renamingSource: 'sidebar' | 'tab' | null = null;
    let showAddMenu = false;
    let addMenuContainer: HTMLElement | null = null;
    let importInputEl: HTMLInputElement | null = null;
    let contextMenu: { x: number; y: number; parentId: string | null } | null = null;
    let contextMenuEl: HTMLElement | null = null;
    // Collapse state is device-local UI preference: it is kept in localStorage
    // but not in CLOUD_KEYS, so cloud sync never collects or restores it.
    const COLLAPSED_FOLDERS_KEY = 'playground-collapsed-folders';
    // Devices that have never stored a preference get all folders collapsed on
    // first load instead of everything expanded; the seeded state is then
    // persisted like any other toggle. Existing preferences keep working.
    const hasCollapsedPreference = browser && localStorage.getItem(COLLAPSED_FOLDERS_KEY) !== null;
    /** folderId -> expanded; missing means expanded by default */
    let collapsedFolders: Record<string, boolean> = browser
        ? (JSON.parse(localStorage.getItem(COLLAPSED_FOLDERS_KEY) || '{}') || {})
        : {};
    let collapsePrefSeeded = hasCollapsedPreference;
    $: if (browser) writeProgressStorageItem(localStorage, COLLAPSED_FOLDERS_KEY, JSON.stringify(collapsedFolders));

    // Last markdown view mode is device-local only (not in CLOUD_KEYS).
    type MarkdownViewMode = 'wysiwyg' | 'preview' | 'source';
    const MARKDOWN_MODE_KEY = 'playground-markdown-mode';
    function readMarkdownMode(): MarkdownViewMode {
        if (!browser) return 'wysiwyg';
        const value = localStorage.getItem(MARKDOWN_MODE_KEY);
        return value === 'wysiwyg' || value === 'preview' || value === 'source' ? value : 'wysiwyg';
    }
    let lastMarkdownMode: MarkdownViewMode = readMarkdownMode();
    function persistMarkdownMode(mode: MarkdownViewMode) {
        lastMarkdownMode = mode;
        if (browser) writeProgressStorageItem(localStorage, MARKDOWN_MODE_KEY, mode);
    }
    let explorerDragOverId: string | null = null;
    let explorerDragOverRoot = false;

    function isFolderExpanded(folderId: string): boolean {
        return !collapsedFolders[folderId];
    }

    function toggleFolderExpanded(folderId: string) {
        collapsedFolders = { ...collapsedFolders, [folderId]: !collapsedFolders[folderId] };
    }

    function nextOrder(files: FileEntry[]): number {
        let max = -1;
        for (const f of files) {
            if (typeof f.order === 'number' && f.order > max) max = f.order;
        }
        return max + 1;
    }

    function uniqueName(base: string, existing: string[]): string {
        if (!existing.includes(base)) return base;
        let n = 1;
        while (existing.includes(`${base}-${n}`)) n++;
        return `${base}-${n}`;
    }

    function collectDescendantIds(rootId: string, files: FileEntry[]): Set<string> {
        const ids = new Set<string>([rootId]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const f of files) {
                if (f.parentId && ids.has(f.parentId) && !ids.has(f.fileId)) {
                    ids.add(f.fileId);
                    changed = true;
                }
            }
        }
        return ids;
    }

    function isDescendantOf(ancestorId: string, maybeDescendantId: string): boolean {
        const files = getFiles();
        let current: string | null | undefined = maybeDescendantId;
        const seen = new Set<string>();
        while (current) {
            if (current === ancestorId) return true;
            if (seen.has(current)) break;
            seen.add(current);
            current = files.find((f) => f.fileId === current)?.parentId;
        }
        return false;
    }

    $: explorerTree = (() => {
        // Depend on fileStore + tabs so renames and moves refresh the tree
        void $fileStore;
        const files = getFiles();
        type Item = {
            fileId: string;
            fileName: string;
            kind: 'file' | 'folder';
            parentId: string | null;
            order: number;
            lastUpdated?: number;
            firstIndex: number;
        };
        const items = new Map<string, Item>();

        files.forEach((f, idx) => {
            if (isSpecialTabType(f.type)) return;
            if (isFolderEntry(f)) {
                const orderVal = typeof f.order === 'number' ? f.order : idx;
                items.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: f.fileName || 'Folder',
                    kind: 'folder',
                    parentId: f.parentId ?? null,
                    order: orderVal,
                    lastUpdated: f.lastUpdated,
                    firstIndex: idx
                });
                return;
            }
            const existing = items.get(f.fileId);
            const orderVal = typeof f.order === 'number' ? f.order : idx;
            const lv = f.lastUpdated || 0;
            if (!existing) {
                items.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: f.fileName || 'Solution',
                    kind: 'file',
                    parentId: f.parentId ?? null,
                    order: orderVal,
                    lastUpdated: lv,
                    firstIndex: idx
                });
            } else {
                if (orderVal < existing.order) existing.order = orderVal;
                if (lv > (existing.lastUpdated ?? 0)) existing.lastUpdated = lv;
                if (f.parentId !== undefined) existing.parentId = f.parentId ?? null;
                if (f.fileName) existing.fileName = f.fileName;
            }
        });

        // Include pristine in-memory tabs not yet in the store
        tabs.forEach((t, idx) => {
            if (isSpecialTabType(t.type)) return;
            if (items.has(t.fileId)) {
                const it = items.get(t.fileId)!;
                it.fileName = t.fileName;
                if ((t.lastUpdated ?? 0) > (it.lastUpdated ?? 0)) it.lastUpdated = t.lastUpdated;
                return;
            }
            items.set(t.fileId, {
                fileId: t.fileId,
                fileName: t.fileName,
                kind: 'file',
                parentId: null,
                order: idx,
                lastUpdated: t.lastUpdated,
                firstIndex: 100000 + idx
            });
        });

        const nodeMap = new Map<string, ExplorerNode>();
        for (const it of items.values()) {
            nodeMap.set(it.fileId, {
                fileId: it.fileId,
                fileName: it.fileName,
                kind: it.kind,
                lastUpdated: it.lastUpdated,
                order: it.order,
                children: []
            });
        }

        const roots: ExplorerNode[] = [];
        for (const it of items.values()) {
            const node = nodeMap.get(it.fileId)!;
            if (it.parentId && nodeMap.has(it.parentId) && nodeMap.get(it.parentId)!.kind === 'folder') {
                nodeMap.get(it.parentId)!.children.push(node);
            } else {
                roots.push(node);
            }
        }

        const sortRec = (nodes: ExplorerNode[]) => {
            nodes.sort((a, b) => {
                if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
                if (a.order !== b.order) return a.order - b.order;
                return a.fileName.localeCompare(b.fileName);
            });
            for (const n of nodes) sortRec(n.children);
        };
        sortRec(roots);
        return roots;
    })();

    function flattenExplorer(
        nodes: ExplorerNode[],
        collapsed: Record<string, boolean> = collapsedFolders,
        depth = 0
    ): FlatExplorerItem[] {
        const result: FlatExplorerItem[] = [];
        for (const n of nodes) {
            result.push({ ...n, depth });
            if (n.kind === 'folder' && !collapsed[n.fileId]) {
                if (n.children.length === 0) {
                    result.push({ kind: 'empty', fileId: `${n.fileId}__empty`, depth: depth + 1 });
                } else {
                    result.push(...flattenExplorer(n.children, collapsed, depth + 1));
                }
            }
        }
        return result;
    }

    // Explicit collapsedFolders dep so expand/collapse always refreshes the tree
    $: flatExplorer = flattenExplorer(explorerTree, collapsedFolders);

    // Seed the collapsed state once when the first files appear on a fresh
    // device (e.g. after sign-in), so the tree starts collapsed.
    $: if (browser && !collapsePrefSeeded && explorerTree.length > 0) {
        const seed: Record<string, boolean> = {};
        const markCollapsed = (nodes: ExplorerNode[]) => {
            for (const n of nodes) {
                if (n.kind === 'folder') {
                    seed[n.fileId] = true;
                    markCollapsed(n.children);
                }
            }
        };
        markCollapsed(explorerTree);
        collapsedFolders = seed;
        collapsePrefSeeded = true;
    }

    function expandAncestorFolders(fileId: string) {
        const files = getFiles();
        let parentId: string | null | undefined = files.find((f) => f.fileId === fileId)?.parentId ?? null;
        if (!parentId) return;
        let next = { ...collapsedFolders };
        let changed = false;
        const seen = new Set<string>();
        while (parentId && !seen.has(parentId)) {
            seen.add(parentId);
            if (next[parentId]) {
                next[parentId] = false;
                changed = true;
            }
            parentId = files.find((f) => f.fileId === parentId)?.parentId ?? null;
        }
        if (changed) collapsedFolders = next;
    }

    function startRename(fileId: string, currentName: string, source: 'sidebar' | 'tab') {
        const tab = tabs.find((t) => t.fileId === fileId);
        if (tab?.type === 'whiteboard') return;
        editingTabId = fileId;
        editingName = currentName;
        renamingSource = source;
        // Focus the input on next tick
        tick().then(() => {
            renameInputEl?.focus();
            renameInputEl?.select();
        });
    }

    function applyRename() {
        if (!editingTabId) return;
        const newName = editingName.trim();
        const targetId = editingTabId;
        const targetTab = tabs.find(t => t.fileId === targetId);
        const oldName =
            targetTab?.fileName ||
            getFiles().find(f => f.fileId === targetId)?.fileName ||
            'Solution';
        const finalName = newName || oldName;
        // Preview tabs share a display name with their source markdown file.
        const linkedIds = new Set<string>([targetId]);
        if (targetTab?.type === 'preview' && targetTab.sourceFileId) {
            linkedIds.add(targetTab.sourceFileId);
        } else {
            for (const t of tabs) {
                if (t.type === 'preview' && t.sourceFileId === targetId) linkedIds.add(t.fileId);
            }
        }
        // Update tabs
        const now = Date.now();
        tabs = tabs.map(t => linkedIds.has(t.fileId) || (t.type === 'preview' && t.sourceFileId && linkedIds.has(t.sourceFileId))
            ? { ...t, fileName: finalName, lastUpdated: now }
            : t);
        // Update all store entries for this fileId
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                if (linkedIds.has(f.fileId) || (f.type === 'preview' && f.sourceFileId && linkedIds.has(f.sourceFileId))) {
                    f.fileName = finalName;
                    f.lastUpdated = now;
                }
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        editingTabId = null;
        editingName = '';
        renamingSource = null;
        renameInputEl = null;
    }

    function cancelRename() {
        editingTabId = null;
        editingName = '';
        renamingSource = null;
        renameInputEl = null;
    }

    // New tab state (simple add button)
    async function addNewTab(source: 'sidebar' | 'tab' = 'tab', parentId: string | null = null) {
        const files = getFiles();
        const siblingNames = files
            .filter((f) => (f.parentId ?? null) === parentId && !isFolderEntry(f))
            .map((f) => f.fileName);
        const fileName = uniqueName('New File', siblingNames);
        const nextId = uuidv4();
        const now = Date.now();
        tabs = [...tabs, { fileId: nextId, fileName, isOpen: true, lastUpdated: now }];
        const newCode = starterCode[language] ?? '';
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = [
                ...files,
                {
                    fileId: nextId,
                    fileName,
                    language: language,
                    lastLanguage: language,
                    content: newCode,
                    viewState: null,
                    output: '',
                    logs: '',
                    isActive: false,
                    order: nextOrder(files),
                    isOpen: true,
                    lastUpdated: now,
                    parentId: parentId
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        if (parentId) collapsedFolders = { ...collapsedFolders, [parentId]: false };
        activeTabId = tabs.length - 1;
        await loadOrInitFile(language);
        persistTabOrder();
        startRename(nextId, fileName, source);
    }

    function addNewFolder(parentId: string | null = null) {
        const files = getFiles();
        const siblingNames = files
            .filter((f) => (f.parentId ?? null) === parentId && isFolderEntry(f))
            .map((f) => f.fileName);
        const fileName = uniqueName('Folder', siblingNames);
        const nextId = uuidv4();
        const now = Date.now();
        const fkey = fileKey();
        fileStore.update((s) => {
            let list = JSON.parse(s[fkey] || '[]') as FileEntry[];
            list = [
                ...list,
                {
                    fileId: nextId,
                    fileName,
                    content: '',
                    language: 'plaintext',
                    isActive: false,
                    type: 'folder',
                    parentId,
                    order: nextOrder(list),
                    lastUpdated: now
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(list) };
        });
        if (parentId) collapsedFolders = { ...collapsedFolders, [parentId]: false };
        startRename(nextId, fileName, 'sidebar');
    }

    async function duplicateFile(sourceFileId: string, sourceFileName: string) {
        const files = getFiles();
        const sourceEntries = files.filter(f => f.fileId === sourceFileId && !isFolderEntry(f));
        if (!sourceEntries.length) return;

        const nextId = uuidv4();
        const now = Date.now();
        const match = sourceFileName.match(/^(.*\D)(\d+)$/);
        const fileName = match ? `${match[1]}${parseInt(match[2], 10) + 1}` : `${sourceFileName}-1`;
        const parentId = sourceEntries[0].parentId ?? null;

        tabs = [...tabs, { fileId: nextId, fileName, isOpen: true, lastUpdated: now }];
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const entry of sourceEntries) {
                files.push({
                    ...entry,
                    fileId: nextId,
                    fileName,
                    content: entry.content,
                    output: '',
                    logs: '',
                    isActive: false,
                    order: nextOrder(files),
                    isOpen: true,
                    lastUpdated: now,
                    viewState: null,
                    parentId,
                    shareId: undefined,
                    lastSharedContent: undefined
                });
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        await loadOrInitFile(language);
        persistTabOrder();
        startRename(nextId, fileName, 'sidebar');
    }

    function buildExportNode(fileId: string, files: FileEntry[]): ExportNode | null {
        const entry = files.find((f) => f.fileId === fileId);
        if (!entry) return null;
        if (isFolderEntry(entry)) {
            const childIds = new Set<string>();
            for (const f of files) {
                if ((f.parentId ?? null) === fileId) childIds.add(f.fileId);
            }
            // Stable order: folders first then by order
            const childList = Array.from(childIds)
                .map((id) => {
                    const e = files.find((f) => f.fileId === id)!;
                    return { id, order: typeof e.order === 'number' ? e.order : 0, kind: isFolderEntry(e) ? 0 : 1, name: e.fileName };
                })
                .sort((a, b) => a.kind - b.kind || a.order - b.order || a.name.localeCompare(b.name));
            const children: ExportNode[] = [];
            for (const c of childList) {
                const node = buildExportNode(c.id, files);
                if (node) children.push(node);
            }
            return { type: 'folder', fileId: entry.fileId, name: entry.fileName, children };
        }
        const langEntries = files.filter((f) => f.fileId === fileId && !isFolderEntry(f) && !isSpecialTabType(f.type));
        return {
            type: 'file',
            fileId: entry.fileId,
            name: entry.fileName,
            languages: langEntries.map((f) => ({
                language: f.language,
                content: f.content ?? '',
                ...(f.lastLanguage ? { lastLanguage: f.lastLanguage } : {})
            }))
        };
    }

    async function revealExportedFile(filePath: string | undefined) {
        if (!filePath) return;
        try {
            await fetch('/api/reveal-file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath })
            });
        } catch (error) {
            console.error('Failed to reveal file:', error);
        }
    }

    // Replaces IndexedDB fake image links in markdown with their data URLs so
    // downloaded folders are self-contained outside the app.
    async function inlineExportNodeImages(node: ExportNode): Promise<ExportNode> {
        if (node.type === 'folder') {
            return { ...node, children: await Promise.all(node.children.map(inlineExportNodeImages)) };
        }
        const languages = await Promise.all(
            node.languages.map(async (lang) =>
                lang.language === 'markdown'
                    ? { ...lang, content: await inlinePastedImageLinks(lang.content) }
                    : lang
            )
        );
        return { ...node, languages };
    }

    async function downloadFolder(folderId: string) {
        const files = getFiles();
        const node = buildExportNode(folderId, files);
        if (!node || node.type !== 'folder') return;
        const textData = JSON.stringify(await inlineExportNodeImages(node), null, 2);
        const filename = `${node.name || 'folder'}.json`;

        if (isDesktopMode) {
            try {
                const response = await fetch('/api/export-file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ textData, filename })
                });
                const result = await response.json();
                if (result.success) {
                    void revealExportedFile(result.filePath);
                    await showAlert(`Saved to ${result.filePath}`, { title: 'Folder downloaded' });
                } else {
                    await showAlert(result.error || 'Failed to save file', { title: 'Download failed' });
                }
            } catch (error: any) {
                await showAlert(error?.message || 'Failed to save file', { title: 'Download failed' });
            }
            return;
        }

        const blob = new Blob([textData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    function isExportNode(value: unknown): value is ExportNode {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
        const v = value as Record<string, unknown>;
        if (v.fileId !== undefined && typeof v.fileId !== 'string') return false;
        if (v.type === 'folder') {
            return typeof v.name === 'string' && Array.isArray(v.children);
        }
        if (v.type === 'file') {
            return typeof v.name === 'string' && Array.isArray(v.languages);
        }
        return false;
    }

    // Reuse exported fileId when free; otherwise mint a new one. Records old→new in idMap.
    function resolveImportFileId(
        preferred: string | undefined,
        usedIds: Set<string>,
        idMap: Map<string, string>
    ): string {
        if (preferred && !usedIds.has(preferred)) {
            usedIds.add(preferred);
            return preferred;
        }
        let id = uuidv4();
        while (usedIds.has(id)) id = uuidv4();
        usedIds.add(id);
        if (preferred) idMap.set(preferred, id);
        return id;
    }

    // Rewrite playground file mention links when import had to remap fileIds.
    function rewritePlaygroundFileIdsInContent(content: string, idMap: Map<string, string>): string {
        if (!content || idMap.size === 0) return content;
        return content.replace(
            /(\/playground\?(?:[^)\s#]*&)?)fileId=([^)\s&#]+)/g,
            (match, prefix: string, rawId: string) => {
                let oldId = rawId;
                try {
                    oldId = decodeURIComponent(rawId);
                } catch {
                    /* keep raw */
                }
                const nextId = idMap.get(oldId);
                if (!nextId) return match;
                return `${prefix}fileId=${encodeURIComponent(nextId)}`;
            }
        );
    }

    function importExportNode(
        node: ExportNode,
        parentId: string | null,
        files: FileEntry[],
        usedIds: Set<string>,
        idMap: Map<string, string>
    ): FileEntry[] {
        const now = Date.now();
        const preferred = typeof node.fileId === 'string' && node.fileId.trim() ? node.fileId.trim() : undefined;
        if (node.type === 'folder') {
            const folderId = resolveImportFileId(preferred, usedIds, idMap);
            files.push({
                fileId: folderId,
                fileName: node.name || 'Folder',
                content: '',
                language: 'plaintext',
                isActive: false,
                type: 'folder',
                parentId,
                order: nextOrder(files),
                lastUpdated: now
            } as FileEntry);
            for (const child of node.children) {
                if (isExportNode(child)) importExportNode(child, folderId, files, usedIds, idMap);
            }
            return files;
        }
        const fileId = resolveImportFileId(preferred, usedIds, idMap);
        const langs = node.languages?.length
            ? node.languages
            : [{ language: 'plaintext', content: '' }];
        for (const lang of langs) {
            if (!lang || typeof lang.language !== 'string') continue;
            files.push({
                fileId,
                fileName: node.name || 'Solution',
                language: lang.language,
                lastLanguage: typeof lang.lastLanguage === 'string' ? lang.lastLanguage : lang.language,
                content: typeof lang.content === 'string' ? lang.content : '',
                isActive: false,
                order: nextOrder(files),
                isOpen: false,
                lastUpdated: now,
                parentId,
                output: '',
                logs: '',
                viewState: null
            } as FileEntry);
        }
        return files;
    }

    function handleImportFile(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result || ''));
                if (!isExportNode(parsed)) {
                    showAlert('Invalid folder export file.', { title: 'Import failed' });
                    return;
                }
                const fkey = fileKey();
                const createdFileIds: string[] = [];
                fileStore.update((s) => {
                    let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                    const before = new Set(files.map((f) => f.fileId));
                    const usedIds = new Set(files.map((f) => f.fileId));
                    const idMap = new Map<string, string>();
                    importExportNode(parsed, null, files, usedIds, idMap);
                    // If any ids were remapped due to conflicts, rewrite mention links in imported content.
                    if (idMap.size > 0) {
                        for (const f of files) {
                            if (before.has(f.fileId)) continue;
                            if (typeof f.content !== 'string' || !f.content.includes('fileId=')) continue;
                            f.content = rewritePlaygroundFileIdsInContent(f.content, idMap);
                        }
                    }
                    for (const f of files) {
                        if (!before.has(f.fileId) && !isFolderEntry(f) && !isSpecialTabType(f.type)) {
                            createdFileIds.push(f.fileId);
                        }
                    }
                    return { ...s, [fkey]: JSON.stringify(files) };
                });
                // Refresh tabs for newly imported files
                const files = getFiles();
                const existingIds = new Set(tabs.map((t) => t.fileId));
                const additions: TabMeta[] = [];
                const seen = new Set<string>();
                for (const f of files) {
                    if (isFolderEntry(f) || isSpecialTabType(f.type)) continue;
                    if (existingIds.has(f.fileId) || seen.has(f.fileId)) continue;
                    if (!createdFileIds.includes(f.fileId)) continue;
                    seen.add(f.fileId);
                    additions.push({
                        fileId: f.fileId,
                        fileName: f.fileName,
                        isOpen: false,
                        lastUpdated: f.lastUpdated
                    });
                }
                if (additions.length) tabs = [...tabs, ...additions];
            } catch {
                showAlert('Could not parse the selected JSON file.', { title: 'Import failed' });
            }
        };
        reader.readAsText(file);
    }

    function moveEntryToParent(sourceId: string, newParentId: string | null, beforeSiblingId?: string | null) {
        if (sourceId === newParentId) return;
        if (newParentId && isDescendantOf(sourceId, newParentId)) return;

        const files = getFiles();
        const source = files.find((f) => f.fileId === sourceId);
        if (!source) {
            // pristine tab only in memory
            if (!tabs.some((t) => t.fileId === sourceId)) return;
        } else if (newParentId) {
            const parent = files.find((f) => f.fileId === newParentId);
            if (!parent || !isFolderEntry(parent)) return;
        }

        const fkey = fileKey();
        const now = Date.now();
        fileStore.update((s) => {
            let list = JSON.parse(s[fkey] || '[]') as FileEntry[];
            // Ensure pristine tab gets a store row when moved into a folder
            if (!list.some((f) => f.fileId === sourceId)) {
                const tab = tabs.find((t) => t.fileId === sourceId);
                if (tab) {
                    list.push({
                        fileId: sourceId,
                        fileName: tab.fileName,
                        language,
                        lastLanguage: language,
                        content: code,
                        isActive: false,
                        order: nextOrder(list),
                        isOpen: tab.isOpen,
                        lastUpdated: now,
                        parentId: newParentId
                    } as FileEntry);
                }
            }

            const siblings = list.filter(
                (f) => (f.parentId ?? null) === newParentId && f.fileId !== sourceId
            );
            // Unique by fileId for ordering
            const siblingOrderIds: string[] = [];
            for (const f of siblings) {
                if (!siblingOrderIds.includes(f.fileId)) siblingOrderIds.push(f.fileId);
            }
            siblingOrderIds.sort((a, b) => {
                const ao = list.find((f) => f.fileId === a)?.order ?? 0;
                const bo = list.find((f) => f.fileId === b)?.order ?? 0;
                return ao - bo;
            });

            if (beforeSiblingId && siblingOrderIds.includes(beforeSiblingId)) {
                const idx = siblingOrderIds.indexOf(beforeSiblingId);
                siblingOrderIds.splice(idx, 0, sourceId);
            } else {
                siblingOrderIds.push(sourceId);
            }

            const orderMap = new Map<string, number>();
            siblingOrderIds.forEach((id, i) => orderMap.set(id, i));

            for (const f of list) {
                if (f.fileId === sourceId) {
                    f.parentId = newParentId;
                    f.lastUpdated = now;
                    const o = orderMap.get(sourceId);
                    if (o !== undefined) f.order = o;
                } else if ((f.parentId ?? null) === newParentId && orderMap.has(f.fileId)) {
                    f.order = orderMap.get(f.fileId)!;
                }
            }
            return { ...s, [fkey]: JSON.stringify(list) };
        });
        if (newParentId) collapsedFolders = { ...collapsedFolders, [newParentId]: false };
    }

    function toggleCloudVisibility(fileId: string, currentName: string) {
        if (currentName === '.' || currentName === '..') return;
        const nextName = isDotFileName(currentName) ? currentName.slice(1) : `.${currentName}`;
        if (nextName === currentName) return;
        const now = Date.now();
        tabs = tabs.map(t => t.fileId === fileId ? { ...t, fileName: nextName, lastUpdated: now } : t);
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                if (f.fileId === fileId) {
                    f.fileName = nextName;
                    f.lastUpdated = now;
                }
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    function persistTabOrder() {
        const fkey = fileKey();
        const orderById = new Map<string, number>();
        tabs.forEach((t, idx) => orderById.set(t.fileId, idx));
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];

            // Remove special tabs (preview/whiteboard) that are no longer in tabs
            files = files.filter(f => !isSpecialTabType(f.type) || orderById.has(f.fileId));

            // Update order and properties for existing files
            for (const f of files) {
                const idx = orderById.get(f.fileId);
                if (idx !== undefined) {
                    f.order = idx;
                    const tab = tabs[idx];
                    f.isOpen = tab.isOpen;
                    if (tab.type === 'preview') {
                        f.type = 'preview';
                        f.sourceFileId = tab.sourceFileId;
                    } else if (tab.type === 'whiteboard') {
                        f.type = 'whiteboard';
                        f.fileName = 'Whiteboard';
                    }
                }
            }

            // Add missing special tabs
            tabs.forEach((t, idx) => {
                if (t.type === 'preview' && !files.find(f => f.fileId === t.fileId)) {
                    files.push({
                        fileId: t.fileId,
                        fileName: t.fileName,
                        language: 'markdown',
                        content: '',
                        isOpen: true,
                        lastUpdated: t.lastUpdated,
                        type: 'preview',
                        sourceFileId: t.sourceFileId,
                        order: idx
                    } as FileEntry);
                } else if (t.type === 'whiteboard' && !files.find(f => f.fileId === t.fileId)) {
                    files.push({
                        fileId: t.fileId,
                        fileName: 'Whiteboard',
                        language: 'plaintext',
                        content: '',
                        isOpen: t.isOpen,
                        lastUpdated: t.lastUpdated,
                        type: 'whiteboard',
                        order: idx
                    } as FileEntry);
                }
            });

            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    // --- Tab drag-and-drop reordering ---
    // HTML5 drag events are suppressed in Chromium by the tab's mousedown
    // preventDefault (which keeps focus in the editor), so tabs are reordered
    // with pointer events, same as the file explorer.
    type TabPointerDrag = { fileId: string; startX: number; startY: number; active: boolean; pointerId: number };
    let tabPointerDrag: TabPointerDrag | null = null;
    let tabDidDrag = false;
    /** Insertion index among visible tabs, -1 when not dragging */
    let tabDragInsertIndex = -1;

    function handleTabPointerDown(e: PointerEvent, fileId: string) {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest('button, input, a')) return;
        tabDidDrag = false;
        tabPointerDrag = { fileId, startX: e.clientX, startY: e.clientY, active: false, pointerId: e.pointerId };
        window.addEventListener('pointermove', onTabPointerMove);
        window.addEventListener('pointerup', onTabPointerUp);
        window.addEventListener('pointercancel', onTabPointerUp);
    }

    function onTabPointerMove(e: PointerEvent) {
        if (!tabPointerDrag || e.pointerId !== tabPointerDrag.pointerId) return;
        const dx = e.clientX - tabPointerDrag.startX;
        const dy = e.clientY - tabPointerDrag.startY;
        if (!tabPointerDrag.active) {
            if (Math.hypot(dx, dy) < 6) return;
            tabPointerDrag = { ...tabPointerDrag, active: true };
            tabDidDrag = true;
            document.body.classList.add('tab-dragging');
        }
        e.preventDefault();
        tabDragInsertIndex = computeTabInsertIndex(e.clientX);
    }

    function onTabPointerUp(e: PointerEvent) {
        if (!tabPointerDrag || e.pointerId !== tabPointerDrag.pointerId) return;
        const drag = tabPointerDrag;
        const wasActive = drag.active;
        const insertIndex = tabDragInsertIndex;
        window.removeEventListener('pointermove', onTabPointerMove);
        window.removeEventListener('pointerup', onTabPointerUp);
        window.removeEventListener('pointercancel', onTabPointerUp);
        document.body.classList.remove('tab-dragging');
        tabPointerDrag = null;
        tabDragInsertIndex = -1;
        if (!wasActive) {
            tabDidDrag = false;
            return;
        }
        e.preventDefault();
        if (insertIndex >= 0) {
            const fromIdx = tabs.findIndex((t) => t.fileId === drag.fileId);
            if (fromIdx >= 0 && fromIdx !== (fromIdx < insertIndex ? insertIndex - 1 : insertIndex)) {
                moveTabToIndex(drag.fileId, insertIndex);
            }
        }
        // Suppress the click that follows the drag
        setTimeout(() => { tabDidDrag = false; }, 0);
    }

    function computeTabInsertIndex(clientX: number): number {
        const els = Array.from(document.querySelectorAll<HTMLElement>('.editor-header .tab'));
        if (!els.length) return 0;
        for (let i = 0; i < els.length; i++) {
            const rect = els[i].getBoundingClientRect();
            if (clientX < rect.left + rect.width / 2) return i;
        }
        return els.length;
    }

    function moveTabToIndex(sourceFileId: string, insertIndex: number) {
        const fromIdx = tabs.findIndex((t) => t.fileId === sourceFileId);
        if (fromIdx < 0) return;
        const openCount = tabs.filter((t) => t.isOpen).length;
        insertIndex = Math.max(0, Math.min(insertIndex, openCount));
        const activeFileId = tabs[activeTabId]?.fileId;
        const updated = [...tabs];
        const [moved] = updated.splice(fromIdx, 1);
        const adjusted = fromIdx < insertIndex ? insertIndex - 1 : insertIndex;
        updated.splice(adjusted, 0, moved);
        tabs = updated;
        if (activeFileId) {
            const newIdx = tabs.findIndex((t) => t.fileId === activeFileId);
            if (newIdx !== -1) activeTabId = newIdx;
        }
        persistTabOrder();
    }

    function handleTabClick(t: TabMeta) {
        if (tabDidDrag) {
            tabDidDrag = false;
            return;
        }
        activateTab(t.fileId);
    }

    $: tabDropIndicatorStyle = (() => {
        if (tabDragInsertIndex < 0) return null;
        const bar = document.querySelector<HTMLElement>('.editor-header .tab-bar');
        if (!bar) return null;
        const barRect = bar.getBoundingClientRect();
        const els = Array.from(document.querySelectorAll<HTMLElement>('.editor-header .tab'));
        let left: number;
        if (!els.length) {
            left = 0;
        } else if (tabDragInsertIndex === 0) {
            left = els[0].getBoundingClientRect().left - barRect.left - 4;
        } else if (tabDragInsertIndex >= els.length) {
            left = els[els.length - 1].getBoundingClientRect().right - barRect.left + 4;
        } else {
            const prev = els[tabDragInsertIndex - 1].getBoundingClientRect();
            const next = els[tabDragInsertIndex].getBoundingClientRect();
            left = (prev.right + next.left) / 2 - barRect.left;
        }
        return `left: ${left}px`;
    })();

    // Pointer-based explorer drag (HTML5 DnD is flaky with nested tree rows)
    type ExplorerDropKind = 'file' | 'folder' | 'root';
    let explorerPointerDrag: {
        id: string;
        startX: number;
        startY: number;
        active: boolean;
        pointerId: number;
    } | null = null;
    let explorerDidDrag = false;

    function setExplorerDropHighlight(id: string | null, kind: ExplorerDropKind) {
        const nextFolderId = kind === 'folder' ? id : null;
        const nextRoot = kind === 'root';
        if (explorerDragOverId !== nextFolderId) explorerDragOverId = nextFolderId;
        if (explorerDragOverRoot !== nextRoot) explorerDragOverRoot = nextRoot;
    }

    function clearExplorerDropHighlight() {
        if (explorerDragOverId !== null) explorerDragOverId = null;
        if (explorerDragOverRoot) explorerDragOverRoot = false;
    }

    function resolveExplorerDropTarget(clientX: number, clientY: number): { id: string | null; kind: ExplorerDropKind } {
        const el = document.elementFromPoint(clientX, clientY);
        if (!el) return { id: null, kind: 'root' };
        const item = el.closest('[data-explorer-id]') as HTMLElement | null;
        if (item) {
            const id = item.dataset.explorerId || null;
            const kind = (item.dataset.explorerKind as ExplorerDropKind) || 'file';
            return { id, kind };
        }
        if (el.closest('.file-list')) return { id: null, kind: 'root' };
        return { id: null, kind: 'root' };
    }

    function applyExplorerDrop(sourceId: string, targetId: string | null, kind: ExplorerDropKind) {
        if (!sourceId) return;
        if (kind === 'folder' && targetId) {
            if (sourceId === targetId) return;
            moveEntryToParent(sourceId, targetId);
            return;
        }
        if (kind === 'file' && targetId) {
            if (sourceId === targetId) return;
            const targetParent = getParentId(targetId);
            moveEntryToParent(sourceId, targetParent, targetId);
            return;
        }
        if (kind === 'root') {
            moveEntryToParent(sourceId, null);
        }
    }

    function onExplorerPointerMove(e: PointerEvent) {
        if (!explorerPointerDrag || e.pointerId !== explorerPointerDrag.pointerId) return;
        const dx = e.clientX - explorerPointerDrag.startX;
        const dy = e.clientY - explorerPointerDrag.startY;
        if (!explorerPointerDrag.active) {
            if (Math.hypot(dx, dy) < 6) return;
            explorerPointerDrag = { ...explorerPointerDrag, active: true };
            explorerDidDrag = true;
            document.body.classList.add('explorer-dragging');
        }
        e.preventDefault();
        const target = resolveExplorerDropTarget(e.clientX, e.clientY);
        // Don't highlight the item being dragged
        if (target.id === explorerPointerDrag.id) {
            clearExplorerDropHighlight();
            return;
        }
        setExplorerDropHighlight(target.id, target.kind);
    }

    function onExplorerPointerUp(e: PointerEvent) {
        if (!explorerPointerDrag || e.pointerId !== explorerPointerDrag.pointerId) return;
        const drag = explorerPointerDrag;
        const wasActive = drag.active;
        window.removeEventListener('pointermove', onExplorerPointerMove);
        window.removeEventListener('pointerup', onExplorerPointerUp);
        window.removeEventListener('pointercancel', onExplorerPointerUp);
        document.body.classList.remove('explorer-dragging');
        explorerPointerDrag = null;
        clearExplorerDropHighlight();
        if (!wasActive) {
            explorerDidDrag = false;
            return;
        }
        e.preventDefault();
        const target = resolveExplorerDropTarget(e.clientX, e.clientY);
        if (target.id !== drag.id) {
            applyExplorerDrop(drag.id, target.id, target.kind);
        }
        // Suppress the click that follows pointerup after a drag
        setTimeout(() => { explorerDidDrag = false; }, 0);
    }

    function handleExplorerPointerDown(e: PointerEvent, fileId: string) {
        if (e.button !== 0) return;
        const target = e.target as HTMLElement | null;
        if (target?.closest('button, input, a, .file-actions')) return;
        explorerDidDrag = false;
        explorerPointerDrag = {
            id: fileId,
            startX: e.clientX,
            startY: e.clientY,
            active: false,
            pointerId: e.pointerId
        };
        window.addEventListener('pointermove', onExplorerPointerMove);
        window.addEventListener('pointerup', onExplorerPointerUp);
        window.addEventListener('pointercancel', onExplorerPointerUp);
    }

    function handleExplorerItemClick(node: FlatExplorerItem) {
        if (node.kind === 'empty') return;
        if (explorerDidDrag) {
            explorerDidDrag = false;
            return;
        }
        if (node.kind === 'folder') toggleFolderExpanded(node.fileId);
        else activateTab(node.fileId);
    }

    function closeContextMenu() {
        contextMenu = null;
        contextMenuEl = null;
    }

    function openExplorerContextMenu(e: MouseEvent, node: FlatExplorerItem) {
        e.preventDefault();
        e.stopPropagation();
        if (node.kind === 'empty') return;
        // Cancel any pending explorer drag started by the right-click mousedown
        if (explorerPointerDrag) {
            window.removeEventListener('pointermove', onExplorerPointerMove);
            window.removeEventListener('pointerup', onExplorerPointerUp);
            window.removeEventListener('pointercancel', onExplorerPointerUp);
            document.body.classList.remove('explorer-dragging');
            explorerPointerDrag = null;
            explorerDidDrag = false;
            clearExplorerDropHighlight();
        }
        showAddMenu = false;
        const parentId = node.kind === 'folder' ? node.fileId : getParentId(node.fileId);
        // Position within viewport
        const menuW = 150;
        const menuH = 80;
        const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
        const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
        contextMenu = { x: Math.max(8, x), y: Math.max(8, y), parentId };
        tick().then(() => {
            // Re-clamp using actual menu size if available
            if (!contextMenuEl || !contextMenu) return;
            const rect = contextMenuEl.getBoundingClientRect();
            const nx = Math.min(contextMenu.x, window.innerWidth - rect.width - 8);
            const ny = Math.min(contextMenu.y, window.innerHeight - rect.height - 8);
            if (nx !== contextMenu.x || ny !== contextMenu.y) {
                contextMenu = { ...contextMenu, x: Math.max(8, nx), y: Math.max(8, ny) };
            }
        });
    }

    function contextCreateFile() {
        const parentId = contextMenu?.parentId ?? null;
        closeContextMenu();
        if (parentId) {
            collapsedFolders = { ...collapsedFolders, [parentId]: false };
        }
        void addNewTab('sidebar', parentId);
    }

    function contextCreateFolder() {
        const parentId = contextMenu?.parentId ?? null;
        closeContextMenu();
        if (parentId) {
            collapsedFolders = { ...collapsedFolders, [parentId]: false };
        }
        addNewFolder(parentId);
    }

    onDestroy(() => {
        if (!browser) return;
        window.removeEventListener('pointermove', onExplorerPointerMove);
        window.removeEventListener('pointerup', onExplorerPointerUp);
        window.removeEventListener('pointercancel', onExplorerPointerUp);
        document.body.classList.remove('explorer-dragging');
    });

    let showSyncSuccess = false;
    let syncSuccessTimer: ReturnType<typeof setTimeout> | null = null;
    let prevCloudLoading = false;
    onDestroy(() => {
        if (syncSuccessTimer) clearTimeout(syncSuccessTimer);
    });
    $: {
        const loading = $cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading';
        if (prevCloudLoading && !loading && $cloudSyncState.syncStatus === 'idle') {
            showSyncSuccess = true;
            if (syncSuccessTimer) clearTimeout(syncSuccessTimer);
            syncSuccessTimer = setTimeout(() => { showSyncSuccess = false; }, 1000);
        }
        prevCloudLoading = loading;
    }
    $: if (!suppressSave && !isSpecialTabType(tabs[activeTabId]?.type) && (code !== undefined || output !== undefined || logs !== undefined)) {
        if (!skipNextSave && !isPristineStarterTab()) {
            const fkey = fileKey();
            const now = Date.now();
            const latestViewState = editorComponent?.getViewState?.() || currentViewState;

            if (activeTabId >= 0 && activeTabId < tabs.length) {
                 tabs = tabs.map((t, i) => i === activeTabId ? { ...t, lastUpdated: now } : t);
            }

            fileStore.update((s) => {
                let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                if (activeTabId < 0 || activeTabId >= tabs.length) return s;
                const existingFile = files.find(x =>
                    x.fileId === tabs[activeTabId].fileId &&
                    x.language === language
                );
                if (existingFile) {
                    existingFile.content = code;
                    existingFile.viewState = latestViewState;
                    existingFile.output = output;
                    existingFile.logs = logs;
                    existingFile.lastUpdated = now;
                } else {
                    const sibling = files.find((x) => x.fileId === tabs[activeTabId].fileId);
                    files = [...files, {
                        fileId: tabs[activeTabId].fileId,
                        fileName: tabs[activeTabId].fileName,
                        language: language,
                        content: code,
                        viewState: latestViewState,
                        output: output,
                        logs: logs,
                        isActive: false,
                        isOpen: tabs[activeTabId].isOpen,
                        lastUpdated: now,
                        parentId: sibling?.parentId ?? null,
                        order: sibling?.order
                    } as FileEntry];
                }
                return {...s, [fkey]: JSON.stringify(files)};
            });
        }
        skipNextSave = false;
    }

    $: if (language) {
        debugBreakpoints = [];
        loadOrInitFile(language);
    }

    // Reload code when another browser tab changes the file store
    $: if ($fileSyncVersion > 0 && activeTabId >= 0 && activeTabId < tabs.length && !isSpecialTabType(tabs[activeTabId]?.type) && language) {
        skipNextSave = true;
        loadOrInitFile(language);
        $fileSyncVersion;
    }

    function loadTabContent(tab: TabMeta) {
        if (tab.type === 'preview') {
            applyPreferredVisualMode();
            return;
        }
        if (isSpecialTabType(tab.type)) return;
        const targetLanguage = getLanguageForTab(tab.fileId);
        setLastLanguage(tab.fileId, targetLanguage);
        language = targetLanguage;
        loadOrInitFile(targetLanguage).then(() => maybeOpenPreferredMarkdownMode());
    }

    function closeTab(fileId: string) {
        const tabToClose = tabs.find(t => t.fileId === fileId);
        if (tabToClose?.type === 'preview') {
            const closedIdx = tabs.findIndex(t => t.fileId === fileId);
            tabs = tabs.filter(t => t.fileId !== fileId);
            if (!tabs[activeTabId]?.isOpen) {
                let nextOpenIdx = -1;
                for (let i = Math.min(closedIdx, tabs.length - 1); i >= 0; i--) {
                    if (tabs[i].isOpen) { nextOpenIdx = i; break; }
                }
                if (nextOpenIdx === -1) {
                    for (let i = Math.min(closedIdx, tabs.length - 1); i < tabs.length; i++) {
                        if (tabs[i].isOpen) { nextOpenIdx = i; break; }
                    }
                }
                if (nextOpenIdx !== -1) {
                    activeTabId = nextOpenIdx;
                    loadTabContent(tabs[nextOpenIdx]);
                }
            }
            persistTabOrder();
            return;
        }

        // Editor and whiteboard tabs close the same way: the entry stays in the
        // workspace and only the open/active state (local-only) changes, so
        // closing a tab never becomes a cloud change.
        tabs = tabs.map(t => t.fileId === fileId ? { ...t, isOpen: false } : t);

        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.map(f => f.fileId === fileId ? { ...f, isOpen: false } : f);
            return { ...s, [fkey]: JSON.stringify(files) };
        });

        const currentTab = tabs[activeTabId];
        if (currentTab.fileId === fileId) {
            let nextOpenIdx = -1;
            for (let i = activeTabId + 1; i < tabs.length; i++) {
                if (tabs[i].isOpen) { nextOpenIdx = i; break; }
            }
            if (nextOpenIdx === -1) {
                for (let i = activeTabId - 1; i >= 0; i--) {
                    if (tabs[i].isOpen) { nextOpenIdx = i; break; }
                }
            }
            if (nextOpenIdx !== -1) {
                activeTabId = nextOpenIdx;
                loadTabContent(tabs[nextOpenIdx]);
            }
        }
    }

    async function deleteFile(fileId: string) {
        const files = getFiles();
        const isFolder = files.some((f) => f.fileId === fileId && isFolderEntry(f));
        const removeIds = isFolder ? collectDescendantIds(fileId, files) : new Set([fileId]);

        if (!await showConfirm(
            isFolder
                ? 'This folder and everything inside it will be permanently removed.'
                : 'This file and any previews created from it will be permanently removed.',
            {
                title: isFolder ? 'Remove folder?' : 'Remove file?',
                confirmLabel: isFolder ? 'Remove folder' : 'Remove file',
                tone: 'danger'
            }
        )) return;

        const tabsToRemove = tabs.filter(
            (t) => removeIds.has(t.fileId) || (t.sourceFileId ? removeIds.has(t.sourceFileId) : false)
        );
        const activeFileId = tabs[activeTabId]?.fileId;
        const activeTabWillBeRemoved = tabsToRemove.some(t => t.fileId === activeFileId);

        // If the active tab is removed, prefer another already-open tab. Do not
        // reopen a closed file — with no open tabs left, show the empty state.
        let nextOpenFileId: string | undefined;
        if (activeTabWillBeRemoved) {
            const activeIdx = activeTabId;
            for (let i = activeIdx + 1; i < tabs.length; i++) {
                if (!tabsToRemove.includes(tabs[i]) && tabs[i].isOpen) {
                    nextOpenFileId = tabs[i].fileId;
                    break;
                }
            }
            if (!nextOpenFileId) {
                for (let i = activeIdx - 1; i >= 0; i--) {
                    if (!tabsToRemove.includes(tabs[i]) && tabs[i].isOpen) {
                        nextOpenFileId = tabs[i].fileId;
                        break;
                    }
                }
            }
        }

        const fkey = fileKey();
        fileStore.update((s) => {
            let list = JSON.parse(s[fkey] || '[]') as FileEntry[];
            list = list.filter(
                (f) => !removeIds.has(f.fileId) && !(f.sourceFileId && removeIds.has(f.sourceFileId))
            );
            return { ...s, [fkey]: JSON.stringify(list) };
        });

        tabs = tabs.filter((t) => !tabsToRemove.includes(t));
        persistTabOrder();

        if (activeTabWillBeRemoved) {
            if (nextOpenFileId) {
                const idx = tabs.findIndex((t) => t.fileId === nextOpenFileId);
                if (idx !== -1) {
                    activeTabId = idx;
                    loadTabContent(tabs[idx]);
                    return;
                }
            }
            activeTabId = 0;
            return;
        }

        const idx = tabs.findIndex((t) => t.fileId === activeFileId);
        activeTabId = idx !== -1 ? idx : 0;
    }

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;

        // Check for tabs in URL params (sent by CLI)
        const urlParams = new URLSearchParams(window.location.search);
        const tabsParam = urlParams.get('tabs');
        if (tabsParam) {
            try {
                const requestedTabs = JSON.parse(decodeURIComponent(tabsParam)) as { name: string, lang: ProgrammingLanguage, content?: string }[];
                if (requestedTabs.length > 0) {
                    suppressSave = true; // Use existing variable
                    for (const rt of requestedTabs) {
                        await addNewTabFromCLI(rt.name, rt.lang, rt.content || '');
                    }
                    window.history.replaceState({}, '', window.location.pathname);
                    suppressSave = false;
                    return;
                }
            } catch (e) {
                console.error('Failed to parse tabs from URL', e);
            }
        }
    });

    async function addNewTabFromCLI(customName: string, customLang: ProgrammingLanguage, customContent: string = '') {
        const nextId = uuidv4();
        const now = Date.now();
        tabs = [...tabs, { fileId: nextId, fileName: customName, isOpen: true, lastUpdated: now }];
        const newCode = customContent || starterCode[customLang] || '';
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = [
                ...files,
                {
                    fileId: nextId,
                    fileName: customName,
                    language: customLang,
                    lastLanguage: customLang,
                    content: newCode,
                    output: '',
                    logs: '',
                    isActive: false,
                    order: tabs.length - 1,
                    isOpen: true,
                    lastUpdated: now
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        language = customLang;
        userSettingsStorage.update((s) => ({ ...s, playgroundPreferredLanguage: language }));
        await tick();
        await loadOrInitFile(language);
        persistTabOrder();
    }

    onMount(() => {
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
            if (showAddMenu && addMenuContainer && !addMenuContainer.contains(e.target as Node)) {
                showAddMenu = false;
            }
            if (contextMenu && contextMenuEl && !contextMenuEl.contains(e.target as Node)) {
                closeContextMenu();
            }
        };
        const handleDocContextMenu = (e: MouseEvent) => {
            if (contextMenu && contextMenuEl && !contextMenuEl.contains(e.target as Node)) {
                // Allow other context menus; just close ours if click is outside
                const target = e.target as HTMLElement | null;
                if (!target?.closest('[data-explorer-id]')) closeContextMenu();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                showSettings = false;
                showAddMenu = false;
                closeContextMenu();
            }
        };
        const handleScroll = () => {
            if (contextMenu) closeContextMenu();
        };
        document.addEventListener('click', handleDocClick);
        document.addEventListener('contextmenu', handleDocContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleScroll);
        document.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('click', handleDocClick);
            document.removeEventListener('contextmenu', handleDocContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleScroll);
            document.removeEventListener('scroll', handleScroll, true);
        };
    });

    function saveCurrentViewState() {
        if (!editorComponent || activeTabId < 0 || activeTabId >= tabs.length) return;
        const state = editorComponent.getViewState();
        if (!state) return;

        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existingFile = files.find(x =>
                x.fileId === tabs[activeTabId].fileId &&
                x.language === language
            );
            if (existingFile) {
                if (existingFile.viewState === state) return s;
                existingFile.viewState = state;
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
        currentViewState = state;
    }

    async function activateTab(fileId?: string, preferredLang?: ProgrammingLanguage) {
        if (!fileId) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        expandAncestorFolders(fileId);

        saveCurrentViewState();

        const now = Date.now();
        tabs = tabs.map((t, i) => i === idx ? { ...t, isOpen: true, lastUpdated: now } : t);

        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.map(f => f.fileId === fileId ? { ...f, isOpen: true, lastUpdated: now } : f);
            return { ...s, [fkey]: JSON.stringify(files) };
        });

        activeTabId = idx;

        if (tabs[idx].type === 'preview') {
            await applyPreferredVisualMode();
            return;
        }
        if (tabs[idx].type === 'whiteboard') {
            return;
        }

        const targetLanguage = preferredLang || getLanguageForTab(fileId);
        setLastLanguage(fileId, targetLanguage);
        language = targetLanguage;
        await loadOrInitFile(targetLanguage);
        await maybeOpenPreferredMarkdownMode();
    }

    async function openWhiteboard() {
        const existing = tabs.find((t) => t.type === 'whiteboard' || t.fileId === WHITEBOARD_FILE_ID);
        if (existing) {
            if (existing.isOpen && tabs[activeTabId]?.fileId === existing.fileId) {
                closeTab(existing.fileId);
                return;
            }
            await activateTab(existing.fileId);
            return;
        }
        const now = Date.now();
        tabs = [...tabs, {
            fileId: WHITEBOARD_FILE_ID,
            fileName: 'Whiteboard',
            isOpen: true,
            lastUpdated: now,
            type: 'whiteboard'
        }];
        activeTabId = tabs.length - 1;
        persistTabOrder();
        await tick();
    }

    // Runtime image name (like in ExecutionPanel)
    let imageStatus: 'unknown' | 'present' | 'absent' = 'unknown';
    let imageName: string = '';

    async function refreshImageStatus() {
        try {
            const res = await fetch(`/api/image/status?language=${encodeURIComponent(language)}`);
            if (!res.ok) throw new Error('status request failed');
            const body = await res.json();
            imageStatus = body.present ? 'present' : 'absent';
            imageName = body.image || '';
        } catch (e) {
            imageStatus = 'unknown';
            imageName = '';
        }
    }

    // Refresh image status on mount and when language changes
    onMount(refreshImageStatus);
    let lastLanguageChecked: string | null = null;
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = 'unknown';
        imageName = '';
        refreshImageStatus();
    }

    // Reset code for the current problem + language
    function getActiveContentTarget(): { fileId: string; language: ProgrammingLanguage; fileName: string } {
        const tab = tabs[activeTabId];
        if (tab?.type === 'preview' && tab.sourceFileId) {
            return { fileId: tab.sourceFileId, language: 'markdown', fileName: tab.fileName || 'Solution' };
        }
        return { fileId: tab.fileId, language, fileName: tab.fileName || 'Solution' };
    }

    async function handleResetClick() {
        const confirmed = await showConfirm('Your current code will be replaced with the starter code. This action cannot be undone.', {
            title: 'Reset this file?',
            confirmLabel: 'Reset code',
            tone: 'danger'
        });
        if (!confirmed) return;
        const target = getActiveContentTarget();
        const nextContent = starterCode[target.language] ?? '';
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existingFile = files.find(x => x.fileId === target.fileId && x.language === target.language);
            if (existingFile) {
                existingFile.content = nextContent;
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
        if (activeTab?.type === 'preview') {
            if (previewEditMode) {
                await enterPreviewEditMode(true);
            }
        } else {
            code = nextContent;
        }
    }

    async function openMarkdownPreview(mode: 'wysiwyg' | 'preview' = 'wysiwyg') {
        const sourceTab = tabs[activeTabId];
        if (!sourceTab || isSpecialTabType(sourceTab.type)) return;
        const sourceFileId = sourceTab.fileId;
        const sourceFileName = sourceTab.fileName || 'Solution';
        const sourceIdx = activeTabId;
        const now = Date.now();

        saveCurrentViewState();

        const existingPreviewIdx = tabs.findIndex(
            (t) => t.type === 'preview' && t.sourceFileId === sourceFileId
        );

        let updated = [...tabs];
        updated[sourceIdx] = { ...updated[sourceIdx], isOpen: false };

        if (existingPreviewIdx !== -1) {
            const [previewTab] = updated.splice(existingPreviewIdx, 1);
            const insertIdx = existingPreviewIdx < sourceIdx ? sourceIdx - 1 : sourceIdx;
            updated.splice(insertIdx, 0, {
                ...previewTab,
                isOpen: true,
                lastUpdated: now,
                fileName: sourceFileName
            });
            activeTabId = insertIdx;
        } else {
            updated.splice(sourceIdx, 0, {
                fileId: uuidv4(),
                fileName: sourceFileName,
                isOpen: true,
                lastUpdated: now,
                type: 'preview',
                sourceFileId
            });
            activeTabId = sourceIdx;
        }

        tabs = updated;

        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.map((f) => f.fileId === sourceFileId ? { ...f, isOpen: false } : f);
            return { ...s, [fkey]: JSON.stringify(files) };
        });

        persistTabOrder();
        await tick();
        if (mode === 'wysiwyg') {
            await enterPreviewEditMode();
        } else {
            exitPreviewEditMode();
        }
    }

    function exitPreviewEditMode() {
        if (previewEditMode) {
            commitWysiwygEdits();
        }
        previewEditMode = false;
        wysiwygSourceFileId = null;
        showLinkInput = false;
        closeMentionPopup();
    }

    async function applyPreferredVisualMode() {
        if (lastMarkdownMode === 'preview') {
            exitPreviewEditMode();
        } else {
            await enterPreviewEditMode();
        }
    }

    async function maybeOpenPreferredMarkdownMode() {
        if (lastMarkdownMode !== 'wysiwyg' && lastMarkdownMode !== 'preview') return;
        const tab = tabs[activeTabId];
        if (!tab || isSpecialTabType(tab.type)) return;
        if (language !== 'markdown') return;
        await openMarkdownPreview(lastMarkdownMode);
    }

    async function setMarkdownMode(mode: MarkdownViewMode) {
        persistMarkdownMode(mode);
        const isPreviewTab = activeTab?.type === 'preview';
        if (mode === 'source') {
            if (isPreviewTab) await openMarkdownSource();
            return;
        }
        if (isPreviewTab) {
            if (mode === 'wysiwyg') {
                await enterPreviewEditMode(true);
            } else {
                exitPreviewEditMode();
            }
            return;
        }
        if (language === 'markdown') {
            await openMarkdownPreview(mode);
        }
    }

    async function openMarkdownSource() {
        const previewTab = tabs[activeTabId];
        if (!previewTab || previewTab.type !== 'preview' || !previewTab.sourceFileId) return;

        const sourceFileId = previewTab.sourceFileId;
        const previewIdx = activeTabId;
        const sourceIdx = tabs.findIndex((t) => t.fileId === sourceFileId);
        if (sourceIdx === -1) return;
        const now = Date.now();

        if (previewEditMode) {
            commitWysiwygEdits();
            previewEditMode = false;
            wysiwygSourceFileId = null;
            showLinkInput = false;
            closeMentionPopup();
        }

        const updated = [...tabs];
        const source = { ...updated[sourceIdx], isOpen: true, lastUpdated: now };

        if (previewIdx > sourceIdx) {
            updated.splice(previewIdx, 1);
            updated.splice(sourceIdx, 1);
        } else {
            updated.splice(sourceIdx, 1);
            updated.splice(previewIdx, 1);
        }

        const insertIdx = sourceIdx < previewIdx ? previewIdx - 1 : previewIdx;
        updated.splice(insertIdx, 0, source);
        tabs = updated;
        activeTabId = insertIdx;

        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.map((f) => f.fileId === sourceFileId ? { ...f, isOpen: true, lastUpdated: now } : f);
            return { ...s, [fkey]: JSON.stringify(files) };
        });

        persistTabOrder();

        const targetLanguage = getLanguageForTab(sourceFileId);
        setLastLanguage(sourceFileId, targetLanguage);
        language = targetLanguage;
        await loadOrInitFile(targetLanguage);
    }

    // Builds the markdown snippet inserted when an image is pasted into a
    // markdown file. The base64 payload is stored in IndexedDB and the source
    // gets a fake link (cojudge://image/<id>) that previews resolve back to
    // the payload (see resolvePastedImages).
    async function markdownImageSnippet(dataUrl: string): Promise<string> {
        const link = await storePastedImage(dataUrl);
        return `![image](${link})`;
    }

    // --- Image lightbox (full-size view opened from thumbnails) ---
    let lightboxSrc: string | null = null;
    function openLightbox(src: string) {
        lightboxSrc = src;
    }
    function closeLightbox() {
        lightboxSrc = null;
    }

    // --- Markdown preview WYSIWYG editing ---
    let previewEditMode = false;
    let wysiwygEl: HTMLDivElement | null = null;
    let wysiwygDebounce: ReturnType<typeof setTimeout> | null = null;
    let wysiwygSourceFileId: string | null = null;
    let lastActiveTabFileId: string | null = null;
    let showLinkInput = false;
    let linkUrl = '';
    let linkInputEl: HTMLInputElement | null = null;
    let savedLinkRange: Range | null = null;

    // @-mention file picker in the WYSIWYG editor
    let showMentionPopup = false;
    let mentionQuery = '';
    let mentionSelectedIndex = 0;
    let savedMentionRange: Range | null = null;
    let mentionPopupStyle = '';
    let mentionResultsEl: HTMLDivElement | null = null;

    $: mentionFilteredFiles = (() => {
        const currentFileId =
            wysiwygSourceFileId ??
            (activeTab?.type === 'preview' ? activeTab.sourceFileId : activeTab?.fileId) ??
            null;
        const files = tabs.filter((t) => t.type !== 'preview' && t.fileId !== currentFileId);
        return mentionQuery
            ? files.filter((t) => t.fileName.toLowerCase().includes(mentionQuery.toLowerCase()))
            : files.slice().sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
    })();

    $: if (mentionQuery !== undefined) mentionSelectedIndex = 0;

    function getActivePreviewSourceContent(): string {
        if (!activeTab || activeTab.type !== 'preview' || !activeTab.sourceFileId) return '';
        const files = getFiles();
        const sourceEntry = files.find((f) => f.fileId === activeTab.sourceFileId && f.language === 'markdown');
        return sourceEntry?.content ?? '';
    }

    async function enterPreviewEditMode(force = false) {
        if (!activeTab?.sourceFileId) return;
        if (!force && previewEditMode && wysiwygSourceFileId === activeTab.sourceFileId && wysiwygEl) {
            return;
        }
        wysiwygSourceFileId = activeTab.sourceFileId;
        previewEditMode = true;
        await tick();
        if (wysiwygEl) {
            wysiwygEl.innerHTML = renderMarkdownPlain(getActivePreviewSourceContent(), {
                resolveFileLanguage: (fileId) => getLanguageForTab(fileId)
            });
            wrapImageThumbnails(wysiwygEl);
            wrapCodeBlocksWithCopy(wysiwygEl);
            ensureFileMentionCarets(wysiwygEl);
            prepareTaskListCheckboxes(wysiwygEl);
            ensureTrailingEmptyLine(wysiwygEl);
            resolvePastedImages(wysiwygEl);
            wysiwygEl.focus();
        }
    }

    async function togglePreviewEditMode() {
        if (previewEditMode) {
            exitPreviewEditMode();
            return;
        }
        await enterPreviewEditMode(true);
    }

    function handleWysiwygInput() {
        removeOrphanCodeWrappers();
        healTaskListStructure();
        if (wysiwygEl?.querySelector('li input[type="checkbox"][disabled]')) {
            prepareTaskListCheckboxes(wysiwygEl);
        }
        maybeAutoInsertHorizontalRule();
        maybeAutoInsertCodeBlock();
        maybeAutoCloseInlineCode();
        updateMentionPopup();
        if (wysiwygDebounce) clearTimeout(wysiwygDebounce);
        wysiwygDebounce = setTimeout(commitWysiwygEdits, 300);
    }

    let applyingHorizontalRule = false;
    function maybeAutoInsertHorizontalRule() {
        if (applyingHorizontalRule || !wysiwygEl) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!range.collapsed || !wysiwygEl.contains(range.startContainer)) return;

        const parent = range.startContainer.nodeType === Node.ELEMENT_NODE
            ? range.startContainer as HTMLElement
            : range.startContainer.parentElement;
        if (!parent || parent.closest('pre, code')) return;

        let line: HTMLElement | null = parent;
        while (line && line.parentElement !== wysiwygEl) line = line.parentElement;
        if (!line || line.parentElement !== wysiwygEl || !/^(P|DIV)$/.test(line.tagName)) return;
        if (line.childNodes.length !== 1 || line.firstChild?.nodeType !== Node.TEXT_NODE || line.textContent !== '---') return;

        insertWysiwygHorizontalRule(line);
    }

    function insertWysiwygHorizontalRule(lineToReplace?: HTMLElement) {
        if (!wysiwygEl) return false;
        wysiwygEl.focus();
        const selection = window.getSelection();
        if (!selection) return false;
        const selectedRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (!lineToReplace && selectedRange && Array.from(wysiwygEl.querySelectorAll('table')).some((table) => selectedRange.intersectsNode(table))) return false;
        if (lineToReplace) {
            const lineRange = document.createRange();
            lineRange.selectNodeContents(lineToReplace);
            selection.removeAllRanges();
            selection.addRange(lineRange);
        } else if (selection.rangeCount === 0 || !wysiwygEl.contains(selection.anchorNode)) {
            return false;
        }

        const existingRules = new Set(wysiwygEl.querySelectorAll('hr'));
        applyingHorizontalRule = true;
        try {
            document.execCommand('insertHorizontalRule');
        } finally {
            applyingHorizontalRule = false;
        }

        const insertedRule = Array.from(wysiwygEl.querySelectorAll('hr')).find((rule) => !existingRules.has(rule));
        if (!insertedRule) return false;

        let next = insertedRule.nextSibling;
        if (!next || (next instanceof HTMLElement && (next.tagName === 'HR' || next.contentEditable === 'false'))) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = '<br>';
            insertedRule.after(paragraph);
            next = paragraph;
        }

        const nextRange = document.createRange();
        nextRange.selectNodeContents(next);
        nextRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(nextRange);
        return true;
    }

    let applyingCodeBlock = false;
    // Notion-style: typing an exact ``` line turns it into a code block.
    function maybeAutoInsertCodeBlock() {
        if (applyingCodeBlock || !wysiwygEl) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!range.collapsed || !wysiwygEl.contains(range.startContainer)) return;

        const parent = range.startContainer.nodeType === Node.ELEMENT_NODE
            ? range.startContainer as HTMLElement
            : range.startContainer.parentElement;
        if (!parent || parent.closest('pre, code')) return;

        let line: HTMLElement | null = parent;
        while (line && line.parentElement !== wysiwygEl) line = line.parentElement;
        if (!line || line.parentElement !== wysiwygEl || !/^(P|DIV)$/.test(line.tagName)) return;
        if (line.childNodes.length !== 1 || line.firstChild?.nodeType !== Node.TEXT_NODE || line.textContent !== '```') return;

        insertWysiwygCodeBlock(line);
    }

    function insertWysiwygCodeBlock(lineToReplace: HTMLElement) {
        if (!wysiwygEl) return false;
        wysiwygEl.focus();
        const selection = window.getSelection();
        if (!selection) return false;
        const lineRange = document.createRange();
        lineRange.selectNodeContents(lineToReplace);
        selection.removeAllRanges();
        selection.addRange(lineRange);

        applyingCodeBlock = true;
        try {
            document.execCommand('formatBlock', false, 'pre');
        } finally {
            applyingCodeBlock = false;
        }

        const insertedPre = Array.from(wysiwygEl.querySelectorAll('pre')).find(
            (pre) => (pre.textContent || '') === '```'
        );
        if (!insertedPre) return false;

        // Notion-style: the fence disappears and the caret lands inside the
        // freshly created code block, ready to type. A ZWSP keeps the empty
        // block in the DOM (and markdown) until the user types something.
        insertedPre.textContent = '';
        const zwsp = document.createTextNode('\u200B');
        insertedPre.appendChild(zwsp);
        wrapCodeBlocksWithCopy(wysiwygEl);
        // Keep a paragraph after the code block so the caret can move past it
        if (!insertedPre.parentElement?.nextElementSibling) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = '<br>';
            insertedPre.parentElement?.after(paragraph);
        }
        const caret = document.createRange();
        caret.setStart(zwsp, 0);
        caret.collapse(true);
        selection.removeAllRanges();
        selection.addRange(caret);
        return true;
    }

    // The <pre> the caret is inside, if any (within the WYSIWYG editor).
    function getPreFromSelection(): HTMLElement | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !wysiwygEl) return null;
        const range = selection.getRangeAt(0);
        if (!wysiwygEl.contains(range.startContainer)) return null;
        let node: Node | null = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        if (!node || !(node instanceof HTMLElement)) return null;
        const pre = node.closest('pre');
        return pre && wysiwygEl.contains(pre) ? pre : null;
    }

    // The char range (in the ZWSP-stripped text) of the line the caret is on
    // inside the pre, when that line is already empty. Returns null otherwise.
    function emptyLineInPre(pre: HTMLElement): { start: number; end: number; total: number } | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        const prefixRange = document.createRange();
        prefixRange.selectNodeContents(pre);
        prefixRange.setEnd(range.startContainer, range.startOffset);
        const before = prefixRange.toString().replace(/\u200B/g, '');
        const total = (pre.textContent || '').replace(/\u200B/g, '');
        const after = total.slice(before.length);
        const lastNewline = before.lastIndexOf('\n');
        const start = lastNewline === -1 ? 0 : lastNewline + 1;
        const nextNewline = after.indexOf('\n');
        const end = nextNewline === -1 ? total.length : before.length + nextNewline;
        if (total.slice(start, end).trim() !== '') return null;
        return { start, end, total: total.length };
    }

    // Enter inside a code block: insert a real newline so the line stays part
    // of the same code block.
    function insertNewlineInPre() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) range.deleteContents();
        const nl = document.createTextNode('\n');
        range.insertNode(nl);
        range.setStartAfter(nl);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Notion-style exit from a code block: Enter on an empty last line. An
    // empty code block is deleted; a non-empty one stays — with the empty
    // line removed — and the caret moves to a fresh paragraph right after it.
    function escapeWysiwygCodeBlock(pre: HTMLElement, line: { start: number; total: number }) {
        const wrapper = pre.parentElement?.classList.contains(CODE_COPY_WRAPPER_CLASS) ? pre.parentElement : null;
        const block = wrapper ?? pre;
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        const empty = !(pre.textContent || '').replace(/\u200B/g, '').trim();
        if (!empty) {
            // Drop the empty line the caret is on (the '\n' that starts it), so
            // the code block does not keep a phantom empty last line.
            if (line.start > 0) {
                const text = (pre.textContent || '').replace(/\u200B/g, '');
                pre.textContent = text.slice(0, line.start - 1) + text.slice(line.start);
            }
        }
        if (empty || !(pre.textContent || '').replace(/\u200B/g, '').trim()) {
            block.replaceWith(p);
        } else {
            block.after(p);
        }
        const selection = window.getSelection();
        if (selection) {
            const caret = document.createRange();
            caret.selectNodeContents(p);
            caret.collapse(false);
            selection.removeAllRanges();
            selection.addRange(caret);
        }
    }

    // The browser sometimes deletes a code block on its own (e.g. Backspace
    // emptying it and merging into the previous paragraph), leaving the copy
    // button wrapper behind like a widow. Remove orphan wrappers, and empty
    // ones the caret has moved out of.
    function removeOrphanCodeWrappers() {
        if (!wysiwygEl) return;
        const selection = window.getSelection();
        const caretNode = selection?.anchorNode ?? null;
        wysiwygEl.querySelectorAll(`.${CODE_COPY_WRAPPER_CLASS}`).forEach((wrapper) => {
            const pres = wrapper.querySelectorAll('pre');
            if (pres.length === 0) {
                wrapper.remove();
                return;
            }
            if (caretNode && wrapper.contains(caretNode)) return;
            const hasText = Array.from(pres).some((p) => (p.textContent || '').replace(/\u200B/g, '').trim() !== '');
            if (!hasText) wrapper.remove();
        });
    }

    // When the user types a closing backtick, try to match it with a previous
    // backtick in the same text node and form an inline code element. Runs on
    // the input event, after the backtick has been typed, so a single ctrl+z
    // (undo) cancels the auto-format and restores exactly what was typed.
    // Chrome sanitizes <code> tags in execCommand HTML, so a marker span is
    // inserted instead and converted back to inline code by htmlToMarkdown.
    let applyingInlineCode = false;
    function maybeAutoCloseInlineCode() {
        if (applyingInlineCode || !wysiwygEl) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return;
        const node = range.startContainer;
        if (node.nodeType !== Node.TEXT_NODE || !wysiwygEl.contains(node)) return;
        const parentEl = node.parentElement;
        if (!parentEl || parentEl.closest('code') || parentEl.closest('pre')) return;
        const text = node.textContent ?? '';
        const offset = range.startOffset;
        if (offset < 1 || text.charAt(offset - 1) !== '`') return;
        const openIdx = text.slice(0, offset - 1).lastIndexOf('`');
        if (openIdx === -1) return;
        const codeText = text.slice(openIdx + 1, offset - 1);
        if (!codeText || codeText !== codeText.trim()) return;
        applyingInlineCode = true;
        try {
            const replaceRange = document.createRange();
            replaceRange.setStart(node, openIdx);
            replaceRange.setEnd(node, offset);
            selection.removeAllRanges();
            selection.addRange(replaceRange);
            document.execCommand('insertHTML', false, inlineCodeSpanHtml(codeText));
            // Rewrite the inserted span's background from the concrete color
            // (which the sanitizer kept) to the theme-variable marker, so the
            // code adapts to the active theme and round-trips back to backticks.
            const inserted = wysiwygEl.querySelectorAll('span');
            const markerSpan = inserted[inserted.length - 1];
            if (markerSpan instanceof HTMLElement) markerSpan.style.backgroundColor = INLINE_CODE_STYLE_MARKER;
        } finally {
            applyingInlineCode = false;
        }
    }

    // Toggle inline code on the current selection (or the word at the caret).
    function toggleInlineCode() {
        if (!wysiwygEl) return;
        wysiwygEl.focus();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        // If the caret/selection is inside an inline <code>, unwrap it
        let node: Node | null = selection.anchorNode;
        let existing: HTMLElement | null = null;
        while (node && node !== wysiwygEl) {
            if (node instanceof HTMLElement && node.tagName === 'CODE' && node.parentElement?.tagName !== 'PRE') {
                existing = node;
                break;
            }
            node = node.parentNode;
        }
        if (existing) {
            const parent = existing.parentNode;
            if (parent) {
                while (existing.firstChild) parent.insertBefore(existing.firstChild, existing);
                parent.removeChild(existing);
                parent.normalize();
            }
            handleWysiwygInput();
            return;
        }
        let range = selection.getRangeAt(0);
        if (range.collapsed) {
            // Expand to the word around the caret
            const textNode = range.startContainer;
            if (textNode.nodeType !== Node.TEXT_NODE) return;
            const text = textNode.textContent ?? '';
            let start = range.startOffset;
            let end = range.startOffset;
            while (start > 0 && !/\s/.test(text.charAt(start - 1))) start--;
            while (end < text.length && !/\s/.test(text.charAt(end))) end++;
            if (start === end) return;
            range.setStart(textNode, start);
            range.setEnd(textNode, end);
            selection.removeAllRanges();
            selection.addRange(range);
            range = selection.getRangeAt(0);
        }
        const frag = range.extractContents();
        // If the selection spans block-level content (e.g. Ctrl+A over several
        // paragraphs), wrapping everything in one inline <code> would nest block
        // elements inside it and corrupt the stored markdown. Wrap each block's
        // text in its own <code> instead.
        const blocks = Array.from(frag.children).filter(
            (el): el is HTMLElement => el instanceof HTMLElement && /^(P|DIV|LI|H[1-6]|PRE)$/.test(el.tagName)
        );
        const codeEl = document.createElement('code');
        if (blocks.length > 0) {
            for (const block of blocks) {
                if (block.tagName === 'PRE' || !block.textContent?.trim()) continue;
                const nestedCode = document.createElement('code');
                while (block.firstChild) nestedCode.appendChild(block.firstChild);
                block.appendChild(nestedCode);
            }
            range.insertNode(frag);
            // Reselect the first wrapped block so toggling again unwraps it
            const firstWrapped = blocks.find((b) => b.tagName !== 'PRE' && b.textContent?.trim());
            if (firstWrapped?.firstElementChild) {
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(firstWrapped.firstElementChild);
                selection.addRange(newRange);
            }
        } else {
            codeEl.appendChild(frag);
            range.insertNode(codeEl);
            // Reselect the wrapped content so toggling again unwraps it
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(codeEl);
            selection.addRange(newRange);
        }
        handleWysiwygInput();
    }

    // Toggle a code block around the current block, or unwrap the <pre> the
    // caret is inside back into a paragraph.
    function toggleCodeBlock() {
        if (!wysiwygEl) return false;
        wysiwygEl.focus();
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        if (!wysiwygEl.contains(range.startContainer)) return false;

        let node: Node | null = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        const pre = node instanceof HTMLElement ? node.closest('pre') : null;
        if (pre && wysiwygEl.contains(pre)) {
            // Unwrap: replace the code block (and its copy-button wrapper, if
            // the block was rendered from markdown) with a plain paragraph.
            const block = pre.parentElement?.classList.contains(CODE_COPY_WRAPPER_CLASS) ? pre.parentElement : pre;
            const p = document.createElement('p');
            for (const child of Array.from(pre.childNodes)) {
                // Rendered code blocks are <pre><code>…</code></pre>; unwrap the
                // <code> so toggling off yields a plain paragraph, not inline code
                if (child instanceof HTMLElement && child.tagName === 'CODE') {
                    p.append(...Array.from(child.childNodes));
                } else {
                    p.appendChild(child);
                }
            }
            block.replaceWith(p);
            const caret = document.createRange();
            caret.selectNodeContents(p);
            caret.collapse(false);
            selection.removeAllRanges();
            selection.addRange(caret);
            handleWysiwygInput();
            return true;
        }

        // execCommand produces a bare <pre>; htmlToMarkdown's bareCodeBlock
        // rule round-trips it back to a fenced code block. Wrap it right away
        // so the copy button shows up immediately, like rendered code blocks.
        document.execCommand('formatBlock', false, 'pre');
        wrapCodeBlocksWithCopy(wysiwygEl);
        handleWysiwygInput();
        return true;
    }

    // If the click target is a playground file link, switch to that tab in-app.
    function tryOpenPlaygroundFileLink(event: MouseEvent, container: HTMLElement | null): boolean {
        if (!container) return false;
        const anchor = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
        if (!anchor || !container.contains(anchor)) return false;
        const fileId = parsePlaygroundFileId(anchor.getAttribute('href') || '');
        if (!fileId) return false;
        event.preventDefault();
        event.stopPropagation();
        closeMentionPopup();
        activateTab(fileId);
        return true;
    }

    // Keep checkbox HTML attributes in sync after native toggle so innerHTML
    // (and turndown) sees the current checked state.
    function handleWysiwygChange(event: Event) {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
        if (!wysiwygEl?.contains(target)) return;
        if (target.checked) target.setAttribute('checked', '');
        else target.removeAttribute('checked');
        handleWysiwygInput();
    }

    function getListItemFromSelection(): HTMLLIElement | null {
        if (!wysiwygEl) return null;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        let node: Node | null = selection.getRangeAt(0).startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        while (node && node !== wysiwygEl) {
            if (node instanceof HTMLLIElement) return node;
            node = node.parentElement;
        }
        return null;
    }

    function placeCaretInTaskItem(li: HTMLElement, atStart = true) {
        const selection = window.getSelection();
        if (!selection) return;
        wysiwygEl?.focus();
        const anchor = ensureTaskItemCaretAnchor(li);
        const range = document.createRange();
        if (atStart && anchor) {
            // Offset 1 sits after the ZWSP, so the caret paints to the right of
            // the checkbox instead of the left (browser default for <input>).
            range.setStart(anchor, Math.min(1, anchor.length));
            range.collapse(true);
        } else if (!atStart) {
            range.selectNodeContents(li);
            range.collapse(false);
        } else {
            range.selectNodeContents(li);
            range.collapse(false);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function breakOutOfListItem(li: HTMLLIElement) {
        const list = li.parentElement;
        if (!list || !/^(UL|OL)$/.test(list.tagName)) return;
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        const hasPrev = !!li.previousElementSibling;
        const hasNext = !!li.nextElementSibling;
        let nodeAfter = li.nextSibling;
        li.remove();
        if (!hasPrev && !hasNext) {
            list.replaceWith(p);
        } else if (!hasNext) {
            list.after(p);
        } else if (!hasPrev) {
            list.before(p);
        } else {
            const newList = document.createElement(list.tagName);
            while (nodeAfter) {
                const nextNode = nodeAfter.nextSibling;
                newList.appendChild(nodeAfter);
                nodeAfter = nextNode;
            }
            list.after(p);
            p.after(newList);
        }
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    // Enter in a checklist item continues the checklist; empty item breaks out.
    function handleTaskListEnter(li: HTMLLIElement): boolean {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return false;

        if (isEmptyTaskListItem(li)) {
            breakOutOfListItem(li);
            return true;
        }

        const range = selection.getRangeAt(0);
        const afterRange = document.createRange();
        afterRange.selectNodeContents(li);
        afterRange.setStart(range.startContainer, range.startOffset);
        const fragment = afterRange.extractContents();

        ensureTaskCheckbox(li);
        if (isEmptyTaskListItem(li) && !li.querySelector('br')) {
            li.appendChild(document.createElement('br'));
        }

        const newLi = document.createElement('li');
        newLi.appendChild(createTaskCheckbox());
        newLi.appendChild(document.createTextNode('\u200B'));
        while (fragment.firstChild) {
            const child = fragment.firstChild;
            if (
                child.nodeType === Node.ELEMENT_NODE &&
                (child as HTMLElement).tagName === 'INPUT' &&
                (child as HTMLInputElement).type === 'checkbox'
            ) {
                fragment.removeChild(child);
                continue;
            }
            // Drop a leading ZWSP/space from the split fragment; the new item
            // already has its own caret anchor.
            if (
                child.nodeType === Node.TEXT_NODE &&
                newLi.childNodes.length === 2 &&
                /^[\u200B\s]/.test(child.textContent || '')
            ) {
                child.textContent = (child.textContent || '').replace(/^[\u200B\s]+/, '');
                if (!child.textContent) {
                    fragment.removeChild(child);
                    continue;
                }
            }
            newLi.appendChild(child);
        }
        if (isEmptyTaskListItem(newLi)) {
            // Keep a trailing <br> so the empty item has a line box, but the
            // caret still lives in the ZWSP after the checkbox.
            if (![...newLi.childNodes].some((n) => n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === 'BR')) {
                newLi.appendChild(document.createElement('br'));
            }
        }
        ensureTaskItemCaretAnchor(newLi);
        li.after(newLi);
        placeCaretInTaskItem(newLi, true);
        return true;
    }

    function insertOrToggleTaskList() {
        if (!wysiwygEl) return;
        wysiwygEl.focus();
        const li = getListItemFromSelection();
        if (li && isTaskListItem(li)) {
            removeTaskCheckbox(li);
            handleWysiwygInput();
            return;
        }
        if (li) {
            ensureTaskCheckbox(li);
            placeCaretInTaskItem(li, false);
            handleWysiwygInput();
            return;
        }
        document.execCommand(
            'insertHTML',
            false,
            '<ul><li><input type="checkbox" contenteditable="false">\u200B<br></li></ul>'
        );
        prepareTaskListCheckboxes(wysiwygEl);
        const created = getListItemFromSelection();
        if (created) placeCaretInTaskItem(created, true);
        handleWysiwygInput();
    }

    // True when the collapsed caret sits at the very start of a task item,
    // i.e. nothing editable between the checkbox and the caret.
    function isCaretAtTaskItemStart(li: HTMLElement): boolean {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        const node = range.startContainer;
        if (node === li) {
            const offset = range.startOffset;
            for (let i = 0; i < offset; i++) {
                if (!isZwspOnlyText(li.childNodes[i])) return false;
            }
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            const before = (node.textContent || '').slice(0, range.startOffset);
            if (before.replace(/\u200B/g, '').length > 0) return false;
            let prev: Node | null = node.previousSibling;
            while (prev && isZwspOnlyText(prev)) prev = prev.previousSibling;
            return !!prev && prev instanceof HTMLInputElement && prev.type === 'checkbox';
        }
        return false;
    }

    // Backspace at the very start of a task item: with a previous item, merge
    // (standard list behavior); otherwise remove the checkbox so the item
    // becomes a plain bullet.
    function handleTaskListBackspace(): boolean {
        const li = getListItemFromSelection();
        if (!li || !isTaskListItem(li)) return false;
        if (!isCaretAtTaskItemStart(li)) return false;
        const prev = li.previousElementSibling;
        if (prev && prev.tagName === 'LI') {
            appendListItemContent(prev as HTMLElement, li);
            placeCaretAtLiEnd(prev as HTMLElement);
            handleWysiwygInput();
            return true;
        }
        removeTaskCheckbox(li);
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(li);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        handleWysiwygInput();
        return true;
    }

    // True when the collapsed caret is at the very start of an li, with only
    // whitespace/ZWSP/br between the li's beginning and the caret.
    function isCaretAtLiStart(li: HTMLElement): boolean {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const beforeIsStructural = (n: Node | null): boolean =>
            !!n && ((n.nodeType === Node.TEXT_NODE && /^[\u200B\s]*$/.test(n.textContent || '')) ||
                (n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BR'));
        if (node === li) {
            for (let i = 0; i < range.startOffset; i++) {
                if (!beforeIsStructural(li.childNodes[i])) return false;
            }
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            if (!/^[\u200B\s]*$/.test((node.textContent || '').slice(0, range.startOffset))) return false;
            let prev: Node | null = node.previousSibling;
            while (prev && beforeIsStructural(prev)) prev = prev.previousSibling;
            return !prev;
        }
        return false;
    }

    // True when the collapsed caret is at the very end of an li, with only
    // whitespace/ZWSP/br between the caret and the li's end.
    function isCaretAtLiEnd(li: HTMLElement): boolean {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const afterIsStructural = (n: Node | null): boolean =>
            !!n && ((n.nodeType === Node.TEXT_NODE && /^[\u200B\s]*$/.test(n.textContent || '')) ||
                (n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BR'));
        if (node === li) {
            for (let i = range.startOffset; i < li.childNodes.length; i++) {
                if (!afterIsStructural(li.childNodes[i])) return false;
            }
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            if (!/^[\u200B\s]*$/.test((node.textContent || '').slice(range.startOffset))) return false;
            let next: Node | null = node.nextSibling;
            while (next && afterIsStructural(next)) next = next.nextSibling;
            return !next;
        }
        return false;
    }

    function placeCaretAtLiEnd(li: HTMLElement) {
        const selection = window.getSelection();
        if (!selection) return;
        wysiwygEl?.focus();
        const range = document.createRange();
        if (isTaskListItem(li)) {
            const anchor = ensureTaskItemCaretAnchor(li);
            if (anchor) {
                range.setStart(anchor, anchor.length);
                range.collapse(true);
            } else {
                range.selectNodeContents(li);
                range.collapse(false);
            }
        } else {
            range.selectNodeContents(li);
            range.collapse(false);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function placeCaretAtBlockStart(el: HTMLElement) {
        const selection = window.getSelection();
        if (!selection) return;
        wysiwygEl?.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    // Merges the content of `source` li into the end of `target` li, dropping
    // the source's checkbox and structural whitespace. Manual DOM merge so the
    // browser never rebuilds the <li> (Chrome drops the checkbox inputs when
    // it natively merges list items).
    function appendListItemContent(target: HTMLElement, source: HTMLElement) {
        const frag = document.createDocumentFragment();
        for (const child of Array.from(source.childNodes)) {
            if (
                child.nodeType === Node.ELEMENT_NODE &&
                (child as HTMLElement).tagName === 'INPUT' &&
                (child as HTMLInputElement).type === 'checkbox'
            ) {
                continue;
            }
            frag.appendChild(child);
        }
        while (frag.firstChild && frag.firstChild.nodeType === Node.TEXT_NODE && /^[\u200B\s]*$/.test(frag.firstChild.textContent || '')) {
            frag.removeChild(frag.firstChild);
        }
        while (frag.lastChild && frag.lastChild.nodeType === Node.ELEMENT_NODE && (frag.lastChild as HTMLElement).tagName === 'BR') {
            frag.removeChild(frag.lastChild);
        }
        const lastTarget = target.lastChild;
        if (
            lastTarget && lastTarget.nodeType === Node.TEXT_NODE &&
            frag.firstChild && frag.firstChild.nodeType === Node.TEXT_NODE
        ) {
            target.appendChild(document.createTextNode(' '));
        }
        if (frag.childNodes.length > 0) target.appendChild(frag);
        const list = source.parentElement;
        source.remove();
        if (list && !list.querySelector('li')) list.remove();
        if (![...target.childNodes].some((n) => n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === 'BR')) {
            if (!target.textContent?.replace(/\u200B/g, '').trim()) target.appendChild(document.createElement('br'));
        }
        ensureTaskItemCaretAnchor(target);
    }

    // Delete at a task-list boundary: never let the browser natively merge
    // list items, because Chrome rebuilds the <li> elements and drops the
    // checkbox inputs (turning "- [ ] A" into "-  A" or corrupting the list).
    function handleTaskBoundaryDelete(): boolean {
        const li = getListItemFromSelection();
        if (!li || !wysiwygEl?.contains(li)) return false;
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return false;
        const isTask = isTaskListItem(li);
        const next = li.nextElementSibling;
        const prev = li.previousElementSibling;
        const nextIsLi = !!next && next.tagName === 'LI';
        const prevIsLi = !!prev && prev.tagName === 'LI';
        const nextIsTask = nextIsLi && isTaskListItem(next as HTMLElement);
        const prevIsTask = prevIsLi && isTaskListItem(prev as HTMLElement);

        if (isCaretAtLiEnd(li)) {
            // Delete at the end merges the following item into this one.
            if (isTask || nextIsTask) {
                if (nextIsLi) {
                    appendListItemContent(li, next as HTMLElement);
                    placeCaretAtLiEnd(li);
                } else if (next) {
                    // A block follows: move the caret into it instead of
                    // letting Chrome absorb the list item into the block.
                    placeCaretAtBlockStart(next as HTMLElement);
                } else {
                    return false;
                }
                handleWysiwygInput();
                return true;
            }
            return false;
        }

        if (isCaretAtLiStart(li)) {
            // Delete at the very start of an empty item merges the previous
            // item into it.
            if ((isTask || prevIsTask) && !li.textContent?.replace(/\u200B/g, '').trim()) {
                if (prevIsLi) {
                    const frag = document.createDocumentFragment();
                    while (prev.firstChild) frag.appendChild(prev.firstChild);
                    li.insertBefore(frag, li.firstChild);
                    if (prevIsTask) ensureTaskItemCaretAnchor(li);
                    placeCaretAtLiEnd(li);
                    handleWysiwygInput();
                    return true;
                }
                return false;
            }
            return false;
        }
        return false;
    }

    // Backspace at the start of a plain item whose previous item is a task
    // item would let Chrome merge and rebuild the task <li>. Merge manually.
    function handlePlainItemBackspaceIntoTask(): boolean {
        const li = getListItemFromSelection();
        if (!li || isTaskListItem(li) || !wysiwygEl?.contains(li)) return false;
        if (!isCaretAtLiStart(li)) return false;
        const prev = li.previousElementSibling;
        if (!prev || prev.tagName !== 'LI' || !isTaskListItem(prev as HTMLElement)) return false;
        appendListItemContent(prev as HTMLElement, li);
        placeCaretAtLiEnd(prev as HTMLElement);
        handleWysiwygInput();
        return true;
    }

    // Tab/Shift+Tab inside a list item (bullet, ordered, or task list) indents
    // and outdents. The <li> nodes are moved wholesale so checkboxes and any
    // nested lists stay intact (the browser's native editing rebuilds items and
    // drops checkbox inputs).
    function handleWysiwygTab(e: KeyboardEvent): boolean {
        const li = getListItemFromSelection();
        if (!li || !wysiwygEl?.contains(li)) return false;
        const list = li.parentElement;
        if (!list || !/^(UL|OL)$/.test(list.tagName)) return false;
        return e.shiftKey ? outdentListItem(li) : indentListItem(li);
    }

    // Remembers the caret position as (node, offset) plain values, so the
    // position can be re-applied after a DOM move. (A cloned Range gets
    // re-mapped by Chrome when list nodes are moved around in a
    // contenteditable, silently dropping the caret into a neighboring text
    // node.)
    function saveWysiwygCaret(): { node: Node; offset: number } | null {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        return { node: range.startContainer, offset: range.startOffset };
    }

    function restoreWysiwygCaret(caret: { node: Node; offset: number } | null) {
        if (!caret) return;
        const selection = window.getSelection();
        const range = document.createRange();
        try {
            range.setStart(caret.node, caret.offset);
        } catch {
            return;
        }
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    // Nests the item (with its own nested lists) under the previous item.
    function indentListItem(li: HTMLElement): boolean {
        const list = li.parentElement;
        if (!list || !/^(UL|OL)$/.test(list.tagName)) return false;
        const prev = li.previousElementSibling;
        if (!prev || prev.tagName !== 'LI') return false;

        const savedCaret = saveWysiwygCaret();
        let nested: HTMLElement | null = null;
        for (let i = 0; i < prev.childNodes.length; i++) {
            const child = prev.childNodes[i];
            if (child instanceof HTMLElement && /^(UL|OL)$/.test(child.tagName)) {
                nested = child;
                break;
            }
        }
        if (!nested) {
            nested = document.createElement(list.tagName);
            prev.appendChild(nested);
        }
        nested.appendChild(li);
        restoreWysiwygCaret(savedCaret);
        handleWysiwygInput();
        return true;
    }

    // Moves the item out of its nested list, placing it after its parent item.
    function outdentListItem(li: HTMLElement): boolean {
        const list = li.parentElement;
        if (!list || !/^(UL|OL)$/.test(list.tagName)) return false;
        const parentLi = list.parentElement;
        if (!parentLi || parentLi.tagName !== 'LI') return false;
        const outerList = parentLi.parentElement;
        if (!outerList || !/^(UL|OL)$/.test(outerList.tagName)) return false;

        const savedCaret = saveWysiwygCaret();
        li.remove();
        if (!list.querySelector('li')) list.remove();
        parentLi.after(li);
        restoreWysiwygCaret(savedCaret);
        handleWysiwygInput();
        return true;
    }

    // Repairs DOMs the browser already corrupted (e.g. a native merge put
    // several checkboxes into one <li>): split them back into separate items.
    function healTaskListStructure() {
        if (!wysiwygEl) return;
        wysiwygEl.querySelectorAll('li').forEach((li) => {
            const boxes = Array.from(li.children).filter(
                (c): c is HTMLInputElement => c instanceof HTMLInputElement && c.type === 'checkbox'
            );
            for (let i = 1; i < boxes.length; i++) {
                const box = boxes[i];
                const newLi = document.createElement('li');
                let node: Node | null = box;
                while (node) {
                    const nextNode = node.nextSibling;
                    newLi.appendChild(node);
                    node = nextNode;
                }
                if (
                    ![...newLi.childNodes].some((n) => n.nodeType === Node.ELEMENT_NODE && (n as HTMLElement).tagName === 'BR') &&
                    isEmptyTaskListItem(newLi)
                ) {
                    newLi.appendChild(document.createElement('br'));
                }
                li.after(newLi);
            }
        });
        prepareTaskListCheckboxes(wysiwygEl);
    }

    // Click handling inside the WYSIWYG area: trash icon deletes the image,
    // clicking the thumbnail opens the full-size lightbox. Checkboxes toggle
    // via the native control + change handler.
    function handleWysiwygClick(event: MouseEvent) {
        if (tryOpenPlaygroundFileLink(event, wysiwygEl)) return;
        removeOrphanCodeWrappers();
        const target = event.target as HTMLElement;
        if (target instanceof HTMLInputElement && target.type === 'checkbox' && wysiwygEl?.contains(target)) {
            // Let the native checkbox toggle; change handler syncs markdown.
            return;
        }
        const deleteBtn = target.closest(`.${THUMB_DELETE_CLASS}`) as HTMLElement | null;
        if (deleteBtn && wysiwygEl?.contains(deleteBtn)) {
            event.preventDefault();
            const img = deleteBtn.closest(`.${THUMB_WRAPPER_CLASS}`)?.querySelector('img');
            const fakeLink = img?.dataset.cojudgeImg;
            if (fakeLink) deletePastedImage(fakeLink);
            deleteBtn.closest(`.${THUMB_WRAPPER_CLASS}`)?.remove();
            ensureTrailingEmptyLine(wysiwygEl);
            commitWysiwygEdits();
            return;
        }
        const img = target.closest(`.${THUMB_WRAPPER_CLASS} img`) as HTMLImageElement | null;
        if (img && wysiwygEl?.contains(img)) {
            event.preventDefault();
            openLightbox(img.src);
        }
    }

    // Click handling in the read-only markdown preview.
    function handlePreviewClick(event: MouseEvent) {
        const container = event.currentTarget as HTMLElement;
        if (tryOpenPlaygroundFileLink(event, container)) return;
        const target = event.target as HTMLElement;
        const deleteBtn = target.closest(`.${THUMB_DELETE_CLASS}`) as HTMLElement | null;
        if (deleteBtn && container.contains(deleteBtn)) {
            event.preventDefault();
            const img = deleteBtn.closest(`.${THUMB_WRAPPER_CLASS}`)?.querySelector('img');
            const fakeLink = img?.dataset.cojudgeImg;
            const src = fakeLink || img?.getAttribute('src');
            if (!src) return;
            if (fakeLink) deletePastedImage(fakeLink);
            deletePreviewImage(src);
            return;
        }
        const img = target.closest(`.${THUMB_WRAPPER_CLASS} img`) as HTMLImageElement | null;
        if (img && container.contains(img)) {
            event.preventDefault();
            openLightbox(img.src);
        }
    }

    // Removes the image with the given src from the preview's source markdown.
    function deletePreviewImage(src: string) {
        const sourceFileId = activeTab?.type === 'preview' ? activeTab.sourceFileId : null;
        if (!sourceFileId) return;
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const sourceEntry = files.find((f) => f.fileId === sourceFileId && f.language === 'markdown');
            if (!sourceEntry) return s;
            const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`!\\[[^\\]]*\\]\\(\\s*${escaped}(?:\\s+"[^"]*")?\\s*\\)`, 'g');
            const next = sourceEntry.content
                .replace(pattern, '')
                .replace(/[ \t]+\n/g, '\n')
                .replace(/\n{3,}/g, '\n\n');
            if (next !== sourceEntry.content) {
                sourceEntry.content = next;
                sourceEntry.lastUpdated = Date.now();
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    function commitWysiwygEdits() {
        if (wysiwygDebounce) {
            clearTimeout(wysiwygDebounce);
            wysiwygDebounce = null;
        }
        if (!previewEditMode || !wysiwygEl || !wysiwygSourceFileId) return;
        removeOrphanCodeWrappers();
        healTaskListStructure();
        prepareTaskListCheckboxes(wysiwygEl);
        const markdown = htmlToMarkdown(wysiwygEl.innerHTML);
        const sourceFileId = wysiwygSourceFileId;
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const sourceEntry = files.find((f) => f.fileId === sourceFileId && f.language === 'markdown');
            if (sourceEntry && sourceEntry.content !== markdown) {
                sourceEntry.content = markdown;
                sourceEntry.lastUpdated = Date.now();
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    // Switch WYSIWYG mode when changing tabs
    $: if ((activeTab?.fileId ?? null) !== lastActiveTabFileId) {
        if (previewEditMode) commitWysiwygEdits();
        wysiwygSourceFileId = null;
        showLinkInput = false;
        closeMentionPopup();
        lastActiveTabFileId = activeTab?.fileId ?? null;
        if (activeTab?.type === 'preview') {
            applyPreferredVisualMode();
        } else {
            previewEditMode = false;
        }
    }

    // Paste images into the WYSIWYG area as <img> elements backed by IndexedDB
    // (the source keeps a fake cojudge://image/<id> link; resolvePastedImages
    // swaps it for the payload). Plain URL strings are inserted as clickable
    // links (new tab).
    function handleWysiwygPaste(event: ClipboardEvent) {
        const items = event.clipboardData?.items;
        if (items) {
            for (const item of items) {
                if (item.kind !== 'file' || !item.type.startsWith('image/')) continue;
                const file = item.getAsFile();
                if (!file) continue;
                event.preventDefault();
                const reader = new FileReader();
                reader.onload = async () => {
                    const link = await storePastedImage(reader.result as string);
                    document.execCommand('insertImage', false, link);
                    if (wysiwygEl) {
                        wrapImageThumbnails(wysiwygEl);
                        wrapCodeBlocksWithCopy(wysiwygEl);
                        // Keep an empty line after the pasted image so the caret
                        // can move past the contenteditable="false" thumbnail
                        ensureTrailingEmptyLine(wysiwygEl);
                        resolvePastedImages(wysiwygEl);
                    }
                };
                reader.readAsDataURL(file);
                return;
            }
        }

        const pasted = event.clipboardData?.getData('text/plain') ?? '';
        if (!isUrlLike(pasted)) return;

        event.preventDefault();
        const href = normalizeUrl(pasted);
        const selection = window.getSelection();
        const hasSelection =
            !!selection &&
            !selection.isCollapsed &&
            !!wysiwygEl &&
            !!selection.anchorNode &&
            wysiwygEl.contains(selection.anchorNode);

        if (hasSelection) {
            document.execCommand('createLink', false, href);
            ensureWysiwygLinksOpenInNewTab();
        } else {
            document.execCommand('insertHTML', false, linkHtml(href, pasted.trim()));
        }
        handleWysiwygInput();
    }

    function ensureWysiwygLinksOpenInNewTab() {
        if (!wysiwygEl) return;
        for (const a of Array.from(wysiwygEl.querySelectorAll('a[href]'))) {
            const href = a.getAttribute('href') || '';
            const fileId = parsePlaygroundFileId(href);
            if (fileId) {
                // Upgrade plain playground links (e.g. from createLink) into mention chips.
                if (!a.classList.contains(FILE_MENTION_CLASS)) {
                    const label = (a.textContent || href).trim();
                    a.outerHTML = fileMentionHtml(href, label, getLanguageForTab(fileId));
                } else {
                    a.removeAttribute('target');
                    a.removeAttribute('rel');
                    a.setAttribute('contenteditable', 'false');
                }
                continue;
            }
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        }
        ensureFileMentionCarets(wysiwygEl);
    }

    function closeMentionPopup() {
        showMentionPopup = false;
        mentionQuery = '';
        mentionSelectedIndex = 0;
        savedMentionRange = null;
        mentionPopupStyle = '';
    }

    function scrollSelectedMentionIntoView() {
        tick().then(() => {
            const el = mentionResultsEl?.querySelector('.mention-result-item.selected') as HTMLElement | null;
            el?.scrollIntoView({ block: 'nearest' });
        });
    }

    // Detect an in-progress @mention immediately before the caret.
    function getMentionMatch(): { query: string; range: Range } | null {
        if (!wysiwygEl) return null;
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0) return null;
        const caretRange = selection.getRangeAt(0);
        if (!wysiwygEl.contains(caretRange.startContainer)) return null;
        if (caretRange.startContainer.nodeType !== Node.TEXT_NODE) return null;
        const textNode = caretRange.startContainer as Text;
        const offset = caretRange.startOffset;
        const textBefore = textNode.textContent?.slice(0, offset) ?? '';
        const match = textBefore.match(/@([^\s@]*)$/);
        if (!match) return null;
        const atIndex = offset - match[0].length;
        if (atIndex > 0) {
            const charBefore = textBefore[atIndex - 1];
            // Avoid triggering inside emails like user@domain
            if (charBefore && /[\w.]/.test(charBefore)) return null;
        }
        const range = document.createRange();
        range.setStart(textNode, atIndex);
        range.setEnd(textNode, offset);
        return { query: match[1], range };
    }

    function updateMentionPopup() {
        if (!previewEditMode || !wysiwygEl) {
            if (showMentionPopup) closeMentionPopup();
            return;
        }
        const mention = getMentionMatch();
        if (!mention) {
            if (showMentionPopup) closeMentionPopup();
            return;
        }
        savedMentionRange = mention.range.cloneRange();
        mentionQuery = mention.query;
        showMentionPopup = true;
        const rect = mention.range.getBoundingClientRect();
        const top = Math.min(rect.bottom + 4, window.innerHeight - 240);
        const left = Math.min(Math.max(8, rect.left), window.innerWidth - 328);
        mentionPopupStyle = `top:${Math.max(8, top)}px;left:${left}px;`;
    }

    // Inline tags that should not wrap a file mention (looks wrong + breaks markdown).
    function isInlineFormatElement(el: Element): boolean {
        const tag = el.tagName;
        if (tag === 'B' || tag === 'STRONG' || tag === 'I' || tag === 'EM' || tag === 'U' ||
            tag === 'S' || tag === 'STRIKE' || tag === 'DEL' || tag === 'CODE') {
            return true;
        }
        // WYSIWYG auto-matched inline code spans
        if (tag === 'SPAN' && (el.getAttribute('style') || '').includes(INLINE_CODE_STYLE_MARKER)) {
            return true;
        }
        return false;
    }

    // Lift node out of bold/italic/etc. so the mention is unformatted.
    function liftOutOfInlineFormatting(node: Node, root: HTMLElement) {
        while (node.parentElement && node.parentElement !== root && isInlineFormatElement(node.parentElement)) {
            const parent = node.parentElement;
            const grand = parent.parentNode;
            if (!grand) break;

            const afterParent = parent.cloneNode(false) as HTMLElement;
            let sibling = node.nextSibling;
            while (sibling) {
                const next = sibling.nextSibling;
                afterParent.appendChild(sibling);
                sibling = next;
            }

            grand.insertBefore(node, parent.nextSibling);
            if (afterParent.childNodes.length > 0) {
                grand.insertBefore(afterParent, node.nextSibling);
            }
            if (!parent.hasChildNodes()) parent.remove();
        }
    }

    function insertFileMention(file: TabMeta) {
        if (!wysiwygEl || !savedMentionRange) return;
        // Prefer the underlying source file so the link stays valid if a preview tab is closed.
        const targetId = file.type === 'preview' && file.sourceFileId ? file.sourceFileId : file.fileId;
        const href = playgroundFileHref(targetId);
        const html = fileMentionHtml(href, file.fileName, getLanguageForTab(targetId));
        const range = savedMentionRange.cloneRange();
        closeMentionPopup();
        wysiwygEl.focus();

        // DOM insert (not execCommand) so we can place the caret immediately after the
        // contenteditable=false mention. Browsers otherwise park it at the end of the block.
        range.deleteContents();
        const template = document.createElement('template');
        template.innerHTML = html;
        const mentionNode = template.content.firstElementChild;
        if (!mentionNode) return;
        range.insertNode(mentionNode);
        // Don't keep bold/italic/code wrappers around the mention.
        liftOutOfInlineFormatting(mentionNode, wysiwygEl);

        // Zero-width space gives the caret a text node to sit in after the atomic mention.
        const zwsp = document.createTextNode('\u200B');
        mentionNode.after(zwsp);
        const selection = window.getSelection();
        const caret = document.createRange();
        caret.setStart(zwsp, 1);
        caret.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(caret);

        handleWysiwygInput();
    }

    function selectMentionByIndex(index: number) {
        if (mentionFilteredFiles.length === 0) return;
        const file = mentionFilteredFiles[index];
        if (file) insertFileMention(file);
    }

    function applyWysiwygCommand(command: string, value?: string) {
        if (!wysiwygEl) return;
        wysiwygEl.focus();
        document.execCommand(command, false, value);
        handleWysiwygInput();
    }

    function isFileMentionEl(node: Node | null | undefined): node is HTMLElement {
        return !!node && node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList?.contains(FILE_MENTION_CLASS);
    }

    function isZwspOnlyText(node: Node | null | undefined): boolean {
        return !!node && node.nodeType === Node.TEXT_NODE && /^[\u200B]*$/.test(node.textContent || '');
    }

    function removeFileMention(mention: HTMLElement) {
        if (!wysiwygEl) return;
        // Drop caret-anchor ZWSPs next to the mention
        const prev = mention.previousSibling;
        const next = mention.nextSibling;
        if (isZwspOnlyText(prev)) prev?.parentNode?.removeChild(prev);
        if (isZwspOnlyText(next)) next?.parentNode?.removeChild(next);

        const parent = mention.parentNode;
        const anchor = document.createTextNode('\u200B');
        parent?.insertBefore(anchor, mention);
        mention.remove();

        const selection = window.getSelection();
        const caret = document.createRange();
        caret.setStart(anchor, 0);
        caret.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(caret);
        handleWysiwygInput();
    }

    // Mention immediately before a collapsed caret (skipping ZWSP anchors).
    function fileMentionBeforeCaret(): HTMLElement | null {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0 || !wysiwygEl) return null;
        const range = selection.getRangeAt(0);
        if (!wysiwygEl.contains(range.startContainer)) return null;

        const node = range.startContainer;
        const offset = range.startOffset;

        if (node.nodeType === Node.TEXT_NODE) {
            const before = (node.textContent || '').slice(0, offset);
            // Real characters before the caret → not adjacent to a mention
            if (before.replace(/\u200B/g, '').length > 0) return null;
            let prev: Node | null = offset === 0 || /^[\u200B]*$/.test(before) ? node.previousSibling : null;
            // Caret inside a ZWSP-only text node after a mention
            if (!prev && /^[\u200B]*$/.test(before)) prev = node.previousSibling;
            while (prev && isZwspOnlyText(prev)) prev = prev.previousSibling;
            if (isFileMentionEl(prev)) return prev;
            return null;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            let i = offset - 1;
            while (i >= 0) {
                const child = node.childNodes[i];
                if (isZwspOnlyText(child)) { i--; continue; }
                if (isFileMentionEl(child)) return child;
                break;
            }
        }
        return null;
    }

    // Mention immediately after a collapsed caret (skipping ZWSP anchors).
    function fileMentionAfterCaret(): HTMLElement | null {
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || selection.rangeCount === 0 || !wysiwygEl) return null;
        const range = selection.getRangeAt(0);
        if (!wysiwygEl.contains(range.startContainer)) return null;

        const node = range.startContainer;
        const offset = range.startOffset;

        if (node.nodeType === Node.TEXT_NODE) {
            const after = (node.textContent || '').slice(offset);
            if (after.replace(/\u200B/g, '').length > 0) return null;
            let next: Node | null = node.nextSibling;
            while (next && isZwspOnlyText(next)) next = next.nextSibling;
            if (isFileMentionEl(next)) return next;
            return null;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            let i = offset;
            while (i < node.childNodes.length) {
                const child = node.childNodes[i];
                if (isZwspOnlyText(child)) { i++; continue; }
                if (isFileMentionEl(child)) return child;
                break;
            }
        }
        return null;
    }

    // Keyboard shortcuts while editing the WYSIWYG area: Ctrl/Cmd+B bold,
    // Ctrl/Cmd+I italic, Ctrl/Cmd+Shift+X strikethrough, Ctrl/Cmd+E inline
    // code, Ctrl/Cmd+K insert link. Also navigates the @-mention popup and
    // deletes file mentions atomically on Backspace/Delete.
    function handleWysiwygKeydown(e: KeyboardEvent) {
        if (showMentionPopup) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (mentionFilteredFiles.length === 0) return;
                mentionSelectedIndex = (mentionSelectedIndex + 1) % mentionFilteredFiles.length;
                scrollSelectedMentionIntoView();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (mentionFilteredFiles.length === 0) return;
                mentionSelectedIndex = (mentionSelectedIndex - 1 + mentionFilteredFiles.length) % mentionFilteredFiles.length;
                scrollSelectedMentionIntoView();
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                if (mentionFilteredFiles.length > 0) {
                    e.preventDefault();
                    selectMentionByIndex(mentionSelectedIndex);
                    return;
                }
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                closeMentionPopup();
                return;
            }
        }

        // Tab/Shift+Tab indents/outdents list items (including checklists).
        if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (handleWysiwygTab(e)) {
                e.preventDefault();
                return;
            }
        }

        // Checklist: Enter continues with a new checkbox; empty item breaks out.
        if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
            const taskItem = getListItemFromSelection();
            if (taskItem && isTaskListItem(taskItem)) {
                e.preventDefault();
                if (handleTaskListEnter(taskItem)) handleWysiwygInput();
                return;
            }
        }

        // Code block: Enter inserts a new line inside the block (staying in
        // it); Enter on an empty last line exits the block (an empty line in
        // the middle just adds a new line).
        if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
            const pre = getPreFromSelection();
            if (!pre) return;
            e.preventDefault();
            const selection = window.getSelection();
            const line = selection && selection.isCollapsed ? emptyLineInPre(pre) : null;
            if (line && line.end === line.total) {
                escapeWysiwygCodeBlock(pre, line);
            } else {
                insertNewlineInPre();
            }
            handleWysiwygInput();
        }

        // Backspace at the start of a task item removes the checkbox.
        if (e.key === 'Backspace' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (handleTaskListBackspace()) {
                e.preventDefault();
                return;
            }
            if (handlePlainItemBackspaceIntoTask()) {
                e.preventDefault();
                return;
            }
        }

        // Delete at a task-list boundary: merge manually so the browser never
        // rebuilds the <li> (which drops the checkbox inputs).
        if (e.key === 'Delete' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (handleTaskBoundaryDelete()) {
                e.preventDefault();
                return;
            }
        }

        // One Backspace/Delete removes the whole mention (not just the ZWSP caret anchor,
        // and not the browser's intermediate "select the atom" step).
        if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && (e.key === 'Backspace' || e.key === 'Delete')) {
            const selection = window.getSelection();
            // Browser may already have selected the atomic mention
            if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const frag = range.cloneContents();
                const nodes = Array.from(frag.childNodes).filter(
                    (n) => !(n.nodeType === Node.TEXT_NODE && /^[\u200B]*$/.test(n.textContent || ''))
                );
                if (nodes.length === 1 && isFileMentionEl(nodes[0])) {
                    // Resolve the live node from the selection range
                    let live: HTMLElement | null = null;
                    if (isFileMentionEl(range.startContainer)) {
                        live = range.startContainer;
                    } else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
                        for (let i = range.startOffset; i < range.startContainer.childNodes.length; i++) {
                            const c = range.startContainer.childNodes[i];
                            if (isZwspOnlyText(c)) continue;
                            if (isFileMentionEl(c)) { live = c; break; }
                            break;
                        }
                    }
                    if (!live) {
                        live = (range.commonAncestorContainer as Element).closest?.(`.${FILE_MENTION_CLASS}`) as HTMLElement | null;
                    }
                    if (live && wysiwygEl?.contains(live)) {
                        e.preventDefault();
                        removeFileMention(live);
                        return;
                    }
                }
            }

            const mention = e.key === 'Backspace' ? fileMentionBeforeCaret() : fileMentionAfterCaret();
            if (mention) {
                e.preventDefault();
                removeFileMention(mention);
                return;
            }
        }

        if (!e.metaKey && !e.ctrlKey) return;
        const key = e.key.toLowerCase();
        if (key === 'b' && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            applyWysiwygCommand('bold');
        } else if (key === 'i' && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            applyWysiwygCommand('italic');
        } else if (key === 'x' && e.shiftKey && !e.altKey) {
            e.preventDefault();
            applyWysiwygCommand('strikeThrough');
        } else if (key === 'e' && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            toggleInlineCode();
        } else if (key === 'k' && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            openLinkInput();
        }
    }

    // Desktop-only shortcuts: Ctrl/Cmd+W closes the active tab and Ctrl/Cmd+1-9
    // activates the nth open tab (left to right). In the browser these keys are
    // reserved by the browser itself, so they only apply in desktop mode.
    function handleGlobalKeydown(e: KeyboardEvent) {
        if (e.defaultPrevented) return;
        if (!isDesktopMode) return;
        if (!e.metaKey && !e.ctrlKey) return;
        if (e.altKey) return;
        const key = e.key.toLowerCase();
        if (key === 'w' && !e.shiftKey) {
            const active = tabs[activeTabId];
            if (active) {
                e.preventDefault();
                closeTab(active.fileId);
            }
            return;
        }
        if (/^[1-9]$/.test(key)) {
            const openTabs = tabs.filter((t) => t.isOpen);
            const target = openTabs[parseInt(key, 10) - 1];
            if (target) {
                e.preventDefault();
                activateTab(target.fileId);
            }
        }
    }

    // Toolbar buttons run on mousedown (preventDefault) so the text selection
    // inside the editable area is preserved.
    function handleToolbarMouseDown(event: MouseEvent) {
        const btn = (event.target as HTMLElement).closest('button[data-command]') as HTMLButtonElement | null;
        if (!btn) return;
        event.preventDefault();
        const command = btn.dataset.command!;
        if (command === 'link') {
            openLinkInput();
            return;
        }
        if (command === 'inlineCode') {
            toggleInlineCode();
            return;
        }
        if (command === 'insertHorizontalRule') {
            if (insertWysiwygHorizontalRule()) handleWysiwygInput();
            return;
        }
        if (command === 'insertTaskList') {
            insertOrToggleTaskList();
            return;
        }
        if (command === 'codeBlock') {
            toggleCodeBlock();
            return;
        }
        applyWysiwygCommand(command, btn.dataset.value);
    }

    // Keyboard-triggered clicks (Enter/Space) have detail === 0 and don't fire mousedown
    function handleToolbarClick(event: MouseEvent) {
        if (event.detail !== 0) return;
        const btn = (event.target as HTMLElement).closest('button[data-command]') as HTMLButtonElement | null;
        if (!btn) return;
        const command = btn.dataset.command!;
        if (command === 'link') {
            openLinkInput();
            return;
        }
        if (command === 'inlineCode') {
            toggleInlineCode();
            return;
        }
        if (command === 'insertHorizontalRule') {
            if (insertWysiwygHorizontalRule()) handleWysiwygInput();
            return;
        }
        if (command === 'insertTaskList') {
            insertOrToggleTaskList();
            return;
        }
        if (command === 'codeBlock') {
            toggleCodeBlock();
            return;
        }
        applyWysiwygCommand(command, btn.dataset.value);
    }

    function openLinkInput() {
        if (!wysiwygEl) return;
        const selection = window.getSelection();
        savedLinkRange = selection && selection.rangeCount > 0 && wysiwygEl.contains(selection.anchorNode)
            ? selection.getRangeAt(0).cloneRange()
            : null;
        showLinkInput = true;
        tick().then(() => linkInputEl?.focus());
    }

    function applyLink() {
        const url = linkUrl.trim();
        if (url && wysiwygEl) {
            wysiwygEl.focus();
            if (savedLinkRange) {
                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(savedLinkRange);
            }
            const href = isUrlLike(url) ? normalizeUrl(url) : url;
            const selection = window.getSelection();
            const hasSelection = !!selection && !selection.isCollapsed;
            if (hasSelection) {
                document.execCommand('createLink', false, href);
            } else {
                document.execCommand('insertHTML', false, linkHtml(href, url));
            }
            ensureWysiwygLinksOpenInNewTab();
            handleWysiwygInput();
        }
        showLinkInput = false;
        linkUrl = '';
        savedLinkRange = null;
    }

    let isFirebaseAvailable = false;
    let showShareModal = false;
    let shareUrl = '';
    let qrCodeDataUrl = '';

    $: {
        const currentFontSize = $userSettingsStorage.editorFontSize;
        if (typeof fontSize === 'number' && currentFontSize !== fontSize) {
            userSettingsStorage.update((s) => ({ ...s, editorFontSize: fontSize }));
        }
    }

    $: {
        const currentTheme = $userSettingsStorage.theme;
        if (theme && currentTheme !== theme) {
            userSettingsStorage.update((s) => ({ ...s, theme }));
        }
    }

    $: {
        const currentVimMode = $userSettingsStorage.vimMode;
        if (vimMode && currentVimMode !== vimMode) {
            userSettingsStorage.update((s) => ({ ...s, vimMode }));
        }
    }

    onMount(async () => {
        const fb = await initFirebase();
        if (fb) {
            isFirebaseAvailable = true;
        }

        const forkData = consumeForkTransfer();

        if (forkData) {
            suppressSave = true;
            const { content, language: lang, viewState, fileName } = forkData;

            // Add as new tab
            const newTabName = fileName ? `Fork of ${fileName}` : `Forked Solution`;
            const nextId = uuidv4();
            const now = Date.now();

            // Update tabs
            tabs = [...tabs, { fileId: nextId, fileName: newTabName, isOpen: true, lastUpdated: now }];

            // Update file store
            const fkey = fileKey();
            fileStore.update((s) => {
                let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                files = [
                    ...files,
                    {
                        fileId: nextId,
                        fileName: newTabName,
                        language: lang,
                        lastLanguage: lang,
                        content: content,
                        viewState: viewState,
                        output: '',
                        logs: '',
                        isActive: false,
                        order: tabs.length - 1,
                        isOpen: true,
                        lastUpdated: now
                    } as FileEntry
                ];
                return { ...s, [fkey]: JSON.stringify(files) };
            });

            // Switch to new tab
            activeTabId = tabs.length - 1;
            language = lang;
            userSettingsStorage.update(s => ({ ...s, playgroundPreferredLanguage: language }));

            await loadOrInitFile(lang);
            persistTabOrder();

        }

        const forkId = $page.url.searchParams.get('forkId');
        if (forkId && fb && fb.db) {
            try {
                const snap = await getDoc(doc(fb.db, 'shares', forkId));
                if (snap.exists()) {
                    const data = snap.data();

                    if (data.content && data.language) {
                        // Add as new tab
                        const newTabName = data.fileName ? `Fork of ${data.fileName}` : `Forked Solution`;
                        const nextId = uuidv4();
                        const now = Date.now();

            // Update tabs
            tabs = [...tabs, { fileId: nextId, fileName: newTabName, isOpen: true, lastUpdated: now }];                        // Update file store
                        const fkey = fileKey();
                        fileStore.update((s) => {
                            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                            files = [
                                ...files,
                                {
                                    fileId: nextId,
                                    fileName: newTabName,
                                    language: data.language,
                                    lastLanguage: data.language,
                                    content: data.content,
                                    viewState: data.viewState,
                                    output: '',
                                    logs: '',
                                    isActive: false,
                                    order: tabs.length - 1,
                                    isOpen: true,
                                    lastUpdated: now
                                } as FileEntry
                            ];
                            return { ...s, [fkey]: JSON.stringify(files) };
                        });

                        // Switch to new tab
                        activeTabId = tabs.length - 1;
                        language = data.language; // Switch language to match forked code
                        userSettingsStorage.update(s => ({ ...s, playgroundPreferredLanguage: language }));

                        await tick();
                        await loadOrInitFile(language);
                        persistTabOrder();
                    }

                    // Clean URL
                    const newUrl = new URL($page.url);
                    newUrl.searchParams.delete('forkId');
                    window.history.replaceState({}, '', newUrl);
                } else {
                    await showAlert('No shared solution matches that code.', {
                        title: 'Code does not exist',
                        tone: 'danger'
                    });
                }
            } catch (e) {
                console.error('Error loading shared solution:', e);
                await showAlert('The shared solution could not be loaded. Check your Firebase connection and try again.', {
                    title: 'Load failed',
                    tone: 'danger'
                });
            }
        }
    });

    function generateShortId(length: number = 4): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async function handleSave(silent = false): Promise<string | null> {
        if (!isFirebaseAvailable) return null;

        const { db, auth } = (await initFirebase()) || {};
        if (!db || !auth) return null;

        try {
            const user = await ensureAuthenticated();
            if (!user) throw new Error('Authentication failed');

            const target = getActiveContentTarget();
            const files = getFiles();
            const currentFile = files.find(f => f.fileId === target.fileId && f.language === target.language);
            const content = currentFile ? currentFile.content : (starterCode[target.language] ?? '');
            const viewState = currentFile ? currentFile.viewState : (activeTab?.type === 'preview' ? null : (editorComponent?.getViewState() || null));
            const fileOutput = currentFile ? (currentFile.output || '') : '';
            const fileLogs = currentFile ? (currentFile.logs || '') : '';

            let shareId = currentFile?.shareId;

            if (shareId) {
                // Try to update existing
                try {
                    await updateDoc(doc(db, 'shares', shareId), {
                        content,
                        language: target.language,
                        viewState,
                        fileName: target.fileName,
                        output: fileOutput,
                        logs: fileLogs,
                        updatedAt: new Date().toISOString(),
                        ownerId: user.uid
                    });

                    // Update local store with lastSharedContent
                    const fkey = fileKey();
                    fileStore.update((s) => {
                        let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                        const idx = files.findIndex(f => f.fileId === target.fileId && f.language === target.language);
                        if (idx >= 0) {
                            files[idx].lastSharedContent = content;
                        }
                        return { ...s, [fkey]: JSON.stringify(files) };
                    });
                    lastSharedContent = content;

                    if (!silent) {
                        await showAlert('Your existing share has been updated.', {
                            title: 'Saved',
                            tone: 'success'
                        });
                    }
                    return shareId;
                } catch (e: any) {
                    if (e.code === 'permission-denied') {
                        const createCopy = silent || await showConfirm('You do not own the existing share. A new link can be created for your copy.', {
                            title: 'Create a new share?',
                            confirmLabel: 'Create copy'
                        });
                        if (createCopy) {
                            shareId = undefined; // Force create new
                        } else {
                            return null;
                        }
                    } else {
                        throw e;
                    }
                }
            }

            if (!shareId) {
                // Create new
                shareId = generateShortId(4);
                await setDoc(doc(db, 'shares', shareId), {
                    content,
                    language: target.language,
                    viewState,
                    fileName: target.fileName,
                    output: fileOutput,
                    logs: fileLogs,
                    createdAt: new Date().toISOString(),
                    ownerId: user.uid
                });

                // Update local file with shareId
                const fkey = fileKey();
                fileStore.update((s) => {
                    let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                    const idx = files.findIndex(f => f.fileId === target.fileId && f.language === target.language);
                    if (idx >= 0) {
                        files[idx].shareId = shareId;
                        files[idx].lastSharedContent = content;
                    }
                    return { ...s, [fkey]: JSON.stringify(files) };
                });
                lastSharedContent = content;

                if (!silent) {
                    await showAlert(`Your share code is ${shareId}.`, {
                        title: 'Saved',
                        tone: 'success'
                    });
                }
                return shareId;
            }
        } catch (e) {
            console.error('Error saving:', e);
            if (!silent) {
                await showAlert('The shared solution could not be saved. Check your Firebase connection and try again.', {
                    title: 'Save failed',
                    tone: 'danger'
                });
            }
            return null;
        }
        return null;
    }

    async function handleShare() {
        const shareId = await handleSave(true);
        if (shareId) {
            shareUrl = `${window.location.origin}/p/${shareId}`;
            qrCodeDataUrl = await QRCode.toDataURL(shareUrl);
            showShareModal = true;
        }
    }

    async function handleGenerateNewLink() {
        // Clear shareId for current file to force creation of new share
        const target = getActiveContentTarget();
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const idx = files.findIndex(f => f.fileId === target.fileId && f.language === target.language);
            if (idx >= 0) {
                delete files[idx].shareId;
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });

        await handleShare();
    }

    let showSearch = false;
    let searchQuery = '';
    let searchInputEl: HTMLInputElement | null = null;
    let searchResultsEl: HTMLDivElement | null = null;
    let selectedIndex = 0;

    function scrollSelectedSearchResultIntoView() {
        tick().then(() => {
            const el = searchResultsEl?.querySelector('.search-result-item.selected') as HTMLElement | null;
            el?.scrollIntoView({ block: 'nearest' });
        });
    }

    $: filteredFiles = (() => {
        const files = tabs.filter((t) => t.type !== 'preview');
        return searchQuery
            ? files.filter((t) => t.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
            : files.slice().sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
    })();

    $: recentFiles = tabs
        .slice()
        .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
        .slice(0, 9);

    $: if (searchQuery !== undefined) selectedIndex = 0;

    function openSearch() {
        showSearch = true;
        searchQuery = '';
        selectedIndex = 0;
        tick().then(() => searchInputEl?.focus());
    }

    function closeSearch() {
        showSearch = false;
    }

    let activePanel: ActivePanel = $userSettingsStorage.activePanel;
    $: isSidebarOpen = activePanel !== null;

    function persistPanel() {
        userSettingsStorage.update(s => ({
            ...s,
            activePanel,
            isSidebarOpen: activePanel !== null,
        }));
    }

    let globalSearchQuery = '';
    let globalSearchInputEl: HTMLInputElement | null = null;
    let globalSearchCaseSensitive = false;
    let globalSearchRegex = false;
    let collapsedResults = new Set<string>();
    let globalSearchResults: { fileId: string; fileName: string; language: ProgrammingLanguage; fileNameMatch: boolean; matches: { line: number; text: string; language: ProgrammingLanguage }[] }[] = [];

    function toggleResultCollapse(fileId: string) {
        if (collapsedResults.has(fileId)) {
            collapsedResults.delete(fileId);
        } else {
            collapsedResults.add(fileId);
        }
        collapsedResults = collapsedResults; // Trigger reactivity
    }

    function performGlobalSearch() {
        if (!globalSearchQuery) {
            globalSearchResults = [];
            return;
        }
        const query = globalSearchQuery;
        const caseSensitive = globalSearchCaseSensitive;
        const useRegex = globalSearchRegex;

        let pattern: RegExp;
        let fileNamePattern: RegExp;
        try {
            const flags = caseSensitive ? 'g' : 'gi';
            if (useRegex) {
                pattern = new RegExp(query, flags);
                fileNamePattern = new RegExp(query, flags);
            } else {
                const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                pattern = new RegExp(escaped, flags);
                fileNamePattern = new RegExp(escaped, flags);
            }
        } catch {
            globalSearchResults = [];
            return;
        }

        const files = getFiles();
        const resultsMap = new Map<string, { fileId: string; fileName: string; language: ProgrammingLanguage; fileNameMatch: boolean; matches: { line: number; text: string; language: ProgrammingLanguage }[] }>();

        // First, check filenames from tabs
        for (const t of tabs) {
            fileNamePattern.lastIndex = 0;
            if (fileNamePattern.test(t.fileName)) {
                resultsMap.set(t.fileId, {
                    fileId: t.fileId,
                    fileName: t.fileName,
                    language: getLanguageForTab(t.fileId),
                    fileNameMatch: true,
                    matches: []
                });
            }
        }

        // Then, check all contents in all FileEntries
        for (const f of files) {
            const content = f.content ?? '';
            const lines = content.split('\n');
            const fileMatches: { line: number; text: string; language: ProgrammingLanguage }[] = [];
            for (let i = 0; i < lines.length; i++) {
                const lineText = lines[i];
                pattern.lastIndex = 0;
                if (pattern.test(lineText)) {
                    fileMatches.push({ line: i + 1, text: lineText, language: f.language as ProgrammingLanguage });
                }
            }

            if (fileMatches.length > 0) {
                let existing = resultsMap.get(f.fileId);
                if (!existing) {
                    const tab = tabs.find(t => t.fileId === f.fileId);
                    const fname = tab ? tab.fileName : (f.fileName || 'Solution');
                    existing = {
                        fileId: f.fileId,
                        fileName: fname,
                        language: f.language as ProgrammingLanguage,
                        fileNameMatch: false,
                        matches: []
                    };
                    resultsMap.set(f.fileId, existing);
                }
                // Only add matches if they aren't already added (avoid duplicates across languages if content is identical)
                for (const m of fileMatches) {
                    if (!existing.matches.find(exm => exm.line === m.line && exm.text === m.text && exm.language === m.language)) {
                        existing.matches.push(m);
                    }
                }
            }
        }

        globalSearchResults = Array.from(resultsMap.values());
    }

    function activatePanel(panel: ActivePanel) {
        if (activePanel === panel) {
            activePanel = null;
        } else {
            activePanel = panel;
            if (panel === 'search') {
                tick().then(() => globalSearchInputEl?.focus());
            }
        }
        persistPanel();
    }

    function highlightMatch(text: string, query: string, caseSensitive: boolean, useRegex: boolean): string {
        if (!query) return escapeHtml(text);
        try {
            const flags = caseSensitive ? 'g' : 'gi';
            const regex = useRegex ? new RegExp(query, flags) : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
            return escapeHtml(text).replace(regex, '<mark>$&</mark>');
        } catch {
            return escapeHtml(text);
        }
    }

    function escapeHtml(s: string): string {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    $: {
        globalSearchQuery;
        globalSearchCaseSensitive;
        globalSearchRegex;
        tabs;
        performGlobalSearch();
    }
    $: hasOpenTabs = tabs.some(t => t.isOpen);
    $: activeTabName = tabs[activeTabId]?.fileName;
    $: activeTab = tabs[activeTabId];
    // Preview tabs use a distinct fileId; explorer should highlight the source file.
    $: activeExplorerFileId =
        activeTab?.type === 'preview' && activeTab.sourceFileId
            ? activeTab.sourceFileId
            : activeTab?.fileId;
    $: fileStoreValue = $fileStore;
    $: tabLanguages = (() => {
        fileStoreValue;
        const map: Record<string, ProgrammingLanguage> = {};
        for (const t of tabs) {
            if (isSpecialTabType(t.type)) continue;
            map[t.fileId] = t.fileId === tabs[activeTabId]?.fileId ? language : getLanguageForTab(t.fileId);
        }
        return map;
    })();
    $: previewHtml = (() => {
        if (!activeTab || activeTab.type !== 'preview' || !activeTab.sourceFileId) return '';
        const fkey = fileKey();
        const files = JSON.parse(fileStoreValue[fkey] || '[]') as FileEntry[];
        const sourceEntry = files.find((f: FileEntry) => f.fileId === activeTab.sourceFileId && f.language === 'markdown');
        const src = sourceEntry?.content ?? '';

        return renderMarkdown(src, {
            imageThumbnails: true,
            resolveFileLanguage: (fileId) => getLanguageForTab(fileId)
        });
    })();
    let previewEl: HTMLDivElement | null = null;
    // Pasted images render as fake links (cojudge://image/<id>); swap them for
    // the IndexedDB payload once the HTML has been painted.
    $: if (previewHtml) {
        tick().then(() => {
            if (previewEl) resolvePastedImages(previewEl);
        });
    }
    $: shareDirty = (() => {
        if (activeTab?.type === 'preview' && activeTab.sourceFileId) {
            const fkey = fileKey();
            const files = JSON.parse(fileStoreValue[fkey] || '[]') as FileEntry[];
            const sourceEntry = files.find((f: FileEntry) => f.fileId === activeTab.sourceFileId && f.language === 'markdown');
            return sourceEntry?.lastSharedContent === undefined || sourceEntry.content !== sourceEntry.lastSharedContent;
        }
        return lastSharedContent === undefined || code !== lastSharedContent;
    })();
    $: pageTitle = activeTabName ? `${activeTabName} - Playground - Cojudge` : 'Playground - Cojudge';
    let isMac = false;

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        // Open file from /playground?fileId=... deep links
        const fileIdParam = new URLSearchParams(window.location.search).get('fileId');
        if (fileIdParam) {
            activateTab(fileIdParam);
        } else if (activeTab?.type === 'preview') {
            // Restore last markdown view mode for the initially active tab.
            applyPreferredVisualMode();
        } else {
            maybeOpenPreferredMarkdownMode();
        }
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
            if (showMentionPopup) {
                const target = e.target as HTMLElement;
                if (!target.closest('.mention-popup') && !wysiwygEl?.contains(target)) {
                    closeMentionPopup();
                }
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.defaultPrevented) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                showSettings = false;
                closeSearch();
                closeLightbox();
                closeMentionPopup();
            }
            // Cmd+S or Ctrl+S — open cloud sync
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                openCloudSettings();
            }
            // Cmd+P or Ctrl+P
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                if (showSearch) closeSearch(); else openSearch();
            }
            // Ctrl+Shift+E or Cmd+Shift+E
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                activePanel = activePanel === 'explorer' ? null : 'explorer';
                persistPanel();
            }
            // Ctrl+B or Cmd+B
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                activePanel = activePanel !== null ? null : 'explorer';
                persistPanel();
            }
            // Ctrl+Shift+F or Cmd+Shift+F
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                activePanel = activePanel === 'search' ? null : 'search';
                if (activePanel === 'search') {
                    tick().then(() => globalSearchInputEl?.focus());
                }
            }
            // Ctrl+Alt+N or Cmd+Alt+N
            if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key.toLowerCase() === 'n' || e.code === 'KeyN')) {
                e.preventDefault();
                e.stopPropagation();
                addNewTab('tab');
            }
        };
        const handleUnload = () => {
            if (isCloudRestoreInProgress()) return;
            commitWysiwygEdits();
            saveCurrentViewState();
        };
        const handleCloudFlush = () => {
            if (isCloudRestoreInProgress()) return;
            commitWysiwygEdits();
            saveCurrentViewState();
        };
        document.addEventListener('click', handleDocClick);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener(CLOUD_FLUSH_EVENT, handleCloudFlush);
        return () => {
            document.removeEventListener('click', handleDocClick);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener(CLOUD_FLUSH_EVENT, handleCloudFlush);
        };
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<svelte:window on:keydown={handleGlobalKeydown} />

<div class="workspace">
    <!-- Activity Bar -->
    <div class="activity-bar">
        <a href="/" class="activity-icon" title="Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
        <Tooltip text={isMac ? "Explorer (Cmd+B)" : "Explorer (Ctrl+B)"} pos="right">
            <button
                class="activity-icon {activePanel === 'explorer' ? 'active' : ''}"
                on:click={() => activatePanel('explorer')}
                aria-label="Explorer"
            >
                <!-- Explorer Icon (Files) -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13 2v7h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </Tooltip>
        <Tooltip text={isMac ? "Search (Cmd+Shift+F)" : "Search (Ctrl+Shift+F)"} pos="right">
            <button
                class="activity-icon {activePanel === 'search' ? 'active' : ''}"
                on:click={() => activatePanel('search')}
                aria-label="Search"
            >
                <!-- Search Icon -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </Tooltip>
        <Tooltip text="Whiteboard" pos="right">
            <button
                class="activity-icon {activeTab?.type === 'whiteboard' ? 'active' : ''}"
                on:click={openWhiteboard}
                aria-label="Whiteboard"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                </svg>
            </button>
        </Tooltip>
        <Tooltip text={isMac ? "Cloud Sync (Cmd+S)" : "Cloud Sync (Ctrl+S)"} pos="right">
            <button
                class="activity-icon"
                on:click={openCloudSettings}
                title={$cloudSyncState.authStatus === 'signed-in' ? 'Cojudge Cloud' : 'Cojudge Cloud — Local only'}
                bind:this={cloudActivityButton}
            >
                {#if $cloudSyncState.authStatus === 'signed-in'}
                    <!-- Cloud Icon -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {#if $cloudSyncState.syncStatus === 'error' || $cloudSyncState.syncStatus === 'offline'}
                        <span class="cloud-icon-legend error" title="Sync with Cojudge Cloud failed" aria-hidden="true"></span>
                    {:else if $cloudSyncState.syncStatus === 'syncing' || $cloudSyncState.remoteStatus === 'loading'}
                        <span class="cloud-icon-legend loading" title="Syncing with Cojudge Cloud" aria-hidden="true"></span>
                    {:else if showSyncSuccess}
                        <span class="cloud-icon-legend success" title="Progress synced with Cojudge Cloud" aria-hidden="true"></span>
                    {:else if $cloudSyncState.resolution}
                        <span class="cloud-icon-legend" title="Local or conflicting cloud changes need attention" aria-hidden="true"></span>
                    {/if}
                {:else}
                    <!-- Offline Cloud Icon -->
                    <svg class="cloud-icon-offline" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                {/if}
            </button>
        </Tooltip>
        <div class="settings-wrapper activity-settings" bind:this={settingsContainer}>
            <Tooltip text={"Settings"} pos="right">
                <button
                    class="activity-icon"
                    title="Editor Settings"
                    aria-label="Editor Settings"
                    on:click={() => (showSettings = !showSettings)}
                >
                    <!-- Cog icon -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </Tooltip>
            {#if showSettings}
                <div class="settings-dropdown" role="dialog" aria-label="Editor settings">
                    <label for="font-size-select">Font size</label>
                    <select id="font-size-select" bind:value={fontSize}>
                        {#each fontSizes as size}
                            <option value={size}>{size}px</option>
                        {/each}
                    </select>
                    <label for="theme-select">Theme</label>
                    <select id="theme-select" bind:value={theme}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                    <label for="vim-mode-select">Key Bindings</label>
                    <select id="vim-mode-select" bind:value={vimMode}>
                        <option value="off">Standard</option>
                        <option value="on">Vim</option>
                    </select>
                </div>
            {/if}
        </div>
    </div>

    <!-- Left Sidebar -->
    {#if isSidebarOpen}
    <div class="sidebar">
        {#if activePanel === 'explorer'}
        <div class="sidebar-header">
            <span>EXPLORER</span>
            <div class="sidebar-header-actions">
                <input
                    type="file"
                    accept="application/json,.json"
                    class="import-file-input"
                    bind:this={importInputEl}
                    on:change={handleImportFile}
                />
                <button
                    class="icon-button"
                    title="Import folder"
                    aria-label="Import folder"
                    on:click={() => importInputEl?.click()}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 8l-5-5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="add-menu-wrapper" bind:this={addMenuContainer}>
                    <button
                        class="icon-button"
                        title="New"
                        aria-label="New file or folder"
                        aria-haspopup="menu"
                        aria-expanded={showAddMenu}
                        on:click|stopPropagation={() => { closeContextMenu(); showAddMenu = !showAddMenu; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    {#if showAddMenu}
                        <div class="add-menu" role="menu">
                            <button
                                class="add-menu-item"
                                role="menuitem"
                                on:click={() => { showAddMenu = false; addNewTab('sidebar'); }}
                            >New File</button>
                            <button
                                class="add-menu-item"
                                role="menuitem"
                                on:click={() => { showAddMenu = false; addNewFolder(); }}
                            >New Folder</button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        <div
            class="file-list {explorerDragOverRoot ? 'drag-over-root' : ''}"
            data-explorer-root="true"
            role="tree"
        >
            {#each flatExplorer as t (t.fileId)}
                {#if t.kind === 'empty'}
                    <div
                        class="file-item empty-folder-label"
                        style="padding-left: {8 + t.depth * 14}px"
                        aria-hidden="true"
                    >
                        <span class="file-name">(empty)</span>
                    </div>
                {:else}
                    <div
                        class="file-item {t.kind === 'folder' ? 'folder-item' : ''} {isDotFileName(t.fileName) ? 'dotfile' : ''} {t.kind === 'file' && hasOpenTabs && t.fileId === activeExplorerFileId ? 'active' : ''} {explorerDragOverId === t.fileId ? 'drag-over-folder' : ''} {explorerPointerDrag?.active && explorerPointerDrag.id === t.fileId ? 'is-dragging' : ''}"
                        style="padding-left: {8 + t.depth * 14}px"
                        data-explorer-id={t.fileId}
                        data-explorer-kind={t.kind}
                        on:click={() => handleExplorerItemClick(t)}
                        on:pointerdown={(e) => handleExplorerPointerDown(e, t.fileId)}
                        on:contextmenu={(e) => openExplorerContextMenu(e, t)}
                        role="treeitem"
                        aria-expanded={t.kind === 'folder' ? isFolderExpanded(t.fileId) : undefined}
                        tabindex="0"
                        on:keydown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleExplorerItemClick(t);
                            }
                        }}
                    >
                        {#if t.kind === 'folder'}
                            <button
                                type="button"
                                class="folder-chevron"
                                title={isFolderExpanded(t.fileId) ? 'Collapse folder' : 'Expand folder'}
                                aria-label={isFolderExpanded(t.fileId) ? 'Collapse folder' : 'Expand folder'}
                                aria-expanded={isFolderExpanded(t.fileId)}
                                on:pointerdown|stopPropagation
                                on:click|stopPropagation={() => toggleFolderExpanded(t.fileId)}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate({isFolderExpanded(t.fileId) ? '90deg' : '0deg'});">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <span class="file-lang-icon folder-icon" aria-hidden="true">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        {/if}
                        {#if editingTabId === t.fileId && renamingSource === 'sidebar'}
                             <input
                                class="file-rename-input"
                                type="text"
                                bind:value={editingName}
                                bind:this={renameInputEl}
                                on:click|stopPropagation
                                on:keydown|stopPropagation={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); applyRename(); }
                                    else if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
                                }}
                                on:blur={applyRename}
                            />
                        {:else}
                            {#if t.kind === 'file'}
                                <span class="file-lang-icon">
                                    <LanguageIcon language={tabLanguages[t.fileId] ?? language} size={17} />
                                </span>
                            {/if}
                            <span class="file-name">{t.fileName}</span>
                        {/if}

                        <div class="file-actions">
                            {#if t.kind === 'file'}
                                <button
                                    class="file-action-btn"
                                    title={isDotFileName(t.fileName) ? 'Show this file in cloud backups' : 'Hide this file from cloud backups'}
                                    aria-label={isDotFileName(t.fileName) ? 'Show this file in cloud backups' : 'Hide this file from cloud backups'}
                                    on:click|stopPropagation={() => toggleCloudVisibility(t.fileId, t.fileName)}
                                >
                                    {#if isDotFileName(t.fileName)}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                                            <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                    {:else}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                                        </svg>
                                    {/if}
                                </button>
                                <button
                                    class="file-action-btn"
                                    title="Duplicate"
                                    on:click|stopPropagation={() => duplicateFile(t.fileId, t.fileName)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                    </svg>
                                </button>
                            {:else}
                                <button
                                    class="file-action-btn"
                                    title="Download folder"
                                    on:click|stopPropagation={() => downloadFolder(t.fileId)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            {/if}
                            <button
                                class="file-action-btn"
                                title="Rename"
                                on:click|stopPropagation={() => startRename(t.fileId, t.fileName, 'sidebar')}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                    <path d="M14.06 6.19l3.75 3.75 1.69-1.69a1.5 1.5 0 000-2.12L17.87 4.5a1.5 1.5 0 00-2.12 0l-1.69 1.69z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                </svg>
                            </button>
                            <button
                                class="file-action-btn"
                                title="Delete"
                                on:click|stopPropagation={() => deleteFile(t.fileId)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
        {#if contextMenu}
            <div
                class="explorer-context-menu"
                role="menu"
                bind:this={contextMenuEl}
                style="left: {contextMenu.x}px; top: {contextMenu.y}px;"
                on:contextmenu|preventDefault
            >
                <button class="add-menu-item" role="menuitem" on:click={contextCreateFile}>New File</button>
                <button class="add-menu-item" role="menuitem" on:click={contextCreateFolder}>New Folder</button>
            </div>
        {/if}
        {:else if activePanel === 'search'}
        <div class="sidebar-header">
            <span>SEARCH</span>
        </div>
        <div class="search-panel">
            <div class="search-input-row">
                <div class="search-input-container">
                    <input
                        type="text"
                        class="search-input"
                        placeholder="Search"
                        bind:value={globalSearchQuery}
                        bind:this={globalSearchInputEl}
                        spellcheck="false"
                    />
                    <div class="search-toggle-buttons">
                        <button
                            class="search-toggle-btn {globalSearchCaseSensitive ? 'active' : ''}"
                            on:click={() => { globalSearchCaseSensitive = !globalSearchCaseSensitive; persistPanel(); }}
                            title="Match Case (Alt+C)"
                        >Aa</button>
                        <button
                            class="search-toggle-btn {globalSearchRegex ? 'active' : ''}"
                            on:click={() => { globalSearchRegex = !globalSearchRegex; persistPanel(); }}
                            title="Use Regular Expression (Alt+R)"
                        >.*</button>
                    </div>
                </div>
            </div>
            {#if globalSearchQuery.trim()}
                <div class="search-results-summary">
                    {#if globalSearchResults.length === 0}
                        No results found.
                    {:else}
                        {@const contentMatches = globalSearchResults.reduce((sum, r) => sum + r.matches.length, 0)}
                        {@const fileNameOnlyMatches = globalSearchResults.filter(r => r.fileNameMatch && r.matches.length === 0).length}
                        {contentMatches + " "}{#if contentMatches === 1} result{:else} results{/if}{#if fileNameOnlyMatches > 0} + {fileNameOnlyMatches} filename match{#if fileNameOnlyMatches !== 1}es{/if}{/if} in {globalSearchResults.length} file{#if globalSearchResults.length !== 1}s{/if}
                    {/if}
                </div>
                <div class="search-results">
                    {#each globalSearchResults as result}
                        <div class="search-result-group">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="search-result-file" on:click={() => toggleResultCollapse(result.fileId)}>
                                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate({collapsedResults.has(result.fileId) ? '0deg' : '90deg'});">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <div class="search-result-file-info" on:click|stopPropagation={() => activateTab(result.fileId)}>
                                    <span class="file-icon">
                                        <LanguageIcon language={tabLanguages[result.fileId] ?? result.language} size={17} />
                                    </span>
                                    <span class="file-name">{@html highlightMatch(result.fileName, globalSearchQuery, globalSearchCaseSensitive, globalSearchRegex)}</span>
                                </div>
                                {#if result.matches.length > 0}
                                <span class="search-result-count">{result.matches.length}</span>
                                {/if}
                            </div>
                            {#if !collapsedResults.has(result.fileId)}
                                {#each result.matches as match}
                                    {@const highlightedText = highlightMatch(match.text, globalSearchQuery, globalSearchCaseSensitive, globalSearchRegex)}
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <div class="search-result-match" on:click={() => { activateTab(result.fileId, match.language); }}>
                                        <span class="search-result-line">{match.line}</span>
                                        <span class="search-result-text">{@html highlightedText}</span>
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
        {/if}
    </div>
    {/if}

    <!-- Right Pane: Editor and Console -->
    <div class="editor-pane">
        {#if hasOpenTabs}
        <div class="editor-header" style="display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-2);border-bottom:1px solid var(--color-border);">
            <div class="tabs-container">
                <div class="tab-bar" role="tablist" aria-label="Editor tabs">
                    {#each tabs as t}
                        {#if t.isOpen}
                        <div
                            class="tab {isDotFileName(t.fileName) ? 'dotfile' : ''} {t.fileId === tabs[activeTabId].fileId ? 'active' : ''} {tabPointerDrag?.active && tabPointerDrag.fileId === t.fileId ? 'is-dragging' : ''}"
                            role="tab"
                            aria-selected={t.fileId === tabs[activeTabId].fileId}
                            tabindex={t.fileId === tabs[activeTabId].fileId ? 0 : -1}
                            data-file-id={t.fileId}
                            on:click={() => handleTabClick(t)}
                            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(t.fileId); } }}
                            on:pointerdown={(e) => handleTabPointerDown(e, t.fileId)}
                            on:mousedown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.which === 2) {
                                    closeTab(t.fileId);
                                }
                            }}
                        >
                            {#if editingTabId === t.fileId && renamingSource === 'tab'}
                                <input
                                    class="tab-rename-input"
                                    type="text"
                                    bind:value={editingName}
                                    bind:this={renameInputEl}
                                    on:click|stopPropagation
                                    on:keydown|stopPropagation={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); applyRename(); }
                                        else if (e.key === 'Escape') { e.preventDefault(); cancelRename(); }
                                    }}
                                    on:blur={applyRename}
                                />
                            {:else}
                                {#if t.type === 'preview'}
                                    <span class="tab-lang-icon">
                                        <LanguageIcon language="markdown" size={17} />
                                    </span>
                                {:else if t.type === 'whiteboard'}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:2px;flex-shrink:0;">
                                        <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                                        <path d="m8 15 6-6 2 2-6 6H8v-2Z"></path>
                                    </svg>
                                {:else}
                                    <span class="tab-lang-icon">
                                        <LanguageIcon language={tabLanguages[t.fileId] ?? language} size={17} />
                                    </span>
                                {/if}
                                <span class="tab-title">{t.fileName}</span>
                            {/if}

                            {#if t.type !== 'whiteboard'}
                                <button
                                    class="tab-rename"
                                    aria-label="Rename tab"
                                    title="Rename"
                                    on:click|stopPropagation={() => startRename(t.fileId, t.fileName, 'tab')}
                                >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                    <path d="M14.06 6.19l3.75 3.75 1.69-1.69a1.5 1.5 0 000-2.12L17.87 4.5a1.5 1.5 0 00-2.12 0l-1.69 1.69z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                </svg>
                            </button>
                            {/if}

                            {#if tabs.length >= 1}
                                <button
                                    class="tab-close"
                                    aria-label="Close tab"
                                    title="Close"
                                    on:click|stopPropagation={() => closeTab(t.fileId)}
                                >
                                    ×
                                </button>
                            {/if}
                        </div>
                        {/if}
                    {/each}
                    {#if tabDropIndicatorStyle}
                        <div class="tab-drop-indicator" style={tabDropIndicatorStyle} aria-hidden="true"></div>
                    {/if}
                    <button class="tab-add" aria-label="New tab" on:click={() => addNewTab('tab')}>+</button>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-2);">
                {#if activeTab?.type === 'preview'}
                    <div class="markdown-mode-switch" role="group" aria-label="Markdown view mode">
                        <button
                            class="markdown-mode-btn"
                            class:active={previewEditMode}
                            title="WYSIWYG"
                            aria-label="WYSIWYG"
                            aria-pressed={previewEditMode}
                            on:click={() => setMarkdownMode('wysiwyg')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M12 3l1.09 3.34L16.5 7.5l-3.41 1.16L12 12l-1.09-3.34L7.5 7.5l3.41-1.16L12 3z" fill="currentColor"/>
                                <path d="M18.5 13l.7 2.15L21.5 16l-2.3.78L18.5 19l-.7-2.22L15.5 16l2.3-.85L18.5 13z" fill="currentColor"/>
                                <path d="M6.5 14l.55 1.68L8.8 16.3l-1.75.6L6.5 18.6l-.55-1.7L4.2 16.3l1.75-.62L6.5 14z" fill="currentColor"/>
                            </svg>
                            WYSIWYG
                        </button>
                        <button
                            class="markdown-mode-btn"
                            class:active={!previewEditMode}
                            title="Preview"
                            aria-label="Preview"
                            aria-pressed={!previewEditMode}
                            on:click={() => setMarkdownMode('preview')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Preview
                        </button>
                        <button
                            class="markdown-mode-btn"
                            title="Source"
                            aria-label="Source"
                            aria-pressed={false}
                            on:click={() => setMarkdownMode('source')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Source
                        </button>
                    </div>
                {:else if activeTab?.type === 'whiteboard'}
                    <span style="font-size:0.9rem;color:var(--color-text-secondary);">Whiteboard</span>
                {:else}
                <div style="display:flex;align-items:center;gap:var(--spacing-1);">
                    <label for="language-select" style="font-size:0.9rem;color:var(--color-text-secondary);margin-right:4px;">Language</label>
                    <select
                        id="language-select"
                        bind:value={language}
                        on:focus={() => (suppressSave = true)}
                        on:mousedown={() => (suppressSave = true)}
                        on:keydown={() => (suppressSave = true)}
                        on:change={() => {
                            saveCurrentViewState();
                            userSettingsStorage.update((s) => ({ ...s, playgroundPreferredLanguage: language }));
                            const currentTab = tabs[activeTabId];
                            if (currentTab && !isSpecialTabType(currentTab.type)) {
                                setLastLanguage(currentTab.fileId, language);
                            }
                        }}
                        on:blur={() => (suppressSave = false)}
                    >
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="typescript">TypeScript</option>
                        <option value="csharp">C#</option>
                        <option value="rust">Rust</option>
                        <option value="go">Go</option>
                        <option value="plaintext">Plaintext</option>
                        <option value="markdown">Markdown</option>
                    </select>
                </div>
                {#if language === 'markdown'}
                    <div class="markdown-mode-switch" role="group" aria-label="Markdown view mode">
                        <button
                            class="markdown-mode-btn"
                            title="WYSIWYG"
                            aria-label="WYSIWYG"
                            aria-pressed={false}
                            on:click={() => setMarkdownMode('wysiwyg')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M12 3l1.09 3.34L16.5 7.5l-3.41 1.16L12 12l-1.09-3.34L7.5 7.5l3.41-1.16L12 3z" fill="currentColor"/>
                                <path d="M18.5 13l.7 2.15L21.5 16l-2.3.78L18.5 19l-.7-2.22L15.5 16l2.3-.85L18.5 13z" fill="currentColor"/>
                                <path d="M6.5 14l.55 1.68L8.8 16.3l-1.75.6L6.5 18.6l-.55-1.7L4.2 16.3l1.75-.62L6.5 14z" fill="currentColor"/>
                            </svg>
                            WYSIWYG
                        </button>
                        <button
                            class="markdown-mode-btn"
                            title="Preview"
                            aria-label="Preview"
                            aria-pressed={false}
                            on:click={() => setMarkdownMode('preview')}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Preview
                        </button>
                        <button
                            class="markdown-mode-btn active"
                            title="Source"
                            aria-label="Source"
                            aria-pressed={true}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Source
                        </button>
                    </div>
                {/if}
                {/if}
                {#if isFirebaseAvailable && (activeTab?.type === 'preview' || !isSpecialTabType(tabs[activeTabId]?.type))}
                    <Tooltip text={"Share"} pos={"bottom"}>
                        <button
                            class="icon-button"
                            title="Share"
                            aria-label="Share"
                            on:click={handleShare}
                            style="position: relative;"
                        >
                            <!-- Share icon -->
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 6l-4-4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {#if shareDirty}
                                <div class="unsaved-dot"></div>
                            {/if}
                        </button>
                    </Tooltip>
                {/if}
                {#if activeTab?.type === 'preview' || !isSpecialTabType(activeTab?.type)}
                <Tooltip text={"Reset Code"} pos={"left"}>
                    <button
                        class="icon-button"
                        title="Reset Code"
                        aria-label="Reset Code"
                        on:click={handleResetClick}
                    >
                        <!-- Reset icon -->
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M4 4v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 20v-6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 10a8 8 0 0 0-8-8 8 8 0 0 0-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 14a8 8 0 0 0 8 8 8 8 0 0 0 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </Tooltip>
                {/if}
            </div>
        </div>

        <div class="editor-container" class:whiteboard-active={activeTab?.type === 'whiteboard'}>
            {#if activeTab?.type === 'whiteboard'}
                <div class="whiteboard-host">
                    <Whiteboard embedded active={true} />
                </div>
            {:else if activeTab?.type === 'preview'}
                {#if previewEditMode}
                    <div class="wysiwyg-container">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="wysiwyg-toolbar" on:mousedown={handleToolbarMouseDown} on:click={handleToolbarClick}>
                            <Tooltip text={isMac ? "Cmd+B" : "Ctrl+B"} pos="bottom">
                                <button type="button" data-command="bold" aria-label="Bold">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                                </button>
                            </Tooltip>
                            <Tooltip text={isMac ? "Cmd+I" : "Ctrl+I"} pos="bottom">
                                <button type="button" data-command="italic" aria-label="Italic">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                                </button>
                            </Tooltip>
                            <Tooltip text={isMac ? "Cmd+Shift+X" : "Ctrl+Shift+X"} pos="bottom">
                                <button type="button" data-command="strikeThrough" aria-label="Strikethrough">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>
                                </button>
                            </Tooltip>
                            <span class="wysiwyg-separator"></span>
                            <button type="button" data-command="formatBlock" data-value="h1" title="Heading 1" aria-label="Heading 1"><span class="wysiwyg-text-btn">H1</span></button>
                            <button type="button" data-command="formatBlock" data-value="h2" title="Heading 2" aria-label="Heading 2"><span class="wysiwyg-text-btn">H2</span></button>
                            <button type="button" data-command="formatBlock" data-value="h3" title="Heading 3" aria-label="Heading 3"><span class="wysiwyg-text-btn">H3</span></button>
                            <span class="wysiwyg-separator"></span>
                            <button type="button" data-command="insertUnorderedList" title="Bulleted list" aria-label="Bulleted list">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                            </button>
                            <button type="button" data-command="insertOrderedList" title="Numbered list" aria-label="Numbered list">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                            </button>
                            <button type="button" data-command="insertTaskList" title="Checklist" aria-label="Checklist">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m4 8 1.5 1.5L9 6"/><line x1="13" y1="8" x2="21" y2="8"/><rect x="3" y="13" width="6" height="6" rx="1"/><line x1="13" y1="16" x2="21" y2="16"/></svg>
                            </button>
                            <button type="button" data-command="formatBlock" data-value="blockquote" title="Quote" aria-label="Quote">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
                            </button>
                            <button type="button" data-command="codeBlock" title="Code block" aria-label="Code block">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            </button>
                            <Tooltip text={isMac ? "Cmd+E" : "Ctrl+E"} pos="bottom">
                                <button type="button" data-command="inlineCode" aria-label="Inline code">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
                                </button>
                            </Tooltip>
                            <button type="button" data-command="insertHorizontalRule" title="Horizontal rule" aria-label="Horizontal rule">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"/></svg>
                            </button>
                            <span class="wysiwyg-separator"></span>
                            <Tooltip text={isMac ? "Cmd+K" : "Ctrl+K"} pos="bottom">
                                <button type="button" data-command="link" aria-label="Insert link">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                </button>
                            </Tooltip>
                            <button type="button" data-command="removeFormat" title="Clear formatting" aria-label="Clear formatting">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
                            </button>
                            {#if showLinkInput}
                                <input
                                    class="wysiwyg-link-input"
                                    type="text"
                                    placeholder="https://example.com"
                                    aria-label="Link URL"
                                    bind:value={linkUrl}
                                    bind:this={linkInputEl}
                                    on:keydown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                                        else if (e.key === 'Escape') { e.preventDefault(); showLinkInput = false; linkUrl = ''; savedLinkRange = null; }
                                    }}
                                />
                            {/if}
                        </div>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class="markdown-preview markdown-body wysiwyg-editing"
                            style="font-size: {fontSize}px;"
                            contenteditable="true"
                            role="textbox"
                            aria-multiline="true"
                            aria-label="Markdown editor (WYSIWYG)"
                            tabindex="0"
                            bind:this={wysiwygEl}
                            on:input={handleWysiwygInput}
                            on:keydown={handleWysiwygKeydown}
                            on:paste={handleWysiwygPaste}
                            on:click={handleWysiwygClick}
                            on:change={handleWysiwygChange}
                            on:blur={commitWysiwygEdits}
                        ></div>
                    </div>
                {:else}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="markdown-preview markdown-body" bind:this={previewEl} on:click={handlePreviewClick}>
                        {@html previewHtml}
                    </div>
                {/if}
            {:else if CodeEditor}
                <svelte:component
                    this={CodeEditor}
                    bind:this={editorComponent}
                    bind:value={code}
                    {language}
                    {fontSize}
                    {theme}
                    {vimMode}
                    viewState={currentViewState}
                    bind:breakpoints={debugBreakpoints}
                    {activeDebugLine}
                    {debugJobId}
                    onPasteImage={language === 'markdown' ? markdownImageSnippet : undefined}
                />
            {:else}
                Loading...
            {/if}
        </div>
        {#if language !== 'plaintext' && language !== 'markdown' && !isSpecialTabType(activeTab?.type)}
            <PlaygroundExecutionPanel {code} {language} {isMac} bind:output bind:logs debugBreakpoints={debugBreakpoints} bind:activeDebugLine={activeDebugLine} bind:debugJobId={debugJobId} />
        {/if}
        {:else}
        <div class="empty-state">
            <div class="empty-state-content">
                {#if recentFiles.length > 0}
                    <div class="empty-section">
                        <div class="empty-section-title">Recent Files</div>
                        <div class="recent-files-grid">
                            {#each recentFiles as file}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div
                                    class="recent-file-card"
                                    role="button"
                                    tabindex="0"
                                    on:click={() => activateTab(file.fileId)}
                                    on:keydown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            activateTab(file.fileId);
                                        }
                                    }}
                                >
                                    <div class="recent-file-card-header">
                                        {#if file.type === 'preview'}
                                            <LanguageIcon language="markdown" size={17} />
                                        {:else}
                                            <LanguageIcon language={tabLanguages[file.fileId] ?? language} size={17} />
                                        {/if}
                                        <span class="recent-file-card-title">{file.fileName}</span>
                                    </div>
                                    {#if getFilePath(file.fileId) != '/'}
                                      <span class="recent-file-card-path">{getFilePath(file.fileId).replace(/^\/|\/$/g, '')}</span>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
                <div class="empty-shortcuts">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="shortcut-row" on:click={() => openSearch()}>
                        <span class="shortcut-label">Quick Open</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">P</span></span>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="shortcut-row" on:click={() => { activePanel = activePanel === 'explorer' ? null : 'explorer'; persistPanel(); }}>
                        <span class="shortcut-label">Toggle Explorer</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">SHIFT</span><span class="key">E</span></span>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="shortcut-row" on:click={() => { activePanel = activePanel !== null ? null : 'explorer'; persistPanel(); }}>
                        <span class="shortcut-label">Toggle Sidebar</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">B</span></span>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="shortcut-row" on:click={() => { activePanel = activePanel === 'search' ? null : 'search'; persistPanel(); if (activePanel === 'search') tick().then(() => globalSearchInputEl?.focus()); }}>
                        <span class="shortcut-label">Search in Files</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">SHIFT</span><span class="key">F</span></span>
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="shortcut-row" on:click={() => addNewTab('tab')}>
                        <span class="shortcut-label">New Tab</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">ALT</span><span class="key">N</span></span>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>

    {#if showShareModal}
        <ShareModal
            url={shareUrl}
            qrCodeDataUrl={qrCodeDataUrl}
            {code}
            on:close={() => showShareModal = false}
            on:generateNew={handleGenerateNewLink}
        />
    {/if}

    {#if lightboxSrc}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="image-lightbox" role="dialog" aria-modal="true" aria-label="Full-size image" tabindex="-1" on:click={closeLightbox}>
            <button type="button" class="lightbox-close" title="Close (Esc)" aria-label="Close image viewer" on:click|stopPropagation={closeLightbox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img src={lightboxSrc} alt="Full-size" on:click|stopPropagation={() => {}} />
        </div>
    {/if}

    {#if showSearch}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="search-overlay" on:click={closeSearch}>
            <div class="search-modal" on:click|stopPropagation>
                <input
                    bind:this={searchInputEl}
                    bind:value={searchQuery}
                    placeholder="Search files by name..."
                    class="search-file-input"
                    on:keydown={(e) => {
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            closeSearch();
                        }
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            selectedIndex = (selectedIndex + 1) % filteredFiles.length;
                            scrollSelectedSearchResultIntoView();
                        }
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            selectedIndex = (selectedIndex - 1 + filteredFiles.length) % filteredFiles.length;
                            scrollSelectedSearchResultIntoView();
                        }
                        if (e.key === 'Enter' && filteredFiles.length > 0) {
                            activateTab(filteredFiles[selectedIndex].fileId);
                            closeSearch();
                        }
                    }}
                />
                <div class="search-results" bind:this={searchResultsEl}>
                    {#each filteredFiles as file, i}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="search-result-item {i === selectedIndex ? 'selected' : ''}"
                            on:click={() => {
                                activateTab(file.fileId);
                                closeSearch();
                            }}
                            on:mouseenter={() => selectedIndex = i}
                        >
                            <span class="search-file-info">
                                {#if file.type === 'preview'}
                                    <LanguageIcon language="markdown" size={17} />
                                {:else}
                                    <LanguageIcon language={tabLanguages[file.fileId] ?? language} size={17} />
                                {/if}
                                <span class="search-file-name">{file.fileName}</span>
                            </span>
                            <span class="search-file-meta">
                                {#if file.isOpen}
                                    <span class="search-file-badge">Open</span>
                                {/if}
                                {#if getFilePath(file.fileId) !== '/'}
                                    <span class="search-file-path">{getFilePath(file.fileId).replace(/^\/|\/$/g, '')}</span>
                                {/if}
                            </span>
                        </div>
                    {/each}
                    {#if filteredFiles.length === 0}
                        <div class="search-no-results">No matching files</div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    {#if showMentionPopup}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="mention-popup" style={mentionPopupStyle} on:mousedown|preventDefault>
            <div class="mention-popup-header">Search files by name...</div>
            <div class="mention-results" bind:this={mentionResultsEl}>
                {#each mentionFilteredFiles as file, i}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="mention-result-item {i === mentionSelectedIndex ? 'selected' : ''}"
                        on:click={() => insertFileMention(file)}
                        on:mouseenter={() => mentionSelectedIndex = i}
                    >
                        <span class="search-file-info">
                            {#if file.type === 'preview'}
                                <LanguageIcon language="markdown" size={17} />
                            {:else}
                                <LanguageIcon language={tabLanguages[file.fileId] ?? language} size={17} />
                            {/if}
                            <span class="search-file-name">{file.fileName}</span>
                        </span>
                        <span class="search-file-meta">
                            {#if getFilePath(file.fileId) !== '/'}
                                <span class="search-file-path">{getFilePath(file.fileId).replace(/^\/|\/$/g, '')}</span>
                            {/if}
                        </span>
                    </div>
                {/each}
                {#if mentionFilteredFiles.length === 0}
                    <div class="search-no-results">No matching files</div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<CloudSyncModal open={showCloudSettings} onClose={closeCloudSettings} />

<style>
    .workspace {
        display: flex;
        flex-direction: row;
        height: 100vh;
        padding: 0;
        background-color: var(--color-bg); /* Use the main background */
    }

    .editor-pane {
        background-color: var(--color-surface); /* Floating surface */
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1;
    }

    /* Activity Bar */
    .activity-bar {
        width: 48px;
        background-color: var(--color-bg);
        border-right: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: var(--spacing-2);
        flex-shrink: 0;
        z-index: 10;
    }

    .activity-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        position: relative;
        padding: 0;
    }

    .activity-icon:hover {
        color: var(--color-text);
    }

    .activity-icon.active {
        color: var(--color-text);
        border-left: 2px solid var(--color-highlight); /* Visual indicator */
    }

    .cloud-icon-legend {
        position: absolute;
        top: 5px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-medium);
        box-shadow: 0 0 0 2px var(--color-bg);
    }

    .cloud-icon-legend.loading {
        background: transparent;
        border: 1.5px solid var(--color-text-secondary);
        border-top-color: var(--color-highlight, var(--color-text));
        box-shadow: 0 0 0 1px var(--color-bg);
        animation: cloud-icon-spin 0.7s linear infinite;
    }

    .cloud-icon-legend.success,
    .cloud-icon-legend.error {
        background: transparent;
        border: none;
        box-shadow: 0 0 0 1px var(--color-bg);
        width: 12px;
        height: 12px;
    }

    .cloud-icon-legend.success::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 0;
        width: 5px;
        height: 8px;
        border: solid #2ecc71;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        animation: cloud-icon-success-pop 0.25s ease-out;
    }

    .cloud-icon-legend.error::before,
    .cloud-icon-legend.error::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 8px;
        height: 2px;
        background: #e74c3c;
    }

    .cloud-icon-legend.error::before {
        transform: rotate(45deg);
    }

    .cloud-icon-legend.error::after {
        transform: rotate(-45deg);
    }

    @keyframes cloud-icon-success-pop {
        from {
            transform: rotate(45deg) scale(0.4);
            opacity: 0;
        }
        to {
            transform: rotate(45deg) scale(1);
            opacity: 1;
        }
    }

    @keyframes cloud-icon-spin {
        to {
            transform: rotate(360deg);
        }
    }

    .cloud-icon-offline {
        opacity: 0.5;
    }

    /* Sidebar Styles */
    .sidebar {
        width: 250px;
        background-color: var(--color-bg);
        border-right: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }

    .sidebar-header {
        height: 53px; /* Match editor header height roughly */
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--spacing-2);
        border-bottom: 1px solid var(--color-border);
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        letter-spacing: 0.05em;
    }

    .sidebar-header-actions {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .import-file-input {
        display: none;
    }

    .add-menu-wrapper {
        position: relative;
    }

    .add-menu {
        position: absolute;
        top: 32px;
        right: 0;
        min-width: 140px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        z-index: 20;
        padding: 4px;
        display: flex;
        flex-direction: column;
    }

    .add-menu-item {
        background: transparent;
        border: none;
        color: var(--color-text);
        text-align: left;
        padding: 8px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        white-space: nowrap;
    }

    .add-menu-item:hover {
        background-color: var(--color-second-bg);
    }

    .explorer-context-menu {
        position: fixed;
        min-width: 140px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        z-index: 1000;
        padding: 4px;
        display: flex;
        flex-direction: column;
    }

    .file-list {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-1) 0;
        min-height: 0;
    }

    .file-list.drag-over-root {
        box-shadow: inset 0 0 0 1px var(--color-highlight);
    }

    .file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px var(--spacing-2);
        cursor: pointer;
        color: var(--color-text-secondary);
        font-size: 0.9rem;
        user-select: none;
        touch-action: none;
    }

    .file-item.is-dragging {
        opacity: 0.45;
    }

    .file-item.empty-folder-label {
        cursor: default;
        opacity: 0.5;
        font-style: italic;
        pointer-events: none;
    }

    .file-item.empty-folder-label:hover {
        background-color: transparent;
        color: var(--color-text-secondary);
    }

    :global(body.explorer-dragging) {
        cursor: grabbing !important;
        user-select: none !important;
    }

    :global(body.explorer-dragging .file-item) {
        cursor: grabbing;
    }

    .file-item:hover {
        background-color: var(--color-second-bg);
        color: var(--color-text);
    }

    .file-item.active {
        background-color: var(--color-third-bg);
        color: var(--color-text);
    }

    .file-item.dotfile {
        opacity: 0.6;
    }

    .file-item.drag-over-folder {
        background-color: var(--color-third-bg);
        box-shadow: inset 0 0 0 1px var(--color-highlight);
    }

    .folder-chevron {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 2px;
        flex-shrink: 0;
        color: var(--color-text-secondary);
        background: transparent;
        border: none;
        padding: 2px;
        border-radius: 4px;
        cursor: pointer;
        touch-action: manipulation;
    }

    .folder-chevron:hover {
        background-color: rgba(255, 255, 255, 0.08);
        color: var(--color-text);
    }

    .folder-chevron svg {
        transition: transform 0.12s ease;
        display: block;
    }

    .folder-icon {
        color: var(--color-text-secondary);
    }

    .file-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        user-select: none;
        -webkit-user-select: none;
    }

    .file-lang-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        flex-shrink: 0;
    }

    .file-actions {
        display: none;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
    }

    .file-item:hover .file-actions {
        display: flex;
    }

    .file-action-btn {
        background: transparent;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 2px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .file-action-btn:hover {
        background-color: rgba(255,255,255,0.1);
        color: var(--color-text);
    }

    .file-rename-input {
        background: var(--color-bg);
        border: 1px solid var(--color-highlight);
        color: var(--color-text);
        border-radius: 2px;
        padding: 2px 4px;
        font-size: 0.9rem;
        width: 100%;
        min-width: 0;
    }

    /* Search Panel Styles */
    .search-panel {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .search-input-row {
        padding: var(--spacing-2);
    }

    .search-input-container {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: 2px;
        padding: 2px;
        transition: border-color 0.2s;
    }

    .search-input-container:focus-within {
        border-color: var(--color-highlight);
    }

    .search-input {
        width: 100%;
        background: transparent;
        border: none;
        color: var(--color-text);
        outline: none;
        font-family: inherit;
        flex: 1;
    }

    .search-input::placeholder {
        color: var(--color-text-secondary);
        opacity: 0.5;
    }

    .search-toggle-buttons {
        display: flex;
        gap: 2px;
        padding-right: 2px;
    }

    .search-toggle-btn {
        background: transparent;
        border: 1px solid transparent;
        color: var(--color-text-secondary);
        border-radius: 3px;
        padding: 1px 4px;
        font-size: 0.75rem;
        cursor: pointer;
        font-family: var(--font-mono, monospace);
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
    }

    .search-toggle-btn:hover {
        background: var(--color-second-bg);
        color: var(--color-text);
    }

    .search-toggle-btn.active {
        color: var(--color-text);
        background: rgba(var(--color-highlight-rgb, 59, 130, 246), 0.3);
        border-color: var(--color-highlight);
    }

    .search-results-summary {
        padding: 4px var(--spacing-2);
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        opacity: 0.8;
    }

    .search-results {
        flex: 1;
        overflow-y: auto;
        padding: 0;
    }

    .search-result-group {
        margin-bottom: 0;
    }

    .search-result-file {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px var(--spacing-1);
        cursor: pointer;
        color: var(--color-text);
        font-size: 0.85rem;
        font-weight: 400;
        user-select: none;
    }

    .search-result-file-info {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        min-width: 0;
    }

    .search-result-file:hover {
        background-color: var(--color-second-bg);
    }

    .chevron-icon {
        color: var(--color-text-secondary);
        opacity: 0.7;
        flex-shrink: 0;
        transition: transform 0.1s ease;
    }

    .file-icon {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }

    .search-result-count {
        margin-left: auto;
        background: var(--color-second-bg);
        color: var(--color-text-secondary);
        border-radius: 10px;
        padding: 0 6px;
        font-size: 0.7rem;
        font-weight: 600;
        min-width: 18px;
        text-align: center;
    }

    .search-result-match {
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding: 2px var(--spacing-2) 2px 42px;
        cursor: pointer;
        font-size: 0.82rem;
        color: var(--color-text-secondary);
        white-space: nowrap;
    }

    .search-result-match:hover {
        background-color: var(--color-second-bg);
        color: var(--color-text);
    }

    .search-result-line {
        color: var(--color-text-secondary);
        opacity: 0.5;
        font-size: 0.75rem;
        flex-shrink: 0;
        min-width: 24px;
        text-align: right;
    }

    .search-result-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre;
        font-family: var(--font-mono, monospace);
        font-size: 0.8rem;
    }

    .search-result-text :global(mark), .search-result-file :global(mark) {
        background: rgba(234, 179, 8, 0.4); /* VSCode-like yellow highlight */
        color: inherit;
        border-radius: 1px;
    }

    /* Right Pane Layout */
    .editor-pane {
        padding: 0; /* No padding on the pane itself */
    }

    .editor-container {
        flex-grow: 1;
        min-height: 0;
        padding: var(--spacing-1);
        display: flex;
        flex-direction: column;
    }

    .editor-container.whiteboard-active {
        padding: 0;
        position: relative;
        overflow: hidden;
    }

    .whiteboard-host {
        position: absolute;
        inset: 0;
        min-height: 0;
    }

    .markdown-preview {
        flex-grow: 1;
        min-height: 0;
        overflow-y: auto;
        padding: var(--spacing-4);
        width: 100%;
        text-align: left;
    }

    .markdown-preview img {
        max-width: 100%;
        box-sizing: content-box;
    }

    .markdown-preview a {
        color: var(--color-highlight);
        text-decoration: none;
    }

    .markdown-preview a:hover {
        text-decoration: underline;
    }

    /* WYSIWYG editing */
    .wysiwyg-container {
        flex-grow: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .wysiwyg-toolbar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 2px;
        padding: var(--spacing-1) var(--spacing-2);
        border-bottom: 1px solid var(--color-border);
        flex-shrink: 0;
    }

    .wysiwyg-toolbar button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 26px;
        height: 26px;
        padding: 0 4px;
        border-radius: 6px;
        background: transparent;
        color: var(--color-text-secondary);
        border: 1px solid transparent;
        cursor: pointer;
    }

    .wysiwyg-toolbar button:hover {
        background: var(--color-bg-tertiary, rgba(128, 128, 128, 0.15));
        color: var(--color-text);
    }

    .wysiwyg-text-btn {
        font-size: 0.72rem;
        font-weight: 700;
        font-family: inherit;
    }

    .wysiwyg-separator {
        width: 1px;
        height: 16px;
        background: var(--color-border);
        margin: 0 4px;
    }

    .wysiwyg-link-input {
        margin-left: var(--spacing-1);
        padding: 2px 8px;
        font-size: 0.8rem;
        border: 1px solid var(--color-border);
        border-radius: 6px;
        background: var(--color-bg);
        color: var(--color-text);
        min-width: 200px;
    }

    .wysiwyg-link-input:focus {
        outline: 1px solid var(--color-highlight);
        border-color: var(--color-highlight);
    }

    .wysiwyg-editing {
        outline: none;
        cursor: text;
    }

    .wysiwyg-editing :global(a) {
        cursor: pointer;
    }

    .wysiwyg-editing:focus {
        box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-highlight) 40%, transparent);
        border-radius: var(--border-radius-md);
    }

    .icon-button.active {
        color: var(--color-highlight);
        background: color-mix(in srgb, var(--color-highlight) 15%, transparent);
    }

    .markdown-mode-switch {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 3px;
        border-radius: 999px;
        background: var(--color-second-bg);
    }

    .markdown-mode-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border: none;
        border-radius: 999px;
        background: transparent;
        color: var(--color-text-secondary);
        font-size: 0.8rem;
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        white-space: nowrap;
    }

    .markdown-mode-btn:hover {
        color: var(--color-text);
    }

    .markdown-mode-btn.active {
        background: var(--color-surface);
        color: var(--color-highlight);
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
    }

    .markdown-mode-btn.active:hover {
        color: var(--color-highlight);
    }

    :global(:root[data-theme='dark']) .markdown-mode-btn.active {
        background: #1c1917;
        box-shadow: none;
    }

    :global(:root[data-theme='dark']) .markdown-mode-btn.active:hover {
        background: #1c1917;
    }

    /* --- Browser-like Tabs --- */
    .tab-bar {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        padding: 0 var(--spacing-1) var(--spacing-1) var(--spacing-1);
        overflow-x: auto;
        scrollbar-width: thin;
        flex: 1;
        min-width: 0;
        flex-wrap: nowrap;
        position: relative;
    }
    /* Compact the tab bar when shown inside the header */
    .editor-header .tab-bar {
        padding: 0;
    }
    .tab-add {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        margin-left: 4px;
        flex-shrink: 0;
    }
    .tab-add:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }
    .tab {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border: 1px solid var(--color-border);
        background: rgba(255,255,255,0.02);
        color: var(--color-text);
        border-radius: 10px 10px 0 0;
        font-size: 0.85rem;
        line-height: 1;
        user-select: none;
        -webkit-user-select: none;
        cursor: grab;
        touch-action: none;
    }
    .tab.is-dragging {
        opacity: 0.45;
    }
    .tab-drop-indicator {
        position: absolute;
        top: 4px;
        bottom: 4px;
        width: 2px;
        border-radius: 1px;
        background: var(--color-highlight);
        pointer-events: none;
        z-index: 5;
    }
    :global(body.tab-dragging) {
        cursor: grabbing !important;
        user-select: none !important;
    }
    :global(body.tab-dragging .tab) {
        cursor: grabbing;
    }
    .tab.active {
        background-color: var(--color-surface);
        border-bottom-color: var(--color-highlight);
        box-shadow: 0 -1px 0 var(--color-surface), 0 1px 0 var(--color-surface);
    }
    .tab.dotfile {
        opacity: 0.5;
    }
    .tab.dotfile.active {
        opacity: 0.5;
    }
    .tab-title {
        white-space: nowrap;
        max-width: 24ch;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tab-lang-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 6px;
        flex-shrink: 0;
    }
    .tab:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
        cursor: pointer;
    }

    .tab-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        line-height: 1;
        font-size: 12px;
        padding: 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.12s ease-in-out;
    }
    .tab-close:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }

    .tab-rename {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        margin-left: 4px;
        border-radius: 4px;
        border: 1px solid transparent;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        line-height: 1;
        font-size: 12px;
        padding: 0;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.12s ease-in-out;
    }
    .tab-rename:hover {
        background: rgba(255,255,255,0.06);
        color: var(--color-text);
    }

    .tab:hover .tab-rename,
    .tab:hover .tab-close,
    .tab.active .tab-rename,
    .tab.active .tab-close {
        visibility: visible;
        opacity: 1;
    }

    .tab-rename-input {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        border-radius: 4px;
        padding: 2px 4px;
        font-size: 0.85rem;
        max-width: 18ch;
    }

    .tabs-container {
        display: flex;
        gap: var(--spacing-2);
        align-items: center;
        flex: 1;
        min-width: 0;
    }


    /* Small, subtle icon button */
    .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: transparent;
        color: var(--color-text-secondary);
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .icon-button:hover {
        transform: translateY(-2px);
    }

    /* Settings dropdown (activity bar — opens to the right) */
    .settings-wrapper {
        position: relative;
        display: inline-block;
    }
    .settings-wrapper.activity-settings {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .settings-dropdown {
        position: absolute;
        top: 0;
        left: calc(100% + 4px);
        right: auto;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-2);
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        z-index: 30;
        min-width: 170px;
        display: grid;
        gap: var(--spacing-1);
    }
    .settings-dropdown label {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
    }
    .settings-dropdown select, #language-select {
        background: var(--color-bg);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 6px 8px;
        font-family: inherit;
    }

    .file-group-header {
        padding: 4px var(--spacing-2);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 8px;
    }
    .file-group:first-child .file-group-header {
        margin-top: 0;
    }

    /* Empty State */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--color-text-secondary);
        background-color: var(--color-bg);
        user-select: none;
    }
    .empty-state-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }
    .empty-shortcuts {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 540px;
    }
    .empty-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-width: 540px;
    }
    .empty-section-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0 2px;
    }
    .recent-files-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        width: 100%;
    }
    .recent-file-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        padding: 10px 12px;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.15s, border-color 0.15s;
        text-align: left;
        min-width: 0;
    }
    .recent-file-card:hover {
        background-color: rgba(255, 255, 255, 0.06);
        border-color: var(--color-text-secondary);
    }
    .recent-file-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }
    .recent-file-card-title {
        font-size: 0.88rem;
        font-weight: 500;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }
    .recent-file-card-path {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .shortcut-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
    }

    .shortcut-row:hover {
        background-color: var(--color-surface);
    }
    .shortcut-keys {
        display: flex;
        gap: 4px;
    }
    .key {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 3px;
        padding: 2px 6px;
        font-size: 0.8rem;
        min-width: 20px;
        text-align: center;
        box-shadow: 0 1px 0 var(--color-border);
        color: var(--color-text);
    }

    /* Image lightbox (full-size view) */
    .image-lightbox {
        position: fixed;
        inset: 0;
        z-index: 4000;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        cursor: zoom-out;
    }

    .image-lightbox img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: var(--border-radius-md);
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        cursor: default;
    }

    .lightbox-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        cursor: pointer;
    }

    .lightbox-close:hover {
        background: rgba(255, 255, 255, 0.25);
    }

    /* @-mention file picker (WYSIWYG) */
    .mention-popup {
        position: fixed;
        z-index: 1100;
        width: 320px;
        max-width: calc(100vw - 16px);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
        overflow: hidden;
    }

    .mention-popup-header {
        padding: 8px 12px;
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        border-bottom: 1px solid var(--color-border);
    }

    .mention-results {
        max-height: 240px;
        overflow-y: auto;
    }

    .mention-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        color: var(--color-text-secondary);
    }

    .mention-result-item.selected {
        background: var(--color-highlight);
        color: var(--color-text);
    }

    /* Search Overlay */
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 80px;
    }

    .search-modal {
        width: 600px;
        max-width: 90vw;
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .search-input {
        width: 100%;
        background: var(--color-bg);
        color: var(--color-text);
        border: none;
        outline: none;
    }

    .search-file-input {
        width: 100%;
        padding: 12px 16px;
        font-size: 1.1rem;
        background: var(--color-bg);
        color: var(--color-text);
        border: none;
        border-bottom: 1px solid var(--color-border);
        outline: none;
    }

    .search-results {
        max-height: 400px;
        overflow-y: auto;
    }

    .search-result-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        color: var(--color-text-secondary);
    }

    .search-result-item.selected {
        background: var(--color-highlight);
        color: var(--color-text);
    }

    .search-file-info {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex: 1;
        overflow: hidden;
    }

    .search-file-name {
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-file-meta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        margin-left: 12px;
    }

    .search-file-path {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
        white-space: nowrap;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 0.85;
    }

    .search-result-item.selected .search-file-path {
        color: var(--color-text);
        opacity: 0.75;
    }

    .search-file-badge {
        font-size: 0.75rem;
        padding: 2px 6px;
        background: var(--color-bg);
        border-radius: 4px;
        color: var(--color-text-secondary);
        flex-shrink: 0;
    }

    .search-no-results {
        padding: 16px;
        text-align: center;
        color: var(--color-text-secondary);
    }

    .unsaved-dot {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background-color: var(--color-highlight);
        border-radius: 50%;
        border: 1px solid var(--color-bg);
    }
</style>
