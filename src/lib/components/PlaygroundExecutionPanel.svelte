<script lang="ts">
    import { execPaneHeightStore } from "$lib/stores/layoutStore";
    import type { ProgrammingLanguage } from "$lib/utils/util";
    import { onMount, onDestroy } from "svelte";
    import Tooltip from "./Tooltip.svelte";
    import SaveStatus from "./SaveStatus.svelte";

    export let code: string;
    export let language: ProgrammingLanguage = "java";
    export let output: string = "";
    export let logs: string = "";
    export let isMac: boolean;
    export let readOnly: boolean = false;
    export let debugBreakpoints: number[] = [];
    export let activeDebugLine: number | null = null;

    let isLoading = false;
    let isResizing = false;
    let panelElement: HTMLElement;
    let error: string | null = null;
    let hasRunOnce = readOnly;
    let runningMessage = "";

    let debugJobId: string | null = null;
    let debugState: any = null;
    let isDebugRunning = false;
    let debugPollInterval: any = null;
    let lastSyncedBreakpoints: string = '[]';

    $: activeDebugLine = (debugState && debugState.status === 'paused') ? debugState.line : null;

    $: if (debugJobId && debugBreakpoints && JSON.stringify(debugBreakpoints) !== lastSyncedBreakpoints) {
        lastSyncedBreakpoints = JSON.stringify(debugBreakpoints);
        fetch("/api/debug", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: debugJobId, action: "setBreakpoints", breakpoints: debugBreakpoints }),
        }).catch(() => {});
    }

    // Docker image status for the selected language
    let imageStatus: "unknown" | "present" | "absent" = "unknown";
    let isDockerRunning = true;
    let isCheckingDocker = false;
    let isPullingImage = false;
    let pullProgress = 0;
    let pullStatusMessage = "";
    let imageName: string = "";

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
        document.body.style.userSelect = "none";
        document.body.style.cursor = "row-resize";
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
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
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    function handleResizerKeydown(e: KeyboardEvent) {
        if (!panelElement?.parentElement) return;
        const step = 2;
        let next = $execPaneHeightStore;
        if (e.key === "ArrowUp" || e.key === "PageUp") {
            next = Math.min(90, next + (e.key === "PageUp" ? step * 3 : step));
            e.preventDefault();
        } else if (e.key === "ArrowDown" || e.key === "PageDown") {
            next = Math.max(
                12,
                next - (e.key === "PageDown" ? step * 3 : step),
            );
            e.preventDefault();
        }
        $execPaneHeightStore = next;
    }

    async function refreshImageStatus() {
        if (isCheckingDocker) return;
        isCheckingDocker = true;
        const startTime = Date.now();
        try {
            const res = await fetch(
                `/api/image/status?language=${encodeURIComponent(language)}`,
            );
            if (!res.ok) throw new Error("status request failed");
            const body = await res.json();
            isDockerRunning = body.docker !== false;
            imageStatus = body.present ? "present" : "absent";
            imageName = body.image || "";

            if (body.pulling) {
                isPullingImage = true;
                pullProgress = body.progress || 0;
                pullStatusMessage = body.status || "";
                startPollingProgress();
            } else if (isPullingImage) {
                isPullingImage = false;
                pullProgress = 0;
                pullStatusMessage = "";
            }
        } catch {
            imageStatus = "unknown";
            isDockerRunning = true;
        } finally {
            const elapsed = Date.now() - startTime;
            if (elapsed < 500) {
                await new Promise((r) => setTimeout(r, 500 - elapsed));
            }
            isCheckingDocker = false;
        }
    }

    let pollInterval: any = null;
    function startPollingProgress() {
        if (pollInterval) return;
        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(
                    `/api/image/status?language=${encodeURIComponent(language)}`,
                );
                const body = await res.json();
                if (body.pulling) {
                    pullProgress = body.progress || 0;
                    pullStatusMessage = body.status || "";
                } else {
                    stopPollingProgress();
                    imageStatus = body.present ? "present" : "absent";
                    isPullingImage = false;
                }
            } catch {
                stopPollingProgress();
                isPullingImage = false;
            }
        }, 1000);
    }

    function stopPollingProgress() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    function pullRuntimeImage(): Promise<void> {
        if (isPullingImage) {
            return new Promise((resolve) => {
                const check = setInterval(() => {
                    if (!isPullingImage) {
                        clearInterval(check);
                        resolve();
                    }
                }, 500);
            });
        }
        isPullingImage = true;
        pullProgress = 0;
        return new Promise(async (resolve, reject) => {
            try {
                await fetch("/api/image/pull", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ language }),
                });
                startPollingProgress();
                const check = setInterval(() => {
                    if (!isPullingImage) {
                        clearInterval(check);
                        resolve();
                    }
                }, 500);
            } catch (e) {
                isPullingImage = false;
                reject(e);
            }
        });
    }

    async function cancelPullImage() {
        try {
            await fetch("/api/image/pull", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language }),
            });
            stopPollingProgress();
            isPullingImage = false;
            pullProgress = 0;
            await refreshImageStatus();
        } catch (e) {
            console.error("Failed to cancel pull", e);
        }
    }

    let lastLanguageChecked: string | null = null;
    onMount(refreshImageStatus);
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = "unknown";
        refreshImageStatus();
    }

    function delay(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }

    async function handleRun() {
        if (debugJobId) stopDebugging();
        debugState = null;

        isLoading = true;
        runningMessage = "Running...";
        output = "";
        logs = "";
        error = null;
        hasRunOnce = true;

        try {
            if (imageStatus === "absent" || imageStatus === "unknown") {
                await refreshImageStatus();
                if (imageStatus === "absent" || imageStatus === "unknown") {
                    await pullRuntimeImage();
                }
            }

            const startRes = await fetch("/api/playground/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code }),
            });
            const startBody = await startRes.json();
            if (!startRes.ok || !startBody?.jobId) {
                error = startBody?.error || "Failed to start run job";
                runningMessage = "Failed";
                return;
            }

            const jobId = startBody.jobId as string;
            while (true) {
                const pollRes = await fetch(
                    `/api/playground/run?jobId=${encodeURIComponent(jobId)}`,
                );
                const body = await pollRes.json();
                if (!pollRes.ok) {
                    error = body?.error || "Run job failed";
                    runningMessage = "Failed";
                    break;
                }
                if (!body?.ready) {
                    if (body?.status) runningMessage = body.status;
                    await delay(600);
                    continue;
                }

                runningMessage = "";
                if (body?.timeout) {
                    error = "Time Limit Exceeded";
                } else if (body?.error) {
                    error = body.error;
                } else {
                    output = body.output || "";
                    logs = body.logs || "";
                }
                break;
            }
        } catch (err: any) {
            console.error(err);
            error = err.message || "Failed";
            runningMessage = "Failed";
        } finally {
            isLoading = false;
        }
    }

    async function handleDebugRun() {
        if ($execPaneHeightStore <= minExecPanelHeight) {
            $execPaneHeightStore = Math.max(12, Math.min(90, lastNonMinHeight || 35));
        }
        isDebugRunning = true;
        isLoading = true;
        output = "";
        logs = "";
        error = null;
        hasRunOnce = true;
        debugState = { status: 'running' };
        runningMessage = "Debug starting...";
        lastSyncedBreakpoints = JSON.stringify(debugBreakpoints);

        try {
            if (imageStatus === "absent" || imageStatus === "unknown") {
                await refreshImageStatus();
                if (imageStatus === "absent" || imageStatus === "unknown") {
                    await pullRuntimeImage();
                }
            }

            const res = await fetch("/api/playground/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code, debugLines: debugBreakpoints }),
            });
            const body = await res.json();
            if (!res.ok || !body.jobId) {
                error = body?.error || "Failed to start debug";
                isDebugRunning = false;
                return;
            }

            debugJobId = body.jobId;
            if (body.state) debugState = body.state;
            runningMessage = "";
            startDebugPolling();
        } catch (err: any) {
            error = err.message || "Debug failed";
        } finally {
            isLoading = false;
            isDebugRunning = false;
        }
    }

    async function debugAction(action: string) {
        if (!debugJobId) return;
        isDebugRunning = true;
        try {
            const res = await fetch("/api/debug", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: debugJobId, action }),
            });
            const body = await res.json();
            if (!res.ok) {
                error = body?.error || "Debug action failed";
                isDebugRunning = false;
                return;
            }
            debugState = body;
            if (body.status === 'completed' || body.status === 'error' || body.status === 'stopped') {
                stopDebugPolling();
                debugJobId = null;
            }
        } catch (err: any) {
            error = err.message || "Debug action failed";
        } finally {
            isDebugRunning = false;
        }
    }

    function startDebugPolling() {
        stopDebugPolling();
        debugPollInterval = setInterval(async () => {
            if (!debugJobId) return;
            try {
                const res = await fetch(`/api/debug?jobId=${encodeURIComponent(debugJobId)}`);
                const body = await res.json();
                if (res.ok) {
                    debugState = body;
                    if (body.status === 'completed' || body.status === 'error') {
                        stopDebugPolling();
                        debugJobId = null;
                    }
                }
            } catch {}
        }, 500);
    }

    function stopDebugPolling() {
        if (debugPollInterval) {
            clearInterval(debugPollInterval);
            debugPollInterval = null;
        }
    }

    function stopDebugging() {
        if (debugJobId) {
            fetch("/api/debug", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: debugJobId, action: "stop" }),
            }).catch(() => {});
            debugJobId = null;
        }
        debugState = null;
        stopDebugPolling();
    }

    onDestroy(stopDebugPolling);

    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "'") {
                e.preventDefault();
                if (!isLoading) handleRun();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
                e.preventDefault();
                togglePanelVisibility();
            }
        };
        window.addEventListener("keydown", keyHandler);
        return () => window.removeEventListener("keydown", keyHandler);
    });
