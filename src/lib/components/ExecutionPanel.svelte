<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import { execPaneHeightStore } from "$lib/stores/layoutStore";
    import testCaseStore from "$lib/stores/testCaseStore";
    import Tooltip from "./Tooltip.svelte";
    import Visualization from "./Visualization.svelte";
    import SaveStatus from "./SaveStatus.svelte";
    import GameModeTimer from "./GameModeTimer.svelte";
    import userStore from "$lib/stores/userStore";
    import { isDebugSupported, type ProgrammingLanguage } from "$lib/utils/util";
    export let problem: any;
    export let code: string;
    export let language: ProgrammingLanguage = "java";
    export let gameMode = false;
    export let gameStartTime = 0;
    export let debugBreakpoints: number[] = [];
    export let activeDebugLine: number | null = null;
    let gameRunCount = 0;
    let gameSubmitCount = 0;
    const dispatch = createEventDispatcher();
    type StatusType =
        | "no-status"
        | "sample-tests-passed"
        | "sample-tests-failed"
        | "accepted"
        | "failed"
        | "tle"
        | "running"
        | "sample-tests-failed-tle"
        | "preparing"
        | "pending"
        | "judging";
    let activeMainTab: "testcase" | "output" | "console" | "submission" | "debugger" =
        "testcase";
    let activeTestCaseIndex = 0;
    let isLoading = false;
    let isMac = false;
    let isResizing = false;
    let panelElement: HTMLElement;
    let hasRunOnce = false;
    let status: StatusType = "no-status";
    let runningMessage: string = "";
    // Docker image status for the selected language
    let imageStatus: "unknown" | "present" | "absent" = "unknown";
    let isDockerRunning = true;
    let isCheckingDocker = false;
    let isPullingImage = false;
    let pullProgress = 0;
    let pullStatusMessage = "";
    let imageName: string = "";
    type SubmissionFailure = {
        type: "failed" | "tle";
        index: number; // 0-based global index in official tests
        testCase: any | null; // inputs for the failing/TLE case
        yourAnswer?: string | null;
        expectedAnswer?: string | null;
        error?: string | null;
    } | null;
    let submissionFailure: SubmissionFailure = null;
    // Remember last non-zero height to restore after hide
    let lastNonMinHeight = 35; // percent
    let minExecPanelHeight = 15;

    // Track last non-zero height whenever user resizes/shows the panel
    $: if ($execPaneHeightStore > minExecPanelHeight) {
        lastNonMinHeight = $execPaneHeightStore;
    }

    function togglePanelVisibility() {
        if ($execPaneHeightStore > minExecPanelHeight) {
            // Hide and remember current height
            lastNonMinHeight = $execPaneHeightStore || lastNonMinHeight || 35;
            $execPaneHeightStore = minExecPanelHeight;
        } else {
            // Show, restore last height with a sane minimum
            const restore = Math.max(12, Math.min(90, lastNonMinHeight || 35));
            $execPaneHeightStore = restore;
        }
    }

    function statusToString(status: StatusType) {
        switch (status) {
            case "no-status":
                return "";
            case "sample-tests-failed":
                return "Sample Tests Failed";
            case "sample-tests-passed":
                return "Sample Tests Passed";
            case "accepted":
                return "Accepted";
            case "failed":
                return "Failed";
            case "running":
                return "Running";
            case "pending":
                return "Pending";
            case "preparing":
                return "Preparing / Compiling";
            case "judging":
                return "Judging";
            case "sample-tests-failed-tle":
                return "Sample Tests Failed (TLE)";
            case "tle":
                return "Failed (TLE)";
            default:
                return "";
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
        const step = 2; // percentage points
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
        } else if (e.key === "Home") {
            next = 12;
            e.preventDefault();
        } else if (e.key === "End") {
            next = 90;
            e.preventDefault();
        }
        $execPaneHeightStore = next;
    }

    // Register a global keyboard shortcut: Ctrl + ' to run tests
    onMount(() => {
        isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const keyHandler = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                e.shiftKey &&
                (e.key === "'" || e.key === '"')
            ) {
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
            // Toggle show/hide panel: Ctrl+J (or Cmd+J)
            if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
                e.preventDefault();
                togglePanelVisibility();
            }
        };
        window.addEventListener("keydown", keyHandler);
        return () => window.removeEventListener("keydown", keyHandler);
    });

    // Image status helpers
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
            isDockerRunning = true; // Fallback to avoid hiding button on network error
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
            // Already pulling, wait for it
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

                // Wait for completion
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

    // Refresh image status on mount and when language changes
    let lastLanguageChecked: string | null = null;
    onMount(refreshImageStatus);
    $: if (language && language !== lastLanguageChecked) {
        lastLanguageChecked = language;
        imageStatus = "unknown";
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
        testCaseResults = base.map((tc: any) => ({
            ...tc,
            output: null,
            logs: "",
            error: null,
        }));
    })();

    // Persist changes to testCaseResults to the store (only the input fields; exclude output/error)
    $: if (testCaseResults) {
        // Build a snapshot suitable for storing
        const toStore = testCaseResults.map((tc: any) => {
            const copy: any = {};
            Object.entries(tc).forEach(([k, v]) => {
                if (k !== "output" && k !== "error" && k !== "logs")
                    copy[k] = v;
            });
            return copy;
        });
        // Update store for this problem id
        testCaseStore.update((s) => ({ ...s, [problem.id]: toStore }));
    }

    function addTestCase() {
        const template = activeTestCase ||
            testCaseResults[testCaseResults.length - 1] || { input: null };
        const newCase: any = {};
        Object.entries(template).forEach(([k, v]) => {
            if (
                k !== "output" &&
                k !== "error" &&
                k !== "logs" &&
                k !== "correctAnswer" &&
                k !== "isCorrect"
            )
                newCase[k] = v;
        });
        // push default output/error
        const pushed = { ...newCase, output: null, logs: "", error: null };
        testCaseResults = [...testCaseResults, pushed];
        activeTestCaseIndex = testCaseResults.length - 1;
    }

    function resetTestCases() {
        const base = Array.isArray(problem?.testCases) ? problem.testCases : [];
        testCaseResults = base.map((tc: any) => ({
            ...tc,
            output: null,
            logs: "",
            error: null,
        }));
        activeTestCaseIndex = 0;
        hasRunOnce = false;
        status = "no-status";
    }

    function useFailedTestCase() {
        if (!submissionFailure?.testCase) return;
        const newCase: any = {};
        const template = submissionFailure.testCase;
        Object.entries(template).forEach(([k, v]) => {
            if (
                k !== "output" &&
                k !== "error" &&
                k !== "logs" &&
                k !== "correctAnswer" &&
                k !== "isCorrect"
            )
                newCase[k] = v;
        });
        const pushed = { ...newCase, output: null, logs: "", error: null };
        testCaseResults = [...testCaseResults, pushed];
        activeTestCaseIndex = testCaseResults.length - 1;
        activeMainTab = "testcase";
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
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return value;
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    // Resolve numNodes for a parameter based on its numNodesRef in problem.params
    function getNumNodesForParam(paramName: string): number | null {
        try {
            const meta = Array.isArray(problem?.params)
                ? problem.params.find((x: any) => x?.name === paramName)
                : null;
            const refName = meta?.numNodesRef;
            if (!refName) return null;
            const rv = activeTestCase?.[refName];
            if (rv === null || rv === undefined) return null;
            if (typeof rv === "number") return rv;
            if (typeof rv === "string") {
                try {
                    const parsed = JSON.parse(rv);
                    if (typeof parsed === "number") return parsed;
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

    function delay(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }

    async function handleRun() {
        if (debugJobId || debugState) stopDebugging();
        isLoading = true;
        if (gameMode) gameRunCount++;
        runningMessage = "";
        submissionFailure = null; // clear previous submission failure display when running samples
        activeMainTab = "output"; // Switch to output tab on run
        testCaseResults = testCaseResults.map((tc: any) => ({
            ...tc,
            output: "Running...",
            logs: "",
            error: null,
            correctAnswer: null,
        }));
        hasRunOnce = true;
        status = "running";
        try {
            // If the runtime image is missing, inform user and pull it first
            if (imageStatus === "absent" || imageStatus === "unknown") {
                // Make a best-effort recheck before pulling
                await refreshImageStatus();
                if (imageStatus === "absent" || imageStatus === "unknown") {
                    await pullRuntimeImage();
                }
            }
            // Build payload testCases from current testCaseResults, stripping output/error
            const payloadTestCases = testCaseResults.map((tc: any) => {
                const copy: any = {};
                Object.entries(tc).forEach(([k, v]) => {
                    if (k !== "output" && k !== "error" && k !== "logs")
                        copy[k] = v;
                });
                return copy;
            });

            // Kick off run job
            const startRes = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: problem.id,
                    language,
                    code: code,
                    testCases: payloadTestCases,
                }),
            });
            const startBody = await startRes.json();
            if (!startRes.ok || !startBody?.jobId) {
                const errMsg = startBody?.error || "Failed to start run job";
                testCaseResults = testCaseResults.map((tc: any) => ({
                    ...tc,
                    output: null,
                    logs: "",
                    isCorrect: false,
                    error: errMsg,
                }));
                status = "sample-tests-failed";
                return;
            }

            const jobId = startBody.jobId as string;
            // Poll until ready
            while (true) {
                const pollRes = await fetch(
                    `/api/run?jobId=${encodeURIComponent(jobId)}`,
                );
                const body = await pollRes.json();
                if (!pollRes.ok) {
                    const errMsg = body?.error || "Run job failed";
                    testCaseResults = testCaseResults.map((tc: any) => ({
                        ...tc,
                        output: null,
                        logs: "",
                        isCorrect: false,
                        error: errMsg,
                    }));
                    status = "sample-tests-failed";
                    break;
                }
                if (!body?.ready) {
                    if (body?.status) {
                        runningMessage = statusToString(body?.status);
                    }
                    await delay(600);
                    continue;
                }
                runningMessage = "";
                if (body?.timeout) {
                    testCaseResults = testCaseResults.map((tc: any) => ({
                        ...tc,
                        output: null,
                        logs: "",
                        isCorrect: false,
                        error: "Time Limit Exceeded",
                    }));
                    status = "sample-tests-failed-tle";
                    break;
                }
                if (Array.isArray(body?.results)) {
                    const results = body.results;
                    testCaseResults = results;
                    for (const tc of testCaseResults) {
                        if (!tc.isCorrect) {
                            status = "sample-tests-failed";
                        }
                    }
                    if (status != "sample-tests-failed") {
                        status = "sample-tests-passed";
                    }
                    break;
                }
                // Fallback: unexpected shape
                testCaseResults = testCaseResults.map((tc: any) => ({
                    ...tc,
                    output: null,
                    logs: "",
                    isCorrect: false,
                    error: "Unexpected response from run job",
                }));
                status = "sample-tests-failed";
                break;
            }
        } catch (err) {
            console.error(err);
            status = "sample-tests-failed";
            testCaseResults = testCaseResults.map((tc: any) => ({
                ...tc,
                output: null,
                logs: "",
                isCorrect: false,
                error: "Failed",
            }));
        } finally {
            isLoading = false;
        }
    }

    async function handleSubmit() {
        if (debugJobId || debugState) stopDebugging();
        isLoading = true;
        const submitTime = Date.now();
        if (gameMode) gameSubmitCount++;
        runningMessage = "";
        status = "running";
        submissionFailure = null; // reset previous submission view
        let tcNo = 0;
        let totalTc = 0;
        while (true) {
            if (totalTc > 0) {
                runningMessage = `Passed ${tcNo} / ${totalTc}`;
            }
            try {
                // If the runtime image is missing, inform user and pull it first
                if (
                    tcNo === 0 &&
                    (imageStatus === "absent" || imageStatus === "unknown")
                ) {
                    // only at start of submission
                    await refreshImageStatus();
                    if (imageStatus === "absent" || imageStatus === "unknown") {
                        await pullRuntimeImage();
                    }
                }
                const startRes = await fetch("/api/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        problemId: problem.id,
                        language,
                        code,
                        startTcNo: tcNo,
                    }),
                });
                const startBody = await startRes.json();
                if (!startRes.ok || !startBody?.jobId) {
                    const errMsg =
                        startBody?.error || "Failed to start submit job";
                    runningMessage = "";
                    status = "failed";
                    submissionFailure = {
                        type: "failed",
                        index: tcNo,
                        testCase: null,
                        yourAnswer: null,
                        expectedAnswer: null,
                        error: errMsg,
                    };
                    activeMainTab = "submission";
                    break;
                }
                const jobId = startBody.jobId as string;
                // Poll until completed
                while (true) {
                    const pollRes = await fetch(
                        `/api/submit?jobId=${encodeURIComponent(jobId)}`,
                    );
                    const body = await pollRes.json();
                    if (!pollRes.ok) {
                        runningMessage = "";
                        status = body.timeout ? "tle" : "failed";
                        runningMessage = `${body.timeout ? "TLE" : "Failed"} on Test ${tcNo + 1}`;
                        // Prepare failure details
                        if (body?.timeout && body?.timeoutTestCase) {
                            submissionFailure = {
                                type: "tle",
                                index: tcNo,
                                testCase: body.timeoutTestCase || null,
                                yourAnswer: null,
                                expectedAnswer: null,
                                error: "Time Limit Exceeded",
                            };
                        } else {
                            submissionFailure = {
                                type: "failed",
                                index: tcNo,
                                testCase: body?.errorTestCase || null,
                                yourAnswer: null,
                                expectedAnswer: null,
                                error: body?.error || "Submission failed",
                            };
                        }
                        activeMainTab = "submission";
                        break;
                    }
                    if (!body?.ready) {
                        if (body?.passedTc) {
                            runningMessage = `Passed ${body?.passedTc}`;
                        }
                        await delay(600);
                        continue;
                    }
                    if (body?.timeout) {
                        runningMessage = "";
                        status = "tle";
                        runningMessage = `TLE on Test ${tcNo + 1}`;
                        submissionFailure = {
                            type: "tle",
                            index: tcNo,
                            testCase: body.timeoutTestCase || null,
                            yourAnswer: null,
                            expectedAnswer: null,
                            error: "Time Limit Exceeded",
                        };
                        activeMainTab = "submission";
                        break;
                    }
                    if (body.totalTc) {
                        totalTc = body.totalTc;
                    }
                    if (body.allAccepted) {
                        status = "accepted";
                        runningMessage = "";
                        userStore.update((prev) => ({
                            ...prev,
                            [problem.id]: true,
                        }));
                        if (gameMode) {
                            const timeSpent = Math.floor((submitTime - gameStartTime) / 1000);
                            dispatch('gameSubmitSuccess', { runCount: gameRunCount, submitCount: gameSubmitCount, timeSpent });
                        }
                        break;
                    }
                    if (!body.accepted) {
                        runningMessage = `Failed on Test ${tcNo + 1}`;
                        status = "failed";
                        const results: any[] = body.results || [];
                        let localFailIndex = 0;
                        for (let i = 0; i < results.length; i++) {
                            if (!results[i]?.isCorrect) {
                                localFailIndex = i;
                                break;
                            }
                        }
                        const failing = results[localFailIndex] || {};
                        const globalIndex = tcNo + localFailIndex;
                        submissionFailure = {
                            type: "failed",
                            index: globalIndex,
                            testCase: failing || null,
                            yourAnswer: failing?.output ?? null,
                            expectedAnswer: failing?.correctAnswer ?? null,
                            error: failing?.error ?? null,
                        };
                        activeMainTab = "submission";
                        break;
                    }
                    // Accepted this chunk; advance tcNo and process next chunk
                    tcNo = tcNo + (body.passedTc || 1);
                    break;
                }
                // If status became failed or accepted inside polling, exit outer while
                if (
                    status === "failed" ||
                    status === "accepted" ||
                    status === "tle"
                ) {
                    break;
                }
            } catch (err) {
                console.error(err);
                runningMessage = "";
                status = "failed";
                runningMessage = `Failed on Test ${tcNo + 1}`;
                submissionFailure = {
                    type: "failed",
                    index: tcNo,
                    testCase: null,
                    yourAnswer: null,
                    expectedAnswer: null,
                    error: "Submission request error",
                };
                activeMainTab = "submission";
                break;
            }
        }
        isLoading = false;
    }

    function getCrashHint(error: string | null): string | null {
        if (!error) return null;
        if (error.includes('SIGSEGV')) return 'Your code crashed (Segmentation Fault). This usually means you accessed invalid memory — check for out-of-bounds array access or null pointer dereference.';
        if (error.includes('SIGFPE')) return 'Your code crashed (Floating Point Exception). This usually means a division by zero or arithmetic overflow.';
        if (error.includes('SIGABRT')) return 'Your code crashed (Abort). This usually means an assertion failed or an unhandled exception.';
        return null;
    }

    // ----- Debugger -----
    let debugJobId: string | null = null;
    let debugState: any = null;
    let isDebugRunning = false;
    let debugPollInterval: any = null;
    let lastSyncedBreakpoints: string = "[]";

    // The currently executing test case (1-based -> 0-based index) for pill highlight.
    // Only set while debugging is actively running/paused — not when completed/error/stopped.
    $: debugTestCaseIndex =
        debugState &&
        (debugState.status === "running" || debugState.status === "paused") &&
        typeof debugState.testCase === "number"
            ? debugState.testCase - 1
            : null;

    // Reflect the paused line back to the editor
    $: activeDebugLine =
        debugState && debugState.status === "paused" ? debugState.line : null;

    // Strip harness markers (:::RESULT:::, ---) from the captured debug output
    $: debugCleanOutput =
        debugState && debugState.output
            ? debugState.output
                  .split("\n")
                  .filter((l: string) => l.trim() !== "---" && !l.startsWith(":::"))
                  .join("\n")
            : "";

    // Keep breakpoints in sync with a live debug session
    $: if (
        debugJobId &&
        debugBreakpoints &&
        JSON.stringify(debugBreakpoints) !== lastSyncedBreakpoints
    ) {
        lastSyncedBreakpoints = JSON.stringify(debugBreakpoints);
        fetch("/api/debug", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jobId: debugJobId,
                action: "setBreakpoints",
                breakpoints: debugBreakpoints,
            }),
        }).catch(() => {});
    }

    function buildPayloadTestCases() {
        return testCaseResults.map((tc: any) => {
            const copy: any = {};
            Object.entries(tc).forEach(([k, v]) => {
                if (k !== "output" && k !== "error" && k !== "logs")
                    copy[k] = v;
            });
            return copy;
        });
    }

    async function handleDebugRun() {
        if ($execPaneHeightStore <= minExecPanelHeight) {
            $execPaneHeightStore = Math.max(12, Math.min(90, lastNonMinHeight || 35));
        }
        isDebugRunning = true;
        isLoading = true;
        runningMessage = "Debug starting...";
        submissionFailure = null;
        debugState = { status: "running" };
        activeMainTab = "debugger";
        lastSyncedBreakpoints = JSON.stringify(debugBreakpoints);

        try {
            if (imageStatus === "absent" || imageStatus === "unknown") {
                await refreshImageStatus();
                if (imageStatus === "absent" || imageStatus === "unknown") {
                    await pullRuntimeImage();
                }
            }

            const res = await fetch("/api/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: problem.id,
                    language,
                    code,
                    testCases: buildPayloadTestCases(),
                    debugLines: debugBreakpoints,
                }),
            });
            const body = await res.json();
            if (!res.ok || !body.jobId) {
                debugState = {
                    status: "error",
                    error: body?.error || "Failed to start debug session",
                };
                return;
            }

            debugJobId = body.jobId;
            if (body.state) debugState = body.state;
            runningMessage = "";
            startDebugPolling();
        } catch (err: any) {
            debugState = { status: "error", error: err.message || "Debug failed" };
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
                debugState = { ...(debugState || {}), error: body?.error || "Debug action failed" };
                isDebugRunning = false;
                return;
            }
            debugState = body;
            if (body.results) {
                stopDebugPolling();
                debugJobId = null;
                applyDebugResults(body.results);
                debugState = null;
            } else if (
                body.status === "completed" ||
                body.status === "error" ||
                body.status === "stopped"
            ) {
                stopDebugPolling();
                debugJobId = null;
                debugState = null;
            }
        } catch (err: any) {
            debugState = { ...(debugState || {}), error: err.message || "Debug action failed" };
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
                    if (body.results) {
                        stopDebugPolling();
                        debugJobId = null;
                        applyDebugResults(body.results);
                        debugState = null;
                    } else if (body.status === "completed" || body.status === "error") {
                        stopDebugPolling();
                        debugJobId = null;
                        debugState = null;
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

    function applyDebugResults(results: any[]) {
        testCaseResults = results;
        hasRunOnce = true;
        status = "sample-tests-passed";
        for (const tc of results) {
            if (!tc.isCorrect) {
                status = "sample-tests-failed";
            }
        }
        activeMainTab = "output";
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
        activeMainTab = "testcase";
    }

    onDestroy(stopDebugPolling);

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
        <button
            class="tab"
            class:active={activeMainTab === "testcase"}
            on:click={() => (activeMainTab = "testcase")}
        >
            Test Case
        </button>
        <button
            class="tab"
            class:active={activeMainTab === "output"}
            on:click={() => (activeMainTab = "output")}
        >
            Output
        </button>
        <button
            class="tab"
            class:active={activeMainTab === "console"}
            on:click={() => (activeMainTab = "console")}
        >
            Console
        </button>
        {#if submissionFailure}
            <button
                class="tab"
                class:active={activeMainTab === "submission"}
                on:click={() => (activeMainTab = "submission")}
            >
                Submission
            </button>
        {/if}
        {#if debugState}
            <button
                class="tab"
                class:active={activeMainTab === "debugger"}
                on:click={() => (activeMainTab = "debugger")}
            >
                Debugger
            </button>
        {/if}
    </div>

    <div
        class="content"
        class:hide={$execPaneHeightStore <= minExecPanelHeight}
    >
        {#if activeMainTab === "testcase"}
            <div class="testcase-view">
                <div class="case-selector">
                    {#each testCaseResults as _, i}
                        <div class="case-btn-wrap">
                            <button
                                class="btn case-btn"
                                class:active={activeTestCaseIndex === i}
                                on:click={() => (activeTestCaseIndex = i)}
                            >
                                Case {i + 1}
                            </button>
                            <button
                                class="case-remove"
                                aria-label="Remove test case"
                                on:click={(e) => {
                                    e.stopPropagation();
                                    removeTestCase(i);
                                }}>✕</button
                            >
                        </div>
                    {/each}
                    <button
                        class="btn"
                        on:click={addTestCase}
                        aria-label="Add test case">+</button
                    >
                    <button
                        class="link-btn reset-link"
                        type="button"
                        on:click={resetTestCases}
                        aria-label="Reset to original sample test cases"
                        >Reset Test Cases</button
                    >
                </div>
                {#if activeTestCase}
                    <div class="case-inputs">
                        {#each Object.entries(activeTestCase) as [key, value]}
                            {#if problem.params.find((x: any) => x.name === key)}
                                <label for={key}>{key} =</label>
                                <textarea
                                    id={key}
                                    rows="1"
                                    on:input={(e) => updateCaseValue(key, e)}
                                    >{stringifyForTextarea(value)}</textarea
                                >
                                {#if problem.params.find((x: any) => x.name === key)?.visualizeType}
                                    <div class="viz-wrap">
                                        <Visualization
                                            visualType={problem.params.find(
                                                (x: any) => x.name === key,
                                            )?.visualizeType}
                                            data={typeof value === "string"
                                                ? value
                                                : JSON.stringify(value)}
                                            numNodes={getNumNodesForParam(key)}
                                        />
                                    </div>
                                {/if}
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        {:else if activeMainTab === "output" && hasRunOnce}
            <div class="output-view">
                <div class="case-selector">
                    {#each testCaseResults as tc, i}
                        <div class="case-btn-wrap">
                            <button
                                class="output btn case-btn"
                                class:correct={!isLoading && tc.isCorrect}
                                class:incorrect={!isLoading && !tc.isCorrect}
                                class:active={activeTestCaseIndex === i}
                                on:click={() => (activeTestCaseIndex = i)}
                            >
                                Case {i + 1}
                            </button>
                            <button
                                class="case-remove"
                                aria-label="Remove test case"
                                on:click={(e) => {
                                    e.stopPropagation();
                                    removeTestCase(i);
                                }}>✕</button
                            >
                        </div>
                    {/each}
                </div>

                {#if activeTestCase}
                    <div class="result-item">
                        <div class="case-inputs">
                            {#each Object.entries(activeTestCase) as [key, value]}
                                {#if problem.params.find((x: any) => x.name === key)}
                                    <label for={key}>{key} =</label>
                                    <pre
                                        class="result-output">{stringifyForTextarea(
                                            value,
                                        )}</pre>
                                    {#if problem.params.find((x: any) => x.name === key)?.visualizeType}
                                        <div class="viz-wrap">
                                            <Visualization
                                                visualType={problem.params.find(
                                                    (x: any) => x.name === key,
                                                )?.visualizeType}
                                                data={typeof value === "string"
                                                    ? value
                                                    : JSON.stringify(value)}
                                                numNodes={getNumNodesForParam(
                                                    key,
                                                )}
                                            />
                                        </div>
                                    {/if}
                                {/if}
                            {/each}
                        </div>
                        <span class="result-title">Your Answer</span>
                        {#if activeTestCase.error}
                            <span class="result-status error">Error</span>
                            <pre
                                class="result-output error">{activeTestCase.error}</pre>
                        {:else}
                            <span class="result-status"></span>
                            <pre
                                class="result-output">{activeTestCase.output}</pre>
                        {/if}
                        {#if activeTestCase.correctAnswer}
                            <span class="result-title">Correct Answer</span>
                            <pre
                                class="result-output">{activeTestCase.correctAnswer}</pre>
                        {/if}
                    </div>
                {/if}
            </div>
        {:else if activeMainTab === "console" && hasRunOnce}
            <div class="output-view">
                <div class="case-selector">
                    {#each testCaseResults as tc, i}
                        <div class="case-btn-wrap">
                            <button
                                class="output btn case-btn"
                                class:active={activeTestCaseIndex === i}
                                on:click={() => (activeTestCaseIndex = i)}
                            >
                                Case {i + 1}
                            </button>
                            <button
                                class="case-remove"
                                aria-label="Remove test case"
                                on:click={(e) => {
                                    e.stopPropagation();
                                    removeTestCase(i);
                                }}>✕</button
                            >
                        </div>
                    {/each}
                </div>

                {#if activeTestCase}
                    <div class="result-item">
                        <span class="result-title">Console</span>
                        <pre class="result-output">{activeTestCase.logs ||
                                ""}</pre>
                    </div>
                {/if}
            </div>
        {:else if activeMainTab === "submission" && submissionFailure}
            <div class="submission-view">
                <div class="summary">
                    <span class="result-title incorrect"
                        >{submissionFailure.type === "tle" ? "TLE" : "Failed"} on
                        Test {submissionFailure.index + 1}</span
                    >
                </div>
                <div class="inputs">
                    <div class="result-title">Inputs</div>
                    <div class="kv-list">
                        {#if submissionFailure.testCase}
                            {#each problem.params as p}
                                {#if submissionFailure.testCase[p.name] !== undefined}
                                    <div class="kv-row">
                                        <div>{p.name}:</div>
                                        <pre
                                            class="result-output">{JSON.stringify(
                                                submissionFailure.testCase[
                                                    p.name
                                                ],
                                            )}</pre>
                                    </div>
                                {/if}
                            {/each}
                        {:else}
                            <div class="kv-row">
                                <span>No input details available.</span>
                            </div>
                        {/if}
                    </div>
                </div>
                <div class="outputs">
                    {#if submissionFailure.type === "tle"}
                        <div class="result-item">
                            <span class="result-title">Result</span>
                            <pre
                                class="result-output error">Time Limit Exceeded</pre>
                        </div>
                    {:else}
                        <div class="result-item">
                            <span class="result-title">Your Answer</span>
                            {#if submissionFailure.error}
                                <span class="result-status error">Error</span>
                                {#if getCrashHint(submissionFailure.error)}
                                    <pre class="result-output hint">{getCrashHint(submissionFailure.error)}</pre>
                                {/if}
                                <pre
                                    class="result-output error">{submissionFailure.error}</pre>
                            {:else}
                                <span class="result-status"></span>
                                <pre
                                    class="result-output">{submissionFailure.yourAnswer}</pre>
                            {/if}
                        </div>
                        <div class="result-item">
                            <span class="result-title">Correct Answer</span>
                            <pre
                                class="result-output">{submissionFailure.expectedAnswer}</pre>
                        </div>
                    {/if}
                </div>
                <div class="use-case-action">
                    <button class="btn use-case-btn" on:click={useFailedTestCase}>
                        Use Test Case
                    </button>
                </div>
            </div>
        {:else if activeMainTab === "debugger" && debugState}
            <div class="debug-view">
                <div class="debug-case-selector">
                    {#each testCaseResults as _, i}
                        <button
                            class="btn case-btn debug-case-pill"
                            class:debug-current={debugTestCaseIndex === i}
                            title={debugTestCaseIndex === i ? "Currently running" : ""}
                        >
                            Case {i + 1}
                            {#if debugTestCaseIndex === i}
                                <span class="debug-run-dot"></span>
                            {/if}
                        </button>
                    {/each}
                </div>
                <div class="debug-header">
                    <span class="debug-status">
                        {#if debugState.status === "running"}
                            <span class="debug-dot running"></span> Running
                        {:else if debugState.status === "paused"}
                            <span class="debug-dot paused"></span> Paused at line {debugState.line}
                        {:else if debugState.status === "completed"}
                            <span class="debug-dot completed"></span> Completed
                        {:else if debugState.status === "error"}
                            <span class="debug-dot error"></span> Error
                        {:else if debugState.status === "stopped"}
                            <span class="debug-dot error"></span> Stopped
                        {/if}
                        {#if typeof debugState.testCase === "number"}
                            <span class="debug-case-label"
                                >· Case {debugState.testCase}{debugState.totalTestCases
                                    ? `/${debugState.totalTestCases}`
                                    : ""}</span
                            >
                        {/if}
                    </span>
                    {#if debugJobId && (debugState.status === "paused" || debugState.status === "running")}
                        <div class="debug-actions">
                            <button class="btn btn-debug-action" on:click={() => debugAction("step")} disabled={isDebugRunning}>
                                Step Over
                            </button>
                            <button class="btn btn-debug-action" on:click={() => debugAction("continue")} disabled={isDebugRunning}>
                                Continue
                            </button>
                            <button class="btn btn-debug-action" on:click={() => debugAction("stop")} disabled={isDebugRunning}>
                                Stop
                            </button>
                        </div>
                    {/if}
                </div>
                {#if debugState.status === "paused"}
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
                    {#if debugCleanOutput.trim()}
                        <pre class="debug-output">{debugCleanOutput}</pre>
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
        {/if}
    </div>

    <div class="actions">
        <div class="buttons">
            <div style="display: flex; align-items: center; margin-right: 8px;">
                {#if gameMode && gameStartTime > 0}
                    <GameModeTimer startTime={gameStartTime} />
                {/if}
                <SaveStatus />
            </div>
            <!-- Show/Hide panel button -->
            <Tooltip text={isMac ? "Cmd + J" : "Ctrl + J"}>
                <button
                    class="icon-btn"
                    aria-label={$execPaneHeightStore > minExecPanelHeight
                        ? "Hide panel"
                        : "Show panel"}
                    on:click={togglePanelVisibility}
                >
                    {#if $execPaneHeightStore > minExecPanelHeight}
                        <!-- Eye (visible) icon -->
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
                        <!-- Eye-off (hidden) icon -->
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
                <!-- Runtime image presence indicator + action -->
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
                                    <!-- Check/ready icon -->
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
                                    <!-- Download icon -->
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
                <span
                    class="status"
                    class:correct={status == "accepted" ||
                        status == "sample-tests-passed"}
                    class:incorrect={status == "failed" ||
                        status == "sample-tests-failed" ||
                        status == "sample-tests-failed-tle" ||
                        status == "tle"}
                >
                    {#if runningMessage}
                        {runningMessage}
                    {:else}
                        {statusToString(status)}
                    {/if}
                </span>
                {#if isDebugSupported(language)}
                    <Tooltip text={debugBreakpoints.length === 0 ? "No breakpoint selected" : "Run in Debug mode"}>
                        <button
                            class="btn btn-debug"
                            on:click={handleDebugRun}
                            disabled={isLoading || !!debugJobId || debugBreakpoints.length === 0}
                            aria-label="Debug"
                        >
                            Debug
                        </button>
                    </Tooltip>
                {/if}
                <Tooltip text={isMac ? "Cmd + '" : "Ctrl + '"}>
                    <button
                        class="btn btn-secondary"
                        on:click={handleRun}
                        disabled={isLoading}
                    >
                        Run
                    </button>
                </Tooltip>
                <Tooltip text={isMac ? "Cmd + Shift + '" : "Ctrl + Shift + '"}>
                    <button
                        class="btn btn-primary"
                        on:click={handleSubmit}
                        disabled={isLoading}>Submit</button
                    >
                </Tooltip>
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
        white-space: nowrap;
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
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
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
    .result-output.hint {
        color: var(--color-warning);
        font-size: 0.9em;
        border-left: 3px solid var(--color-warning);
        padding-left: var(--spacing-2);
    }

    /* Submission View */
    .submission-view {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
    }
    .submission-view .summary {
        font-family: var(--font-mono);
    }
    .kv-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-family: var(--font-mono);
    }
    .kv-row {
        font-weight: 200;
        font-style: italic;
    }
    .use-case-action {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--spacing-2);
    }
    .use-case-btn {
        background-color: var(--color-primary);
        color: var(--color-primary-text);
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
    .runtime-status-container {
        display: flex;
        align-items: center;
    }
    .docker-error-msg {
        display: flex;
        align-items: center;
        color: var(--color-text-secondary);
        font-size: 0.85rem;
        padding: 0 0.5rem;
    }
    .progress-btn {
        width: 32px;
        height: 32px;
    }
    .progress-btn svg {
        width: 24px;
        height: 24px;
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
    .reset-link {
        margin-left: auto;
        align-self: center;
    }

    /* --- Debugger --- */
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
    .btn-debug:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        border-color: var(--color-border);
        color: var(--color-text-secondary);
    }
    .btn-debug:disabled:hover {
        border-color: var(--color-border);
        color: var(--color-text-secondary);
    }
    .debug-view {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3);
    }
    .debug-case-selector {
        display: flex;
        gap: var(--spacing-2);
        flex-wrap: wrap;
    }
    .debug-case-pill {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: default;
        white-space: nowrap;
    }
    .debug-case-pill:hover {
        transform: none;
    }
    .debug-case-pill.debug-current {
        border: 1px solid var(--color-highlight);
        color: var(--color-highlight);
        background-color: rgba(214, 158, 46, 0.12);
        font-weight: 700;
    }
    .debug-run-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d69e2e;
        animation: pulse 1s infinite;
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
    .debug-case-label {
        color: var(--color-text-secondary);
        font-weight: 500;
    }
    .debug-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
    }
    .debug-dot.running {
        background: #d69e2e;
        animation: pulse 1s infinite;
    }
    .debug-dot.paused {
        background: #3182ce;
    }
    .debug-dot.completed {
        background: #38a169;
    }
    .debug-dot.error {
        background: #e53e3e;
    }
    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
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
        margin-left: 0;
    }
    .btn-debug-action:hover {
        background: var(--color-third-bg);
        border-color: var(--color-highlight);
        transform: none;
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
