export abstract class ProgramRunner {
    protected readonly problemId: string;
    protected readonly testCases: any[];
    protected readonly code: string;

    protected constructor(problemId: string, testCases: any[], code: string) {
        this.problemId = problemId;
        this.testCases = testCases || [];
        this.code = code;
    }

    // Prepare artifacts (e.g., write files, compile).
    abstract compile(): Promise<void>;
    // Run the prepared program and return outputs per test case
    abstract run(): Promise<string[]>;
}