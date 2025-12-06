<script lang="ts">
    import { replaceState } from '$app/navigation';
    import { page } from '$app/stores';
    import PlaygroundExecutionPanel from '$lib/components/PlaygroundExecutionPanel.svelte';
    import ShareModal from '$lib/components/ShareModal.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import { ensureAuthenticated, initFirebase } from '$lib/firebase';
    import codeStore from '$lib/stores/codeStore.js';
    import fileStore, { type FileEntry } from '$lib/stores/fileStore.js';
    import userSettingsStorage, { type ThemeChoice } from '$lib/stores/userSettingsStorage';
    import { type ProgrammingLanguage } from '$lib/utils/util.js';
    import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
    import QRCode from 'qrcode';
    import { onMount, tick } from 'svelte';
    import { get } from 'svelte/store';
    import { v4 as uuidv4 } from 'uuid';

    const problemId = 'playground';
    let CodeEditor: any = null;
    let language: ProgrammingLanguage = $userSettingsStorage.playgroundPreferredLanguage ?? 'java';
    const fileKey = () => `${problemId}`;
    const codeKey = () => `${problemId}:${language}`;

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
        plaintext: ``
    };

    // Tabs are grouped by fileId (language-agnostic)
    type TabMeta = { fileId: string; fileName: string; isOpen: boolean; lastViewed?: number };

    function getFiles(): FileEntry[] {
        try {
            const s = get(fileStore);
            return JSON.parse(s[fileKey()] || '[]') as FileEntry[];
        } catch (err) {
            return [];
        }
    }

    function getInitialTabs(): TabMeta[] {
        const files = getFiles();
        if (!files.length) {
            // Create a default tab; the language-specific entry will be created lazily
            return [{ fileId: uuidv4(), fileName: 'Solution', isOpen: true, lastViewed: Date.now() }];
        }
        const groups = new Map<string, { fileId: string; fileName: string; order: number | null; firstIndex: number; lastViewed: number; isOpen: boolean }>();
        files.forEach((f, idx) => {
            const existing = groups.get(f.fileId);
            const orderVal = (typeof f.order === 'number') ? f.order : null;
            const lv = f.lastViewed || 0;
            const open = f.isOpen !== false;
            if (!existing) {
                groups.set(f.fileId, {
                    fileId: f.fileId,
                    fileName: f.fileName || 'Solution',
                    order: orderVal,
                    firstIndex: idx,
                    lastViewed: lv,
                    isOpen: open
                });
            } else {
                if (orderVal !== null) {
                    if (existing.order === null || orderVal < existing.order) existing.order = orderVal;
                }
                if (lv > existing.lastViewed) existing.lastViewed = lv;
                if (f.isOpen !== undefined) existing.isOpen = f.isOpen;
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
        if (files.find(x => x.language === language)) {
            code = files.find(x => x.language === language)!.content;
        }
        return list.map((g) => ({ fileId: g.fileId, fileName: g.fileName, isOpen: g.isOpen, lastViewed: g.lastViewed }));
    }

    // Ensure an entry exists for current tab+language, optionally with initial content
    function ensureEntry(fileId: string, lang: ProgrammingLanguage, initialContent: string) {
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existing = files.find((x) => x.fileId === fileId && x.language === lang);
            if (!existing) {
                const tabIndex = tabs.findIndex((t) => t.fileId === fileId);
                const tab = tabs.find((t) => t.fileId === fileId);
                files = [
                    ...files,
                    {
                        fileId,
                        fileName: tab?.fileName || 'Solution',
                        language: lang,
                        content: initialContent,
                        output: '',
                        logs: '',
                        isActive: false,
                        order: tabIndex >= 0 ? tabIndex : undefined,
                        isOpen: tab ? tab.isOpen : true
                    } as FileEntry
                ];
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    let suppressSave = false; // prevent save during programmatic loads

    async function loadOrInitFile(lang: ProgrammingLanguage) {
        if (activeTabId < 0 || activeTabId >= tabs.length) return;
        const currentId = tabs[activeTabId].fileId;
        const files = getFiles();
        const entry = files.find((x) => x.fileId === currentId && x.language === lang);
        suppressSave = true;
        if (entry) {
            code = entry.content;
            output = entry.output || '';
            logs = entry.logs || '';
        } else {
            const cStore = get(codeStore);
            const starter = cStore[codeKey()] ?? starterCode[lang] ?? '';
            code = starter;
            output = '';
            logs = '';
            ensureEntry(currentId, lang, starter);
        }
        
        const now = Date.now();        

        tabs = tabs.map(t => t.fileId === currentId ? { ...t, lastViewed: now } : t);

        await tick();
        suppressSave = false;
    }

    let code: string;
    let output: string = '';
    let logs: string = '';
    let showSettings = false;
    let settingsContainer: HTMLElement | null = null;
    const fontSizes: number[] = Array.from({ length: 13 }, (_, i) => 12 + i); // 12..24
    let fontSize: number = $userSettingsStorage.editorFontSize ?? 14;
    let theme: ThemeChoice = $userSettingsStorage.theme ?? 'light';

    let tabs: TabMeta[] = getInitialTabs();
    let activeTabId: number = (() => {
        let bestIdx = -1;
        let maxViewed = -1;
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].isOpen) {
                const lv = tabs[i].lastViewed || 0;
                if (lv > maxViewed) {
                    maxViewed = lv;
                    bestIdx = i;
                }
            }
        }
        return bestIdx !== -1 ? bestIdx : 0;
    })();
    let editingTabId: string | null = null;
    let editingName = '';
    let renameInputEl: HTMLInputElement | null = null;

    let renamingSource: 'sidebar' | 'tab' | null = null;

    function getDateLabel(timestamp?: number): string {
        if (!timestamp) return 'Older';
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Check if it is today (ignoring time)
        const isToday = date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();
                        
        if (isToday) return 'Today';
        
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() &&
                            date.getMonth() === yesterday.getMonth() &&
                            date.getFullYear() === yesterday.getFullYear();
                            
        if (isYesterday) return 'Yesterday';
        
        if (diffDays <= 7) return 'Previous 7 days';
        if (diffDays <= 30) return 'Previous 30 days';
        
        return 'Older';
    }

    $: groupedTabs = (() => {
        const groups: Record<string, TabMeta[]> = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 days': [],
            'Previous 30 days': [],
            'Older': []
        };
        
        tabs.forEach(t => {
            const label = getDateLabel(t.lastViewed);
            if (!groups[label]) groups[label] = [];
            groups[label].push(t);
        });
        
        return groups;
    })();
    
    const groupOrder = ['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older'];

    function startRename(fileId: string, currentName: string, source: 'sidebar' | 'tab') {
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
        const oldName = tabs.find(t => t.fileId === targetId)?.fileName || 'Solution';
        const finalName = newName || oldName;
        // Update tabs
        tabs = tabs.map(t => t.fileId === targetId ? { ...t, fileName: finalName } : t);
        // Update all store entries for this fileId
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                if (f.fileId === targetId) f.fileName = finalName;
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
    async function addNewTab(source: 'sidebar' | 'tab' = 'tab') {
        const newTabName = `Solution-${tabs.length + 1}`;
        const nextId = uuidv4();
        const fileName = newTabName;
        tabs = [...tabs, { fileId: nextId, fileName, isOpen: true }];
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
                    content: newCode,
                    output: '',
                    logs: '',
                    isActive: false,
                    order: tabs.length - 1,
                    isOpen: true
                } as FileEntry
            ];
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        activeTabId = tabs.length - 1;
        await loadOrInitFile(language);
        persistTabOrder();
        startRename(nextId, fileName, source);
    }

    function persistTabOrder() {
        const fkey = fileKey();
        const orderById = new Map<string, number>();
        tabs.forEach((t, idx) => orderById.set(t.fileId, idx));
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            for (const f of files) {
                const idx = orderById.get(f.fileId);
                if (idx !== undefined) f.order = idx;
            }
            return { ...s, [fkey]: JSON.stringify(files) };
        });
    }

    function moveTab(sourceId: string, targetId: string) {
        if (sourceId === targetId) return;
        const from = tabs.findIndex((t) => t.fileId === sourceId);
        const to = tabs.findIndex((t) => t.fileId === targetId);
        if (from < 0 || to < 0) return;
        const activeFileId = tabs[activeTabId]?.fileId;
        const updated = [...tabs];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        tabs = updated;
        // Recompute activeTabId by locating current active fileId
        if (activeFileId) {
            const newIdx = tabs.findIndex((t) => t.fileId === activeFileId);
            if (newIdx !== -1) activeTabId = newIdx;
        }
        persistTabOrder();
    }

    let draggingId: string | null = null;
    function handleDragStart(e: DragEvent, fileId: string) {
        draggingId = fileId;
        try { e.dataTransfer?.setData('text/plain', fileId); } catch {}
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    }
    function handleDragOver(e: DragEvent, _fileId: string) {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    }
    function handleDrop(e: DragEvent, targetId: string) {
        e.preventDefault();
        const source = draggingId || e.dataTransfer?.getData('text/plain') || '';
        if (source) moveTab(source, targetId);
        draggingId = null;
    }
    function handleDragEnd() {
        draggingId = null;
    }
    $: if (!suppressSave && (code !== undefined || output !== undefined || logs !== undefined)) {
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            if (activeTabId < 0 || activeTabId >= tabs.length) return s;
            const existingFile = files.find(x => 
                x.fileId === tabs[activeTabId].fileId &&
                x.language === language
            );
            if (existingFile) {
                existingFile.content = code;
                existingFile.output = output;
                existingFile.logs = logs;
            } else {
                files = [...files, {
                    fileId: tabs[activeTabId].fileId,
                    fileName: tabs[activeTabId].fileName,
                    language: language,
                    content: code,
                    output: output,
                    logs: logs,
                    isActive: false,
                    isOpen: tabs[activeTabId].isOpen
                } as FileEntry];
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
    }

    $: if (language) {
        loadOrInitFile(language);
    }

    function closeTab(fileId: string) {
        // Just hide from tab bar
        tabs = tabs.map(t => t.fileId === fileId ? { ...t, isOpen: false } : t);
        
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.map(f => f.fileId === fileId ? { ...f, isOpen: false } : f);
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        
        // If we closed the active tab, switch to another open one if possible
        // But for now, let's just keep the content visible or switch to the nearest open tab?
        // VS Code behavior: switch to next open tab.
        const currentTab = tabs[activeTabId];
        if (currentTab.fileId === fileId) {
            // Find another open tab
            // Try next one
            let nextOpenIdx = -1;
            for (let i = activeTabId + 1; i < tabs.length; i++) {
                if (tabs[i].isOpen) {
                    nextOpenIdx = i;
                    break;
                }
            }
            // If not found, try previous one
            if (nextOpenIdx === -1) {
                for (let i = activeTabId - 1; i >= 0; i--) {
                    if (tabs[i].isOpen) {
                        nextOpenIdx = i;
                        break;
                    }
                }
            }
            
            if (nextOpenIdx !== -1) {
                activeTabId = nextOpenIdx;
                loadOrInitFile(language);
            }
        }
    }

    function deleteFile(fileId: string) {
        if (tabs.length <= 1) return;
        if (!confirm("Are you sure you want to remove this file? This action cannot be undone")) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        if (activeTabId === idx) {
            // Find another file to activate (doesn't have to be open, but preferably)
            const nextFile = tabs.find((x, i) => i !== idx); // Just pick any other
            if (nextFile) {
                activateTab(nextFile.fileId);
            }
        }
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            files = files.filter((f) => f.fileId !== fileId);
            return { ...s, [fkey]: JSON.stringify(files) };
        });
        // Update tabs list
        const newTabs = tabs.filter((t) => t.fileId !== fileId);
        tabs = newTabs;
        // Re-number orders after removal
        persistTabOrder();
        
        let newActiveId = tabs[activeTabId].fileId;
        const newIdx = newTabs.findIndex(t => t.fileId === newActiveId);
        if (newIdx !== -1) activeTabId = newIdx;
    }

    onMount(async () => {
        const module = await import('$lib/components/CodeEditor.svelte');
        CodeEditor = module.default;
    });

    onMount(() => {
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                showSettings = false;
            }
        };
        document.addEventListener('click', handleDocClick);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('click', handleDocClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    async function activateTab(fileId?: string) {
        if (!fileId) return;
        const idx = tabs.findIndex((t) => t.fileId === fileId);
        if (idx === -1) return;
        
        // Ensure tab is open
        if (!tabs[idx].isOpen) {
            tabs = tabs.map((t, i) => i === idx ? { ...t, isOpen: true } : t);
            const fkey = fileKey();
            fileStore.update((s) => {
                let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                files = files.map(f => f.fileId === fileId ? { ...f, isOpen: true } : f);
                return { ...s, [fkey]: JSON.stringify(files) };
            });
        }

        activeTabId = idx;
        await loadOrInitFile(language);
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
    function handleResetClick() {
        const confirmed = confirm('Are you sure you want to reset the code for this file? This action cannot be undone.');
        if (!confirmed) return;
        const fkey = fileKey();
        fileStore.update((s) => {
            const files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const existingFile = files.find(x => x.fileId === tabs[activeTabId].fileId && x.language === language); 
            if (existingFile) {
                existingFile.content = starterCode[language] ?? '';
            }
            return {...s, [fkey]: JSON.stringify(files)};
        });
        code = starterCode[language] ?? '';
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

    onMount(async () => {
        const fb = initFirebase();
        if (fb) {
            isFirebaseAvailable = true;
        }

        const forkData = ($page.state as any).forkData as { content: string; language: ProgrammingLanguage; fileName: string } | undefined;
        
        if (forkData) {
            const { content, language: lang, fileName } = forkData;
            
            // Add as new tab
            const newTabName = fileName ? `Fork of ${fileName}` : `Forked Solution`;
            const nextId = uuidv4();
            
            // Update tabs
            tabs = [...tabs, { fileId: nextId, fileName: newTabName, isOpen: true }];
            
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
                        content: content,
                        output: '',
                        logs: '',
                        isActive: false,
                        order: tabs.length - 1,
                        isOpen: true
                    } as FileEntry
                ];
                return { ...s, [fkey]: JSON.stringify(files) };
            });
            
            // Switch to new tab
            activeTabId = tabs.length - 1;
            language = lang; 
            userSettingsStorage.update(s => ({ ...s, playgroundPreferredLanguage: language }));
            
            await tick();
            await loadOrInitFile(language);
            persistTabOrder();
            
            // Clear state to prevent re-forking on reload
            replaceState($page.url, {});
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
                        
            // Update tabs
            tabs = [...tabs, { fileId: nextId, fileName: newTabName, isOpen: true }];                        // Update file store
                        const fkey = fileKey();
                        fileStore.update((s) => {
                            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                            files = [
                                ...files,
                                {
                                    fileId: nextId,
                                    fileName: newTabName,
                                    language: data.language,
                                    content: data.content,
                                    output: '',
                                    logs: '',
                                    isActive: false,
                                    order: tabs.length - 1,
                                    isOpen: true
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
                    alert('Shared solution not found.');
                }
            } catch (e) {
                console.error('Error loading shared solution:', e);
                alert('Error loading shared solution.');
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
        
        const { db, auth } = initFirebase() || {};
        if (!db || !auth) return null;

        try {
            const user = await ensureAuthenticated();
            if (!user) throw new Error('Authentication failed');

            const currentTab = tabs[activeTabId];
            const files = getFiles();
            const currentFile = files.find(f => f.fileId === currentTab.fileId && f.language === language);
            const content = currentFile ? currentFile.content : (starterCode[language] ?? '');
            const fileOutput = currentFile ? (currentFile.output || '') : '';
            const fileLogs = currentFile ? (currentFile.logs || '') : '';
            
            let shareId = currentFile?.shareId;
            
            if (shareId) {
                // Try to update existing
                try {
                    await updateDoc(doc(db, 'shares', shareId), {
                        content,
                        language,
                        fileName: currentTab.fileName,
                        output: fileOutput,
                        logs: fileLogs,
                        updatedAt: new Date().toISOString(),
                        ownerId: user.uid
                    });
                    if (!silent) alert('Saved successfully!');
                    return shareId;
                } catch (e: any) {
                    if (e.code === 'permission-denied') {
                        if (silent || confirm('You do not have permission to update this shared code. Create a new copy?')) {
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
                    language,
                    fileName: currentTab.fileName,
                    output: fileOutput,
                    logs: fileLogs,
                    createdAt: new Date().toISOString(),
                    ownerId: user.uid
                });
                
                // Update local file with shareId
                const fkey = fileKey();
                fileStore.update((s) => {
                    let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
                    const idx = files.findIndex(f => f.fileId === currentTab.fileId && f.language === language);
                    if (idx >= 0) {
                        files[idx].shareId = shareId;
                    }
                    return { ...s, [fkey]: JSON.stringify(files) };
                });
                
                if (!silent) alert(`Saved! Share ID: ${shareId}`);
                return shareId;
            }
        } catch (e) {
            console.error('Error saving:', e);
            if (!silent) alert('Failed to save.');
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
        const currentTab = tabs[activeTabId];
        const fkey = fileKey();
        fileStore.update((s) => {
            let files = JSON.parse(s[fkey] || '[]') as FileEntry[];
            const idx = files.findIndex(f => f.fileId === currentTab.fileId && f.language === language);
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
    let selectedIndex = 0;
    
    $: filteredFiles = searchQuery 
        ? tabs.filter(t => t.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
        : tabs.slice().sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0));

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

    let isSidebarOpen = $userSettingsStorage.isSidebarOpen ?? true;
    $: {
        const currentSidebarState = $userSettingsStorage.isSidebarOpen;
        if (currentSidebarState !== isSidebarOpen) {
             userSettingsStorage.update(s => ({ ...s, isSidebarOpen }));
        }
    }
    $: hasOpenTabs = tabs.some(t => t.isOpen);
    $: activeTabName = tabs[activeTabId]?.fileName;
    $: pageTitle = activeTabName ? `${activeTabName} - Playground - Cojudge` : 'Playground - Cojudge';
    let isMac = false;

    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const handleDocClick = (e: MouseEvent) => {
            if (showSettings && settingsContainer && !settingsContainer.contains(e.target as Node)) {
                showSettings = false;
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                showSettings = false;
                closeSearch();
            }
            // Cmd+P or Ctrl+P
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                if (showSearch) closeSearch(); else openSearch();
            }
            // Ctrl+Shift+E or Cmd+Shift+E
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                isSidebarOpen = !isSidebarOpen;
            }
            // Ctrl+B or Cmd+B
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                isSidebarOpen = !isSidebarOpen;
            }
        };
        document.addEventListener('click', handleDocClick);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('click', handleDocClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<div class="workspace">
    <!-- Activity Bar -->
    <div class="activity-bar">
        <a href="/" class="activity-icon" title="Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
        <button 
            class="activity-icon {isSidebarOpen ? 'active' : ''}" 
            on:click={() => isSidebarOpen = !isSidebarOpen}
            title="Explorer"
        >
            <!-- Explorer Icon (Files) -->
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 2v7h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>

    <!-- Left Sidebar -->
    {#if isSidebarOpen}
    <div class="sidebar">
        <div class="sidebar-header">
            <span>EXPLORER</span>
            <button class="icon-button" on:click={() => addNewTab('sidebar')} title="New File">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="file-list">
            {#each groupOrder as group}
                {#if groupedTabs[group] && groupedTabs[group].length > 0}
                    <div class="file-group">
                        <div class="file-group-header">{group}</div>
                        {#each groupedTabs[group] as t}
                            <div
                                class="file-item {hasOpenTabs && t.fileId === tabs[activeTabId].fileId ? 'active' : ''}"
                                on:click={() => activateTab(t.fileId)}
                                draggable={true}
                                on:dragstart={(e) => handleDragStart(e, t.fileId)}
                                on:dragover={(e) => handleDragOver(e, t.fileId)}
                                on:drop={(e) => handleDrop(e, t.fileId)}
                                on:dragend={handleDragEnd}
                                on:contextmenu|preventDefault={(e) => { /* maybe context menu later */ }}
                                role="button"
                                tabindex="0"
                                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(t.fileId); } }}
                            >
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
                                    <span class="file-name">{t.fileName}</span>
                                {/if}
                                
                                <div class="file-actions">
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
                                    {#if tabs.length > 1}
                                        <button
                                            class="file-action-btn"
                                            title="Delete"
                                            on:click|stopPropagation={() => deleteFile(t.fileId)}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            {/each}
        </div>
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
                            class="tab {t.fileId === tabs[activeTabId].fileId ? 'active' : ''}"
                            role="tab"
                            aria-selected={t.fileId === tabs[activeTabId].fileId}
                            tabindex={t.fileId === tabs[activeTabId].fileId ? 0 : -1}
                            on:click={() => activateTab(t.fileId)}
                            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(t.fileId); } }}
                            draggable={true}
                            on:dragstart={(e) => handleDragStart(e, t.fileId)}
                            on:dragover={(e) => handleDragOver(e, t.fileId)}
                            on:drop={(e) => handleDrop(e, t.fileId)}
                            on:dragend={handleDragEnd}
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
                                <span class="tab-title">{t.fileName}</span>
                            {/if}
                            
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

                            {#if tabs.length > 1}
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
                    <button class="tab-add" aria-label="New tab" title="New tab" on:click={() => addNewTab('tab')}>+</button>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-2);">
                <div style="display:flex;align-items:center;gap:var(--spacing-1);">
                    <label for="language-select" style="font-size:0.9rem;color:var(--color-text-secondary);margin-right:4px;">Language</label>
                    <select
                        id="language-select"
                        bind:value={language}
                        on:focus={() => (suppressSave = true)}
                        on:mousedown={() => (suppressSave = true)}
                        on:keydown={() => (suppressSave = true)}
                        on:change={() => {
                            // Persist preference; actual loading will be triggered by reactive `$: if (language)`
                            userSettingsStorage.update((s) => ({ ...s, playgroundPreferredLanguage: language }));
                        }}
                        on:blur={() => (suppressSave = false)}
                    >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="plaintext">Plaintext</option>
                    </select>
                </div>
                {#if isFirebaseAvailable}
                    <Tooltip text={"Share"} pos={"bottom"}>
                        <button
                            class="icon-button"
                            title="Share"
                            aria-label="Share"
                            on:click={handleShare}
                        >
                            <!-- Share icon -->
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 6l-4-4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 2v13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </Tooltip>
                {/if}
                <Tooltip text={"Reset Code"} pos={"bottom"}>
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
                <div class="settings-wrapper" bind:this={settingsContainer}>
                    <Tooltip text={"Settings"} pos={"bottom"}>
                        <button
                            class="icon-button"
                            title="Editor Settings"
                            aria-label="Editor Settings"
                            on:click={() => (showSettings = !showSettings)}
                        >
                            <!-- Cog icon -->
                            <svg width="16px" height="16px" viewBox="0 0 32 32" id="Lager_100" data-name="Lager 100" xmlns="http://www.w3.org/2000/svg">
                                <path id="Path_78" data-name="Path 78" d="M30.329,13.721l-2.65-.441a11.922,11.922,0,0,0-1.524-3.653l1.476-2.066a1.983,1.983,0,0,0-.211-2.553l-.428-.428a1.983,1.983,0,0,0-2.553-.211L22.373,5.845A11.922,11.922,0,0,0,18.72,4.321l-.441-2.65A2,2,0,0,0,16.306,0h-.612a2,2,0,0,0-1.973,1.671l-.441,2.65A11.922,11.922,0,0,0,9.627,5.845L7.561,4.369a1.983,1.983,0,0,0-2.553.211l-.428.428a1.983,1.983,0,0,0-.211,2.553L5.845,9.627A11.922,11.922,0,0,0,4.321,13.28l-2.65.441A2,2,0,0,0,0,15.694v.612a2,2,0,0,0,1.671,1.973l2.65.441a11.922,11.922,0,0,0,1.524,3.653L4.369,24.439a1.983,1.983,0,0,0,.211,2.553l.428.428a1.983,1.983,0,0,0,2.553.211l2.066-1.476a11.922,11.922,0,0,0,3.653,1.524l.441,2.65A2,2,0,0,0,15.694,32h.612a2,2,0,0,0,1.973-1.671l.441-2.65a11.922,11.922,0,0,0,3.653-1.524l2.066,1.476a1.983,1.983,0,0,0,2.553-.211l.428-.428a1.983,1.983,0,0,0,.211-2.553l-1.476-2.066a11.922,11.922,0,0,0,1.524-3.653l2.65-.441A2,2,0,0,0,32,16.306v-.612A2,2,0,0,0,30.329,13.721ZM16,22a6,6,0,1,1,6-6A6,6,0,0,1,16,22Z" 
                                    fill="currentColor"/>
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
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="editor-container">
            {#if CodeEditor}
                <svelte:component this={CodeEditor} bind:value={code} {language} {fontSize} {theme} />
            {:else}
                Loading...
            {/if}
        </div>
        {#if language !== 'plaintext'}
            <PlaygroundExecutionPanel {code} {language} {isMac} bind:output bind:logs />
        {/if}
        {:else}
        <div class="empty-state">
            <div class="empty-state-content">
                <div class="empty-shortcuts">
                    <div class="shortcut-row">
                        <span class="shortcut-label">Quick Open</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">P</span></span>
                    </div>
                    <div class="shortcut-row">
                        <span class="shortcut-label">Toggle Explorer</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">SHIFT</span><span class="key">E</span></span>
                    </div>
                    <div class="shortcut-row">
                        <span class="shortcut-label">Toggle Sidebar</span>
                        <span class="shortcut-keys"><span class="key">{isMac ? 'CMD' : 'CONTROL'}</span><span class="key">B</span></span>
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
            on:close={() => showShareModal = false} 
            on:generateNew={handleGenerateNewLink}
        />
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
                    class="search-input"
                    on:keydown={(e) => {
                        if (e.key === 'Escape') closeSearch();
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            selectedIndex = (selectedIndex + 1) % filteredFiles.length;
                        }
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            selectedIndex = (selectedIndex - 1 + filteredFiles.length) % filteredFiles.length;
                        }
                        if (e.key === 'Enter' && filteredFiles.length > 0) {
                            activateTab(filteredFiles[selectedIndex].fileId);
                            closeSearch();
                        }
                    }}
                />
                <div class="search-results">
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
                            <span class="search-file-name">{file.fileName}</span>
                            {#if file.isOpen}
                                <span class="search-file-badge">Open</span>
                            {/if}
                        </div>
                    {/each}
                    {#if filteredFiles.length === 0}
                        <div class="search-no-results">No matching files</div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

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

    .file-list {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-1) 0;
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
    }

    .file-item:hover {
        background-color: var(--color-second-bg);
        color: var(--color-text);
    }

    .file-item.active {
        background-color: var(--color-third-bg);
        color: var(--color-text);
    }

    .file-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
    }

    .file-actions {
        display: none;
        align-items: center;
        gap: 4px;
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
    }

    /* Right Pane Layout */
    .editor-pane {
        padding: 0; /* No padding on the pane itself */
    }

    .editor-container {
        flex-grow: 1;
        min-height: 0;
        padding: var(--spacing-1); /* Padding around the editor */
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
    }
    .tab.active {
        background-color: var(--color-surface);
        border-bottom-color: var(--color-highlight);
        box-shadow: 0 -1px 0 var(--color-surface), 0 1px 0 var(--color-surface);
    }
    .tab-title {
        white-space: nowrap;
        max-width: 24ch;
        overflow: hidden;
        text-overflow: ellipsis;
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

    /* Settings dropdown */
    .settings-wrapper {
        position: relative;
        display: inline-block;
    }
    .settings-dropdown {
        position: absolute;
        top: 36px;
        right: 0;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-2);
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        z-index: 20;
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
        min-width: 300px;
    }
    .shortcut-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
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

    .search-result-item:hover, .search-result-item.selected {
        background: var(--color-highlight);
        color: var(--color-text);
    }

    .search-file-name {
        font-size: 0.95rem;
    }

    .search-file-badge {
        font-size: 0.75rem;
        padding: 2px 6px;
        background: var(--color-bg);
        border-radius: 4px;
        color: var(--color-text-secondary);
    }

    .search-no-results {
        padding: 16px;
        text-align: center;
        color: var(--color-text-secondary);
    }
</style>
