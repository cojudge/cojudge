<script lang="ts">
    import { execPaneHeightStore } from '$lib/stores/layoutStore';
    import type { ProgrammingLanguage } from '$lib/utils/util';
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';

    export let code: string;
    export let language: ProgrammingLanguage = 'java';

    let isLoading = false;
    let isResizing = false;
    let panelElement: HTMLElement;
    let output: string = '';
    let logs: string = '';
    let error: string | null = null;
    let hasRunOnce = false;
    let runningMessage = '';

    // Docker image status for the selected language
    let imageStatus: 'unknown' | 'present' | 'absent' = 'unknown';
    let isPullingImage = false;
    let imageName: string = '';

    let lastNonMinHeight = 35; // percent
    let minExecPanelHeight = 15;

    $: if ($execPaneHeightStore > minExecPanelHeight) {
        lastNonMinHeight = $execPaneHeightStore;
    }

    function togglePanelVisibility() {
        if ($execPaneHeightStore > minExecPanelHeight) {
            lastNonMinHeight = $execPaneHeightStore || lastNonMinHeight || 35;
            $execPaneHeightStore = minExecPanelHeight;
        } else {
            const restore = Math.max(12, Math.min(90, lastNonMinHeight || 35));
            $execPaneHeightStore = restore;
        }
    }

    function handleMouseDown(event: MouseEvent) {
        isResizing = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing || !panelElement?.parentElement) return;
        const parentRect = panelElement.parentElement.getBoundingClientRect();
        const newHeight = parentRect.bottom - event.clientY;
        const newPercentage = (newHeight / parentRect.height) * 100;
        const constrainedPercentage = Math.max(12, Math.min(90, newPercentage));
        $execPaneHeightStore = constrainedPercentage;
    }

    function handleMouseUp() {
        isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }

    function handleResizerKeydown(e: KeyboardEvent) {
        if (!panelElement?.parentElement) return;
        const step = 2;
        let next = $execPaneHeightStore;
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            next = Math.min(90, next + (e.key === 'PageUp' ? step * 3 : step));
            e.preventDefault();
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            next = Math.max(12, next - (e.key === 'PageDown' ? step * 3 : step));
            e.preventDefault();
        }
        $execPaneHeightStore = next;
    }

    async function refreshImageStatus() {
        try {
            const res = await fetch(`/api/image/status?language=${encodeURIComponent(language)}`);
            if (!res.ok) throw new Error('status request failed');
            const body = await res.json();
            imageStatus = body.present ? 'present' : 'absent';
            imageName = body.image || '';
        } catch {
            imageStatus = 'unknown';
        }
    }

    async function pullRuntimeImage() {
        if (isPullingImage) return;
        isPullingImage = true;
        try {
            const res = await fetch('/api/image/pull', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language })
            });
            await res.json().catch(() => ({}));
            await refreshImageStatus();
        } catch (e) {
        } finally {
            isPullingImage = false;
        }
    }

    let lastLanguageChecked: string | null = null;
    onMount(refreshImageStatus);
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = 'unknown';
        refreshImageStatus();
    }

    function delay(ms: number) { return new Promise((res) => setTimeout(res, ms)); }

    async function handleRun() {
        isLoading = true;
        runningMessage = 'Running...';
        output = '';
        logs = '';
        error = null;
        hasRunOnce = true;

        try {
            if (imageStatus === 'absent' || imageStatus === 'unknown') {
                await refreshImageStatus();
                if (imageStatus === 'absent' || imageStatus === 'unknown') {
                    runningMessage = `Downloading ${imageName || 'runtime image'}...`;
                    await pullRuntimeImage();
                    runningMessage = 'Running...';
                }
            }

            const startRes = await fetch('/api/playground/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code })
            });
            const startBody = await startRes.json();
            if (!startRes.ok || !startBody?.jobId) {
                error = startBody?.error || 'Failed to start run job';
                runningMessage = 'Failed';
                return;
            }

            const jobId = startBody.jobId as string;
            while (true) {
                const pollRes = await fetch(`/api/playground/run?jobId=${encodeURIComponent(jobId)}`);
                const body = await pollRes.json();
                if (!pollRes.ok) {
                    error = body?.error || 'Run job failed';
                    runningMessage = 'Failed';
                    break;
                }
                if (!body?.ready) {
                    if (body?.status) runningMessage = body.status;
                    await delay(600);
                    continue;
                }
                
                runningMessage = '';
                if (body?.timeout) {
                    error = 'Time Limit Exceeded';
                } else if (body?.error) {
                    error = body.error;
                } else {
                    output = body.output || '';
                    logs = body.logs || '';
                }
                break;
            }
        } catch (err: any) {
            console.error(err);
            error = err.message || 'Failed';
            runningMessage = 'Failed';
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "'") {
                e.preventDefault();
                if (!isLoading) handleRun();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
                e.preventDefault();
                togglePanelVisibility();
            }
        };
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    });
</script>