</script>

<div
    class="panel"
    bind:this={panelElement}
    style="height: {$execPaneHeightStore}%;"
>
    <button
        class="resizer"
        type="button"
        aria-label="Resize execution panel"
        on:mousedown={handleMouseDown}
        on:keydown={handleResizerKeydown}
    ></button>
    <div class="tabs" class:hide={$execPaneHeightStore <= 15}>
        <button class="tab active">Output</button>
    </div>

    <div
        class="content"
        class:hide={$execPaneHeightStore <= minExecPanelHeight}
    >
        {#if debugState}
            <div class="debug-view">
                <div class="debug-header">
                    <span class="debug-status">
                        {#if debugState.status === 'running'}
                            <span class="debug-dot running"></span> Running
                        {:else if debugState.status === 'paused'}
                            <span class="debug-dot paused"></span> Paused at line {debugState.line}
                        {:else if debugState.status === 'completed'}
                            <span class="debug-dot completed"></span> Completed
                        {:else if debugState.status === 'error'}
                            <span class="debug-dot error"></span> Error
                        {/if}
                    </span>
                    {#if debugJobId && (debugState.status === 'paused' || debugState.status === 'running')}
                        <div class="debug-actions">
                            <button class="btn btn-debug-action" on:click={() => debugAction('step')} disabled={isDebugRunning}>
                                Step Over
                            </button>
                            <button class="btn btn-debug-action" on:click={() => debugAction('continue')} disabled={isDebugRunning}>
                                Continue
                            </button>
                            <button class="btn btn-debug-action" on:click={() => debugAction('stop')} disabled={isDebugRunning}>
                                Stop
                            </button>
                        </div>
                    {/if}
                </div>
                {#if debugState.status === 'paused'}
                    <div class="debug-variables">
                        <div class="debug-section-title">Variables</div>
                        {#if debugState.vars && Object.keys(debugState.vars).length > 0}
                            <table class="debug-vars-table">
                                <tbody>
                                {#each Object.entries(debugState.vars) as [key, value]}
                                    <tr>
                                        <td class="var-name">{key}</td>
                                        <td class="var-value">{value}</td>
                                    </tr>
                                {/each}
                                </tbody>
                            </table>
                        {:else}
                            <div class="debug-placeholder">No local variables at this point.</div>
                        {/if}
                    </div>
                {/if}
                <div class="debug-variables">
                    <div class="debug-section-title">Output</div>
                    {#if debugState.output && debugState.output.trim()}
                        <pre class="debug-output">{debugState.output}</pre>
                    {:else}
                        <div class="debug-placeholder">No output yet.</div>
                    {/if}
                </div>
                {#if debugState.error}
                    <div class="result-item">
                        <span class="result-status error">Error</span>
                        <pre class="result-output error">{debugState.error}</pre>
                    </div>
                {/if}
            </div>
        {:else if hasRunOnce || output || logs || error}
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
            <div style="display: flex; align-items: center; margin-right: 8px;">
                <SaveStatus />
            </div>
            <Tooltip text={`${isMac ? "CMD" : "CONTROL"} + J`}>
                <button
                    class="icon-btn"
                    aria-label={$execPaneHeightStore > minExecPanelHeight
                        ? "Hide panel"
                        : "Show panel"}
                    on:click={togglePanelVisibility}
                >
                    {#if $execPaneHeightStore > minExecPanelHeight}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                        </svg>
                    {:else}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                            <path
                                d="M3 3l18 18"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    {/if}
                </button>
            </Tooltip>
            {#if isCheckingDocker}
                <div class="docker-error-msg">
                    <svg
                        class="spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="margin-right: 0.5rem;"
                    >
                        <path
                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2"
                            stroke="currentColor"
                            stroke-width="3"
                            stroke-linecap="round"
                        />
                    </svg>
                    Checking Docker...
                </div>
            {:else if !isDockerRunning}
                <div class="docker-error-msg">
                    Docker engine not detected.
                    <button
                        class="link-btn"
                        on:click={refreshImageStatus}
                        style="margin-left: 0.5rem;">Check again</button
                    >
                </div>
            {:else}
                <Tooltip
                    text={isPullingImage
                        ? `${Math.round(pullProgress * 100)}% ${pullStatusMessage} (${imageName})`
                        : imageStatus === "present"
                          ? `Local runtime ready${imageName ? ` (${imageName})` : ""}`
                          : `Download runtime ${imageName ? ` (${imageName})` : ""}`}
                >
                    <div class="runtime-status-container">
                        {#if isPullingImage}
                            <button
                                class="icon-btn progress-btn"
                                aria-label="Cancel download"
                                on:click={cancelPullImage}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <!-- Background circle -->
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-opacity="0.1"
                                        stroke-width="2"
                                    />
                                    <!-- Progress circle -->
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-dasharray="62.83"
                                        stroke-dashoffset={62.83 *
                                            (1 - pullProgress)}
                                        transform="rotate(-90 12 12)"
                                        stroke-linecap="round"
                                    />
                                    <!-- Stop square -->
                                    <rect
                                        x="9"
                                        y="9"
                                        width="6"
                                        height="6"
                                        fill="currentColor"
                                        rx="1"
                                    />
                                </svg>
                            </button>
                        {:else}
                            <button
                                class="icon-btn"
                                aria-label="Runtime image status"
                                class:non-button-hover={imageStatus ===
                                    "present"}
                                on:click={() => {
                                    if (
                                        imageStatus === "absent" ||
                                        imageStatus === "unknown"
                                    )
                                        pullRuntimeImage();
                                }}
                            >
                                {#if imageStatus === "present"}
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                                            fill="currentColor"
                                            fill-opacity="0.12"
                                        />
                                        <path
                                            d="M9 12.5l2 2 4-4"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                {:else}
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M12 3v10m0 0l-4-4m4 4l4-4"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M5 17h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z"
                                            fill="currentColor"
                                            fill-opacity="0.12"
                                        />
                                    </svg>
                                {/if}
                            </button>
                        {/if}
                    </div>
                </Tooltip>
                <span class="status">
                    {runningMessage}
                </span>
                <div style="display:flex;align-items:center;gap:8px;margin-right:20px;">
                    {#if language === 'python'}
                        <Tooltip text={"Run in Debug mode"}>
                            <button
                                class="btn btn-debug"
                                on:click={handleDebugRun}
                                disabled={isLoading || !!debugJobId}
                                aria-label="Debug"
                            >
                                Debug
                            </button>
                        </Tooltip>
                    {/if}
                    <Tooltip text={`${isMac ? "CMD" : "CONTROL"} + '`}>
                        <button
                            class="btn btn-secondary"
                            on:click={handleRun}
                            disabled={isLoading || !!debugJobId}
                        >
                            Run
                        </button>
                    </Tooltip>
                </div>
            {/if}
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
    .output-view {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }
    .result-item {
        font-family: var(--font-mono);
    }
    .result-title {
        font-weight: bold;
        margin-right: var(--spacing-2);
    }
    .result-status {
        font-weight: bold;
    }
    .result-status.error {
        color: var(--color-incorrect);
    }
    .result-output {
        margin-top: var(--spacing-1);
        background-color: var(--color-bg);
        padding: var(--spacing-2);
        border-radius: var(--border-radius);
    }
    .result-output.error {
        color: var(--color-incorrect);
    }

    .placeholder {
        color: var(--color-text-secondary);
        font-style: italic;
    }

    /* Actions Footer */

    .buttons {
        display: flex;
        gap: var(--spacing-2);
    }
    .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: var(--spacing-2) var(--spacing-3);
        border-top: 1px solid var(--color-border);
    }

    .icon-btn {
        display: inline-flex;
        align-items: last baseline;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition:
            background-color 0.15s ease,
            color 0.15s ease,
            transform 0.1s ease;
    }
    .icon-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

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
    .docker-error-msg {
        display: flex;
        align-items: center;
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        padding: 0 0.5rem;
    }
    .link-btn {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
    }
    .runtime-status-container {
        display: flex;
        align-items: center;
    }
    .progress-btn {
        width: 32px;
        height: 32px;
    }
    .progress-btn svg {
        width: 24px;
        height: 24px;
    }
    .non-button-hover {
        cursor: default;
    }
    .btn-debug {
        background-color: transparent;
        border: 1px solid var(--color-border);
        padding: 4px 8px;
        border-radius: 4px;
        color: var(--color-text-secondary);
        transition: all 0.15s;
    }
    .btn-debug:hover {
        border-color: var(--color-highlight);
        color: var(--color-highlight);
    }
    .btn-debug.active {
        background-color: rgba(229, 62, 62, 0.15);
        border-color: #e53e3e;
        color: #e53e3e;
    }
    .debug-view {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    .debug-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2);
        flex-wrap: wrap;
    }
    .debug-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    .debug-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
    }
    .debug-dot.running { background: #d69e2e; animation: pulse 1s infinite; }
    .debug-dot.paused { background: #3182ce; }
    .debug-dot.completed { background: #38a169; }
    .debug-dot.error { background: #e53e3e; }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }
    .debug-actions {
        display: flex;
        gap: 6px;
    }
    .btn-debug-action {
        background: var(--color-second-bg);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.15s;
    }
    .btn-debug-action:hover {
        background: var(--color-third-bg);
        border-color: var(--color-highlight);
    }
    .btn-debug-action:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .debug-variables {
        background: var(--color-bg);
        border-radius: var(--border-radius);
        padding: var(--spacing-2);
    }
    .debug-section-title {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-1);
    }
    .debug-vars-table {
        width: 100%;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        border-collapse: collapse;
    }
    .debug-vars-table td {
        padding: 2px 8px;
        border-bottom: 1px solid var(--color-border);
    }
    .var-name {
        color: var(--color-highlight);
        width: 1%;
        white-space: nowrap;
        vertical-align: top;
    }
    .var-value {
        color: var(--color-text);
        word-break: break-all;
    }
    .debug-output {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        color: var(--color-text);
        white-space: pre-wrap;
    }
    .debug-placeholder {
        font-size: 0.8rem;
        color: var(--color-text-secondary);
        font-style: italic;
        padding: var(--spacing-1) var(--spacing-2);
    }
</style>
