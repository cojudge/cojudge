# Adding a New Language to CoJudge

This guide explains how to add a new programming language to CoJudge, using C# as a reference implementation.

## Overview

To add a new language, you need to implement several components that work together:
1. **Core Runner** (`ProgramRunner` subclass) - compiles and executes code in Docker containers
2. **Utility Module** - handles language-specific input/output parsing and code generation
3. **Playground Runner** - enables code execution without problem context
4. **API Integration** - connects runners to web endpoints
5. **UI Support** - adds language option to frontend
6. **Starter Code** - provides boilerplate code for all existing problems

## Implementation Steps

### 1. Create Core Runner (`src/lib/runners/YourLanguageRunner.ts`)

```typescript
export class YourLanguageRunner extends ProgramRunner {
    private container: Dockerode.Container | null = null;
    private compiled = false;

    async compile(): Promise<void> {
        // 1. Ensure Docker image exists
        await ensureImageAvailable(docker, yourImage);
        
        // 2. Create container for compilation
        this.container = await docker.createContainer({
            Image: yourImage,
            Cmd: ['sh', '-lc', 'tail -f /dev/null'],
            WorkingDir: '/app',
            Tty: false,
            Labels: { 'cojudge.created': 'true' }
        });
        await this.container.start();
        
        // 3. Upload source files via tar archive
        const pack = tar.pack();
        pack.entry({ name: 'Solution.ext' }, Buffer.from(this.code));
        pack.entry({ name: 'Helper.ext' }, Buffer.from(helperCode));
        pack.finalize();
        await this.container.putArchive(pack as any, { path: '/app' });
        
        // 4. Compile inside container
        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', 'your-build-command'],
            AttachStdout: true,
            AttachStderr: true
        });
        // Handle compilation output and errors...
    }

    async run(): Promise<string[]> {
        // Execute compiled code with timeout
        const exec = await this.container.exec({
            Cmd: ['timeout', EXECUTION_TIMEOUT_SECONDS, '/bin/sh', '-c', 'your-run-command'],
            AttachStdout: true,
            AttachStderr: true
        });
        // Capture and parse execution results...
    }
}
```

**Key Lessons Learned:**
- **Always initialize projects** that require build files (e.g., `dotnet new console`, `npm init`)
- Use proper build commands that work in container environments
- Include `--no-build` flags if building separately
- Handle container cleanup in both success and error cases
- Follow existing error handling patterns (timeout, compile errors)

### 2. Create Utility Module (`src/lib/utils/yourLangUtil.ts`)

```typescript
export const yourImage = 'your-docker-image:tag';

// Define data structures (if needed)
export const yourListNodeClass = `...`;
export const yourTreeNodeClass = `...`;

// Helper methods for input/output parsing
export const yourHelperMethods = `
    # Add using statements as needed
    public static string DisplayOutput(...) { ... }
    public static int[] ToIntArray(string s) { ... }
    # Add all other type converters
`;

// Type conversion functions
export function yourGetFullParam(params: Param[], tc: any): string {
    // Convert test case data to language-specific format
}

export function generateYourRunner(functionName: string, params: Param[], testCases: any[], outputType: string): string {
    // Generate main program with test cases
}
```

**Critical Lessons for Parsing:**
- **Use `TryParse` instead of `Parse`** to handle malformed input gracefully
- **Proper string trimming** - remove brackets `[` `]` and whitespace before parsing
- **Handle edge cases** - empty arrays, null values, malformed JSON
- **Make helper methods public** - they're called from generated code
- **Disable nullable warnings** with `#nullable disable` for simpler parsing code
- **Use safe character literals** (`\0` not `\\0`, `'` not `\\'`)

### 3. Update API Endpoints

Add to both run endpoints:

**`src/routes/api/run/+server.ts`:**
```typescript
import { YourLanguageRunner } from '$lib/runners/YourLanguageRunner';

// Add in executeRun function:
else if (language === 'yourlang') {
    programRunner = new YourLanguageRunner(problemId, testCases, code);
}
```

**`src/routes/api/submit/+server.ts`:** - Same pattern as above

**`src/routes/api/image/pull/+server.ts` and `src/routes/api/image/status/+server.ts`:**
```typescript
import { yourImage } from '$lib/utils/yourLangUtil';

function imageForLanguage(language: string) {
    // Add: if (language === 'yourlang') return { image: yourImage, language };
}
```

### 4. Create Playground Runner (`src/lib/runners/PlaygroundRunners.ts`)

```typescript
export class PlaygroundYourLanguageRunner extends PlaygroundRunner {
    async compile(): Promise<void> {
        // Similar to main runner but simpler - no problem context
    }
    
    async run(): Promise<{ output: string; logs: string }> {
        // Return output and logs separately for UI
    }
}
```

**Update playground API** (`src/routes/api/playground/run/+server.ts`):
```typescript
import { PlaygroundYourLanguageRunner } from '$lib/runners/PlaygroundRunners';

// Add to executeRun function:
else if (language === 'yourlang') {
    runner = new PlaygroundYourLanguageRunner(code);
}
```

### 5. Update Type Definitions and UI

**`src/lib/utils/util.ts`:**
```typescript
export type ProgrammingLanguage = 'java' | 'python' | 'cpp' | 'csharp' | 'yourlang';
```

**`src/routes/problems/[slug]/+page.svelte`:**
```html
<select id="language-select" bind:value={language}>
    <!-- Add: -->
    <option value="yourlang">YourLanguage</option>
</select>
```

**`src/routes/playground/+page.svelte`:** - Same pattern for playground

### 6. Add Starter Code to Problems

For each problem's `metadata.json`, add starter code in the `starterCode` object:

```json
{
  "starterCode": {
    "java": "...",
    "python": "...", 
    "cpp": "...",
    "csharp": "...",
    "yourlang": "Your language starter code template"
  }
}
```

**Automate this process** - create a script to:
1. Read all problem metadata files
2. Convert Java signatures to your language conventions
3. Apply proper naming conventions (PascalCase for C#, snake_case for Python, etc.)
4. Generate appropriate imports and boilerplate
5. Update all files in batch

## Language-Specific Considerations

### Compiled Languages (C++, C#, Java)
- Need separate compile and run phases
- Use `dotnet build`, `g++`, `javac` respectively  
- Handle build files (`.exe`, `.class`, etc.)
- Consider project initialization (`dotnet new console`)

### Interpreted Languages (Python)
- Direct execution without compilation
- Use `python` command directly
- Simpler container setup

### Key Integration Points
- **Docker images** - must have all dependencies pre-installed
- **Error handling** - consistent timeout and build error patterns
- **Output format** - `:::RESULT:::` prefix for result extraction
- **Naming conventions** - follow language idioms for method/function names

## Testing Checklist

- [ ] Runner compiles and executes simple code
- [ ] Playground mode works correctly  
- [ ] Image pulling/checking functions
- [ ] All API endpoints handle the language
- [ ] UI language selector appears and functions
- [ ] Starter code works for simple problems
- [ ] Starter code works for complex problems (arrays, trees, etc.)
- [ ] Error handling works (timeout, compile errors, runtime errors)

## Common Pitfalls to Avoid

1. **Build system issues** - always test actual build commands in container
2. **Input parsing errors** - use safe parsing with proper error handling
3. **Access level issues** - make helper methods public 
4. **Project structure** - some languages need proper project files
5. **Naming conflicts** - ensure method names follow language conventions
6. **Docker image compatibility** - verify images work in target environment