<div 
    class="panel"
    bind:this={panelElement}
    style="height: {$execPaneHeightStore}%;"
>
    <button class="resizer" type="button" aria-label="Resize execution panel" on:mousedown={handleMouseDown} on:keydown={handleResizerKeydown}></button>
    <div class="tabs" class:hide={$execPaneHeightStore <= 15}>
        <button class="tab active">Output</button>
    </div>

    <div class="content" class:hide={$execPaneHeightStore <= minExecPanelHeight}>
        {#if hasRunOnce}
            <div class="output-view">
                {#if error}
                    <div class="result-item">
                        <span class="result-status error">Error</span>
                        <pre class="result-output error">{error}</pre>
                    </div>
                {/if}
                {#if output}
                    <div class="result-item">
                        <pre class="result-output">{output}</pre>
                    </div>
                {/if}
                {#if logs}
                    <div class="result-item">
                        <span class="result-title">Console</span>
                        <pre class="result-output">{logs}</pre>
                    </div>
                {/if}
                {#if !error && !output && !logs && !isLoading}
                    <div class="result-item">
                        <span class="result-title">No output</span>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="placeholder">Run your code to see output here.</div>
        {/if}
    </div>

    <div class="actions">
        <div class="buttons">
            <Tooltip text={'Ctrl + J'}>
                <button
                    class="icon-btn"
                    aria-label={$execPaneHeightStore > minExecPanelHeight ? 'Hide panel' : 'Show panel'}
                    on:click={togglePanelVisibility}
                >
                    {#if $execPaneHeightStore > minExecPanelHeight}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    {:else}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="M3 3l18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    {/if}
                </button>
            </Tooltip>
            <Tooltip text={
                isPullingImage
                    ? 'Downloading runtime...'
                    : imageStatus === 'present'
                        ? `Local runtime ready${imageName ? ` (${imageName})` : ''}`
                        : `Download runtime ${imageName ? ` (${imageName})` : ''}`
            }>
                <button
                    class="icon-btn"
                    aria-label="Runtime image status"
                    disabled={isPullingImage}
                    class:non-button-hover={imageStatus === 'present'}
                    on:click={() => {
                        if (imageStatus === 'absent' || imageStatus === 'unknown') pullRuntimeImage();
                    }}
                >
                    {#if isPullingImage}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spin">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="4" />
                            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                        </svg>
                    {:else if imageStatus === 'present'}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="currentColor" fill-opacity="0.12" />
                            <path d="M9 12.5l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    {:else}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v10m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 17h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z" fill="currentColor" fill-opacity="0.12"/>
                        </svg>
                    {/if}
                </button>
            </Tooltip>
            <span class="status">
                {runningMessage}
            </span>
            <div style="margin-right: 20px">
              <Tooltip text={"Ctrl + '"}>
                  <button
                      class="btn btn-secondary"
                      on:click={handleRun}
                      disabled={isLoading}
                  >
                      Run
                  </button>
              </Tooltip>
            </div>
        </div>
    </div>
</div>

<style>
/* Main Panel */
.panel {
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    border-top: 1px solid var(--color-border);
}

/* Tabs */
.tabs {
    display: flex;
    padding: 0 var(--spacing-3);
    border-bottom: 1px solid var(--color-border);
}
.tab {
    padding: var(--spacing-2) var(--spacing-3);
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
}
.tab.active {
    color: var(--color-text-primary);
    border-bottom-color: var(--color-text-primary);
}

/* Content Area */
.content {
    padding: var(--spacing-3);
    min-height: 150px;
    flex-grow: 1;
    overflow-y: auto;
}
.hide {
    display: none;
}

/* Output View */
.output-view { display: flex; flex-direction: column; gap: var(--spacing-2); }
.result-item { font-family: var(--font-mono); }
.result-title { font-weight: bold; margin-right: var(--spacing-2); }
.result-status { font-weight: bold; }
.result-status.error { color: var(--color-incorrect); }
.result-output { margin-top: var(--spacing-1); background-color: var(--color-bg); padding: var(--spacing-2); border-radius: var(--border-radius); }
.result-output.error { color: var(--color-incorrect); }

.placeholder {
    color: var(--color-text-secondary);
    font-style: italic;
}

/* Actions Footer */

.buttons { display: flex; gap: var(--spacing-2); }
.actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--spacing-2) var(--spacing-3);
    border-top: 1px solid var(--color-border);
}

.icon-btn {
    display: inline-flex;
    align-items:last baseline;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.icon-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Button Styles */
.btn {
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-2) var(--spacing-4);
    border: none;
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-left: var(--spacing-2);
}
.btn:hover {
    transform: translateY(-2px);
}
.btn:active {
    transform: translateY(-1px);
}
.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}
.btn-secondary {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
}
.resizer {
    cursor: row-resize;
    height: 3px;
    opacity: 0;
    width: 100%;
    z-index: 10;
    position: fixed;
}
.status {
    margin-top: 5px;
    text-transform: capitalize;
}
.non-button-hover {
    cursor: default;
}
</style>
