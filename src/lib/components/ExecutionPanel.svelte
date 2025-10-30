<script lang="ts">
    import { onMount } from 'svelte';
    import { execPaneHeightStore } from '$lib/stores/layoutStore';
    import testCaseStore from '$lib/stores/testCaseStore';
    import Tooltip from './Tooltip.svelte';
    import Visualization from './Visualization.svelte';
    import userStore from '$lib/stores/userStore';
    import type { ProgrammingLanguage } from '$lib/utils/util';
    export let problem: any;
    export let code: string;
    export let language: ProgrammingLanguage = 'java';
    type StatusType = 'no-status' | 'sample-tests-passed' | 'sample-tests-failed' | 'accepted' | 'failed' | 'tle' | 'running' | 'sample-tests-failed-tle';
    let activeMainTab: 'testcase' | 'output' | 'console' | 'submission' = 'testcase';
    let activeTestCaseIndex = 0;
    let isLoading = false;
    let isResizing = false;
    let panelElement: HTMLElement;
    let hasRunOnce = false;
    let status: StatusType = 'no-status';
    let runningMessage: string = '';
    // Docker image status for the selected language
    let imageStatus: 'unknown' | 'present' | 'absent' = 'unknown';
    let isPullingImage = false;
    let imageName: string = '';
    type SubmissionFailure = {
        type: 'failed' | 'tle';
        index: number; // 0-based global index in official tests
        testCase: any | null; // inputs for the failing/TLE case
        yourAnswer?: string | null;
        expectedAnswer?: string | null;
        error?: string | null;
    } | null;
    let submissionFailure: SubmissionFailure = null;

    function statusToString(status: StatusType) {
        switch (status) {
            case 'no-status':
                return '';
            case 'sample-tests-failed':
                return 'Sample Tests Failed';
            case 'sample-tests-passed':
                return 'Sample Tests Passed';
            case 'accepted':
                return 'Accepted';
            case 'failed':
                return 'Failed';
            case 'running':
                return 'Running...';
            case 'sample-tests-failed-tle':
                return 'Sample Tests Failed (TLE)'
            case 'tle':
                return 'Failed (TLE)'
            default:
                return '';
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
        const parentRect = panelElement.parentElement.getBoundingClientRect();
        const step = 2; // percentage points
        let next = $execPaneHeightStore;
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            next = Math.min(90, next + (e.key === 'PageUp' ? step * 3 : step));
            e.preventDefault();
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            next = Math.max(12, next - (e.key === 'PageDown' ? step * 3 : step));
            e.preventDefault();
        } else if (e.key === 'Home') {
            next = 12;
            e.preventDefault();
        } else if (e.key === 'End') {
            next = 90;
            e.preventDefault();
        }
        $execPaneHeightStore = next;
    }

    // Register a global keyboard shortcut: Ctrl + ' to run tests
    onMount(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "'" || e.key === '"')) {
                e.preventDefault();
                if (!isLoading) {
                    handleSubmit();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "'") {
                e.preventDefault();
                if (!isLoading) {
                    handleRun();
                }
            }
        };
        window.addEventListener('keydown', keyHandler);
        return () => window.removeEventListener('keydown', keyHandler);
    });

    // Image status helpers
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
            // pull endpoint returns once done
            await res.json().catch(() => ({}));
            await refreshImageStatus();
        } catch (e) {
            // keep status as-is on failure
        } finally {
            isPullingImage = false;
        }
    }

    // Refresh image status on mount and when language changes
    let lastLanguageChecked: string | null = null;
    onMount(refreshImageStatus);
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = 'unknown';
        refreshImageStatus();
    }
    
    // Initialize results state from the problem data or saved store
    let testCaseResults: any[] = [];

    // Try to load saved testcases for this problem from the store (if any), else use problem.testCases
    $: (() => {
        // Capture a snapshot of the store
        let storeSnapshot: Record<string, any[]> = {};
        const unsub = testCaseStore.subscribe((v) => (storeSnapshot = v));
        unsub();

        const saved = storeSnapshot?.[problem.id];
        const base = saved || problem.testCases;
        testCaseResults = base.map((tc: any) => ({ ...tc, output: null, logs: '', error: null }));
    })();

    // Persist changes to testCaseResults to the store (only the input fields; exclude output/error)
    $: if (testCaseResults) {
        // Build a snapshot suitable for storing
        const toStore = testCaseResults.map((tc: any) => {
            const copy: any = {};
            Object.entries(tc).forEach(([k, v]) => {
                if (k !== 'output' && k !== 'error' && k !== 'logs') copy[k] = v;
            });
            return copy;
        });
        // Update store for this problem id
        testCaseStore.update((s) => ({ ...s, [problem.id]: toStore }));
    }

    function addTestCase() {
        const template = activeTestCase || testCaseResults[testCaseResults.length - 1] || { input: null };
        const newCase: any = {};
        Object.entries(template).forEach(([k, v]) => {
            if (k !== 'output' && k !== 'error' && k !== 'logs' && k !== 'correctAnswer' && k !== 'isCorrect') newCase[k] = v;
        });
        // push default output/error
        const pushed = { ...newCase, output: null, logs: '', error: null };
        testCaseResults = [...testCaseResults, pushed];
        activeTestCaseIndex = testCaseResults.length - 1;
    }

    function resetTestCases() {
        const base = Array.isArray(problem?.testCases) ? problem.testCases : [];
        testCaseResults = base.map((tc: any) => ({ ...tc, output: null, logs: '', error: null }));
        activeTestCaseIndex = 0;
        hasRunOnce = false;
        status = 'no-status';
    }

    function removeTestCase(index: number) {
        // Remove the case
        const next = testCaseResults.filter((_: any, i: number) => i !== index);
        testCaseResults = next;
        // Adjust active index
        if (activeTestCaseIndex >= next.length) {
            activeTestCaseIndex = Math.max(0, next.length - 1);
        }
    }

    function updateCaseValue(key: string, e: Event) {
        const target = e.target as HTMLTextAreaElement;
        let raw = target.value;
        let parsed: any = raw;
        // Try to parse JSON-friendly values (numbers, arrays, objects)
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            // keep as string if JSON.parse fails
            parsed = raw;
        }

        testCaseResults = testCaseResults.map((tc: any, idx: number) => {
            if (idx !== activeTestCaseIndex) return tc;
            return { ...tc, [key]: parsed };
        });
    }

    // Show raw strings as-is to avoid adding quotes while typing, JSON-stringify for objects/arrays/numbers/booleans
    function stringifyForTextarea(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    // Resolve numNodes for a parameter based on its numNodesRef in problem.params
    function getNumNodesForParam(paramName: string): number | null {
        try {
            const meta = Array.isArray(problem?.params) ? problem.params.find((x: any) => x?.name === paramName) : null;
            const refName = meta?.numNodesRef;
            if (!refName) return null;
            const rv = activeTestCase?.[refName];
            if (rv === null || rv === undefined) return null;
            if (typeof rv === 'number') return rv;
            if (typeof rv === 'string') {
                try {
                    const parsed = JSON.parse(rv);
                    if (typeof parsed === 'number') return parsed;
                } catch {}
                const num = Number(rv);
                return Number.isFinite(num) ? num : null;
            }
            return null;
        } catch {
            return null;
        }
    }

    // A reactive statement to get the currently selected test case
    $: activeTestCase = testCaseResults[activeTestCaseIndex];

    function delay(ms: number) { return new Promise((res) => setTimeout(res, ms)); }

    async function handleRun() {
        isLoading = true;
        runningMessage = '';
        submissionFailure = null; // clear previous submission failure display when running samples
        activeMainTab = 'output'; // Switch to output tab on run
        testCaseResults = testCaseResults.map((tc: any) => ({ ...tc, output: 'Running...', logs: '', error: null, correctAnswer: null }));
        hasRunOnce = true;
        status = 'running';
        try {
            // If the runtime image is missing, inform user and pull it first
            if (imageStatus === 'absent' || imageStatus === 'unknown') {
                // Make a best-effort recheck before pulling
                await refreshImageStatus();
                if (imageStatus === 'absent' || imageStatus === 'unknown') {
                    runningMessage = `Downloading ${imageName || 'runtime image'}... (first run may take longer)`;
                    await pullRuntimeImage();
                    runningMessage = '';
                }
            }
            // Build payload testCases from current testCaseResults, stripping output/error
            const payloadTestCases = testCaseResults.map((tc: any) => {
                const copy: any = {};
                Object.entries(tc).forEach(([k, v]) => {
                    if (k !== 'output' && k !== 'error' && k !== 'logs') copy[k] = v;
                });
                return copy;
            });

            // Kick off run job
            const startRes = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problemId: problem.id,
                    language,
                    code: code,
                    testCases: payloadTestCases
                })
            });
            const startBody = await startRes.json();
            if (!startRes.ok || !startBody?.jobId) {
                const errMsg = startBody?.error || 'Failed to start run job';
                testCaseResults = testCaseResults.map((tc: any) => ({
                    ...tc,
                    output: null,
                    logs: '',
                    isCorrect: false,
                    error: errMsg
                }));
                status = 'sample-tests-failed';
                return;
            }

            const jobId = startBody.jobId as string;
            // Poll until ready
            while (true) {
                const pollRes = await fetch(`/api/run?jobId=${encodeURIComponent(jobId)}`);
                const body = await pollRes.json();
                if (!pollRes.ok) {
                    const errMsg = body?.error || 'Run job failed';
                    testCaseResults = testCaseResults.map((tc: any) => ({
                        ...tc,
                        output: null,
                        logs: '',
                        isCorrect: false,
                        error: errMsg
                    }));
                    status = 'sample-tests-failed';
                    break;
                }
                if (!body?.ready) {
                    await delay(600);
                    continue;
                }
                if (body?.timeout) {
                    testCaseResults = testCaseResults.map((tc: any) => ({
                        ...tc,
                        output: null,
                        logs: '',
                        isCorrect: false,
                        error: 'Time Limit Exceeded'
                    }));
                    status = 'sample-tests-failed-tle';
                    break;
                }
                if (Array.isArray(body?.results)) {
                    const results = body.results;
                    testCaseResults = results;
                    for (const tc of testCaseResults) {
                        if (!tc.isCorrect) {
                            status = 'sample-tests-failed';
                        }
                    }
                    if (status != 'sample-tests-failed') {
                        status = 'sample-tests-passed';
                    }
                    break;
                }
                // Fallback: unexpected shape
                testCaseResults = testCaseResults.map((tc: any) => ({
                    ...tc,
                    output: null,
                    logs: '',
                    isCorrect: false,
                    error: 'Unexpected response from run job'
                }));
                status = 'sample-tests-failed';
                break;
            }
        } catch (err) {
            console.error(err);
            status = 'sample-tests-failed';
            testCaseResults = testCaseResults.map((tc: any) => ({
                ...tc,
                output: null,
                logs: '',
                isCorrect: false,
                error: 'Failed'
            }));
        } finally {
            isLoading = false;
        }
    }

    async function handleSubmit() {
        isLoading = true;
        runningMessage = '';
        status = 'running';
        submissionFailure = null; // reset previous submission view
        let tcNo = 0;
        let totalTc = 0;
        while (true) {
            if (totalTc > 0) {
                runningMessage = `Passed ${tcNo} / ${totalTc}`;
            }
            try {
                // If the runtime image is missing, inform user and pull it first
                if (tcNo === 0 && (imageStatus === 'absent' || imageStatus === 'unknown')) { // only at start of submission
                    await refreshImageStatus();
                    if (imageStatus === 'absent' || imageStatus === 'unknown') {
                        runningMessage = `Downloading ${imageName || 'runtime image'}... (first submit may take longer)`;
                        await pullRuntimeImage();
                        runningMessage = totalTc > 0 ? `Passed ${tcNo} / ${totalTc}` : '';
                    }
                }
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ problemId: problem.id, language, code, startTcNo: tcNo })
                });
                const body = await response.json();
                if (!response.ok) {
                    runningMessage = '';
                    status = body.timeout ? 'tle' : 'failed';
                    runningMessage = `${body.timeout ? 'TLE' : 'Failed'} on Test ${tcNo + 1}`;
                    // Prepare submission failure details (TLE or generic failure)
                    if (body?.timeout && body?.timeoutTestCase) {
                        submissionFailure = {
                            type: 'tle',
                            index: tcNo,
                            testCase: body.timeoutTestCase || null,
                            yourAnswer: null,
                            expectedAnswer: null,
                            error: 'Time Limit Exceeded'
                        };
                        activeMainTab = 'submission';
                    } else {
                        submissionFailure = {
                            type: 'failed',
                            index: tcNo,
                            testCase: null,
                            yourAnswer: null,
                            expectedAnswer: null,
                            error: body?.error || 'Submission failed'
                        };
                        activeMainTab = 'submission';
                    }
                    break;
                }
                if (body.totalTc) {
                    totalTc = body.totalTc;
                }
                if (body.allAccepted) {
                    status = 'accepted';
                    runningMessage = '';
                    userStore.update((prev) => ({ ...prev, [problem.id]: true }));
                    break;
                }
                if (!body.accepted) {
                    runningMessage = `Failed on Test ${tcNo + 1}`;
                    status = 'failed';
                    // capture first failing test in this chunk (results are per-chunk)
                    const results: any[] = body.results || [];
                    let localFailIndex = 0;
                    for (let i = 0; i < results.length; i++) {
                        if (!results[i]?.isCorrect) { localFailIndex = i; break; }
                    }
                    const failing = results[localFailIndex] || {};
                    const globalIndex = tcNo + localFailIndex;
                    submissionFailure = {
                        type: 'failed',
                        index: globalIndex,
                        testCase: failing || null,
                        yourAnswer: failing?.output ?? null,
                        expectedAnswer: failing?.correctAnswer ?? null,
                        error: failing?.error ?? null
                    };
                    activeMainTab = 'submission';
                    break;
                } else {
                    tcNo = tcNo + (body.passedTc || 1);
                }
            } catch (err) {
                console.error(err);
                runningMessage = '';
                status = 'failed';
                runningMessage = `Failed on Test ${tcNo + 1}`;
                submissionFailure = {
                    type: 'failed',
                    index: tcNo,
                    testCase: null,
                    yourAnswer: null,
                    expectedAnswer: null,
                    error: 'Submission request error'
                };
                activeMainTab = 'submission';
                break;
            }
        }
        isLoading = false;
    }
</script>

<div 
    class="panel"
    bind:this={panelElement}
    style="height: {$execPaneHeightStore}%;"
>
    <button class="resizer" type="button" aria-label="Resize execution panel" on:mousedown={handleMouseDown} on:keydown={handleResizerKeydown}></button>
    <div class="tabs" class:hide={$execPaneHeightStore <= 15}>
        <button class="tab" class:active={activeMainTab === 'testcase'} on:click={() => (activeMainTab = 'testcase')}>
            Test Case
        </button>
        <button class="tab" class:active={activeMainTab === 'output'} on:click={() => (activeMainTab = 'output')}>
            Output
        </button>
        <button class="tab" class:active={activeMainTab === 'console'} on:click={() => (activeMainTab = 'console')}>
            Console
        </button>
        {#if submissionFailure}
            <button class="tab" class:active={activeMainTab === 'submission'} on:click={() => (activeMainTab = 'submission')}>
                Submission
            </button>
        {/if}
    </div>

    <div class="content" class:hide={$execPaneHeightStore <= 15}>
        {#if activeMainTab === 'testcase'}
            <div class="testcase-view">
                <div class="case-selector">
                    {#each testCaseResults as _, i}
                        <div class="case-btn-wrap">
                            <button class="btn case-btn" class:active={activeTestCaseIndex === i} on:click={() => (activeTestCaseIndex = i)}>
                                Case {i + 1}
                            </button>
                            <button class="case-remove" aria-label="Remove test case" on:click={(e) => { e.stopPropagation(); removeTestCase(i); }}>✕</button>
                        </div>
                    {/each}
                    <button class="btn" on:click={addTestCase} aria-label="Add test case">+</button>
                    <button class="link-btn reset-link" type="button" on:click={resetTestCases} aria-label="Reset to original sample test cases">Reset Test Cases</button>
                </div>
                {#if activeTestCase}
                <div class="case-inputs">
                    {#each Object.entries(activeTestCase) as [key, value]}
                        {#if problem.params.find((x: any) => x.name === key)}
                            <label for={key}>{key} =</label>
                            <textarea id={key} rows="1" on:input={(e) => updateCaseValue(key, e)}>{stringifyForTextarea(value)}</textarea>
                            {#if (problem.params.find((x: any) => x.name === key)?.visualizeType)}
                                <div class="viz-wrap">
                                    <Visualization
                                        visualType={(problem.params.find((x: any) => x.name === key)?.visualizeType)}
                                        data={typeof value === 'string' ? value : JSON.stringify(value)}
                                        numNodes={getNumNodesForParam(key)}
                                    />
                                </div>
                            {/if}
                        {/if}
                    {/each}
                </div>
                {/if}
            </div>
        {:else if activeMainTab === 'output' && hasRunOnce}
            <div class="output-view">
                <div class="case-selector">
                    {#each testCaseResults as tc, i}
                        <div class="case-btn-wrap">
                            <button class="output btn case-btn" class:correct={!isLoading && tc.isCorrect} class:incorrect={!isLoading && !tc.isCorrect} class:active={activeTestCaseIndex === i} on:click={() => (activeTestCaseIndex = i)}>
                                Case {i + 1}
                            </button>
                            <button class="case-remove" aria-label="Remove test case" on:click={(e) => { e.stopPropagation(); removeTestCase(i); }}>✕</button>
                        </div>
                    {/each}
                </div>

                {#if activeTestCase}
                    <div class="result-item">
                        <div class="case-inputs">
                            {#each Object.entries(activeTestCase) as [key, value]}
                                {#if problem.params.find((x: any) => x.name === key)}
                                    <label for={key}>{key} =</label>
                                    <pre class="result-output">{stringifyForTextarea(value)}</pre>
                                    {#if (problem.params.find((x: any) => x.name === key)?.visualizeType)}
                                        <div class="viz-wrap">
                                            <Visualization
                                                visualType={(problem.params.find((x: any) => x.name === key)?.visualizeType)}
                                                data={typeof value === 'string' ? value : JSON.stringify(value)}
                                                numNodes={getNumNodesForParam(key)}
                                            />
                                        </div>
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                        <span class="result-title">Your Answer</span>
                        {#if activeTestCase.error}
                            <span class="result-status error">Error</span>
                            <pre class="result-output error">{activeTestCase.error}</pre>
                        {:else}
                            <span class="result-status"></span>
                            <pre class="result-output">{activeTestCase.output}</pre>
                        {/if}
                        {#if activeTestCase.correctAnswer}
                            <span class="result-title">Correct Answer</span>
                            <pre class="result-output">{activeTestCase.correctAnswer}</pre>
                        {/if}
                    </div>
                {/if}
            </div>
        {:else if activeMainTab === 'console' && hasRunOnce}
            <div class="output-view">
                <div class="case-selector">
                    {#each testCaseResults as tc, i}
                        <div class="case-btn-wrap">
                            <button class="output btn case-btn" class:active={activeTestCaseIndex === i} on:click={() => (activeTestCaseIndex = i)}>
                                Case {i + 1}
                            </button>
                            <button class="case-remove" aria-label="Remove test case" on:click={(e) => { e.stopPropagation(); removeTestCase(i); }}>✕</button>
                        </div>
                    {/each}
                </div>

                {#if activeTestCase}
                    <div class="result-item">
                        <span class="result-title">Console</span>
                        <pre class="result-output">{activeTestCase.logs || ''}</pre>
                    </div>
                {/if}
            </div>
        {:else if activeMainTab === 'submission' && submissionFailure}
            <div class="submission-view">
                <div class="summary">
                    <span class="result-title incorrect">{submissionFailure.type === 'tle' ? 'TLE' : 'Failed'} on Test {submissionFailure.index + 1}</span>
                </div>
                <div class="inputs">
                    <div class="result-title">Inputs</div>
                    <div class="kv-list">
                        {#if submissionFailure.testCase}
                            {#each problem.params as p}
                                {#if submissionFailure.testCase[p.name] !== undefined}
                                    <div class="kv-row">
                                        <div>{p.name}:</div>
                                        <pre class="result-output">{JSON.stringify(submissionFailure.testCase[p.name])}</pre>
                                    </div>
                                {/if}
                            {/each}
                        {:else}
                            <div class="kv-row"><span>No input details available.</span></div>
                        {/if}
                    </div>
                </div>
                <div class="outputs">
                    {#if submissionFailure.type === 'tle'}
                        <div class="result-item">
                            <span class="result-title">Result</span>
                            <pre class="result-output error">Time Limit Exceeded</pre>
                        </div>
                    {:else}
                        <div class="result-item">
                            <span class="result-title">Your Answer</span>
                            {#if submissionFailure.error}
                                <span class="result-status error">Error</span>
                                <pre class="result-output error">{submissionFailure.error}</pre>
                            {:else}
                                <span class="result-status"></span>
                                <pre class="result-output">{submissionFailure.yourAnswer}</pre>
                            {/if}
                        </div>
                        <div class="result-item">
                            <span class="result-title">Correct Answer</span>
                            <pre class="result-output">{submissionFailure.expectedAnswer}</pre>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <div class="actions">
        <div class="buttons">
            <!-- Runtime image presence indicator + action -->
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
                        <!-- Spinner -->
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spin">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="4" />
                            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
                        </svg>
                    {:else if imageStatus === 'present'}
                        <!-- Check/ready icon -->
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="currentColor" fill-opacity="0.12" />
                            <path d="M9 12.5l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    {:else}
                        <!-- Download icon -->
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v10m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 17h14v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z" fill="currentColor" fill-opacity="0.12"/>
                        </svg>
                    {/if}
                </button>
            </Tooltip>
            <span class="status" class:correct={status == 'accepted' || status == 'sample-tests-passed'} class:incorrect={status == 'failed' || status == 'sample-tests-failed' || status == 'sample-tests-failed-tle' || status == 'tle'}>
                {#if runningMessage}
                    {runningMessage}
                {:else}
                    {statusToString(status)}
                {/if}
            </span>
            <Tooltip text={"Ctrl + '"}>
                <button
                    class="btn btn-secondary"
                    on:click={handleRun}
                    disabled={isLoading}
                >
                    Run
                </button>
            </Tooltip>
            <Tooltip text={"Ctrl + Shift + '"}>
                <button class="btn btn-primary" on:click={handleSubmit} disabled={isLoading}>Submit</button>
            </Tooltip>
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
.case-selector {
    display: flex;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-3);
}
.case-btn-wrap {
    position: relative;
    display: inline-block;
}
.case-btn-wrap:hover .case-remove {
    opacity: 1;
}
.case-btn {
    padding-right: calc(var(--spacing-4) + 8px);
}
.case-remove {
    opacity: 0;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: none;
    background: var(--color-bg);
    color: var(--color-text-secondary);
    font-size: 0.65rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.case-remove:hover {
    background: var(--color-surface-hover);
}
.btn.active {
    text-decoration: underline;
    text-underline-offset: 5px;
    text-decoration-thickness: 2px;
}
.case-inputs label {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-1);
    display: block;
}
.case-inputs textarea {
    width: 100%;
    padding: var(--spacing-2);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-active);
    font-family: var(--font-mono);
    resize: vertical;
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

/* Submission View */
.submission-view { display: flex; flex-direction: column; gap: var(--spacing-2); }
.submission-view .summary { font-family: var(--font-mono); }
.kv-list { display: flex; flex-direction: column; gap: 4px; font-family: var(--font-mono); }
.kv-row { font-weight: 200; font-style: italic; }

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
    border: 1px solid var(--color-border-active);
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
.btn-primary {
    background-color: var(--color-primary);
    color: var(--color-primary-text);
}
.resizer {
    cursor: row-resize;
    height: 3px;
    opacity: 0;
    width: 100%;
    z-index: 10;
    position: fixed;
}
.incorrect {
    color: var(--color-incorrect);
}
.correct {
    color: var(--color-correct);
}
.status {
    margin-top: 5px;
}
.non-button-hover {
    cursor: default;
}

/* Link-like button */
.link-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
}
.reset-link { margin-left: auto; align-self: center; }

</style>