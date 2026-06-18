## Overview

Cojudge is an offline-first code judge built with SvelteKit and Docker. It provides a LeetCode-style environment for solving algorithmic problems without internet access.

## Adding Problems

When asked to add a new problem, follow the detailed guide in [`docs/ADD_PROBLEMS.md`](docs/ADD_PROBLEMS.md). In general, you should:

1. Create folder: `problems/<slug>/`
2. Add required files:
   - `statement.md` - Problem description
   - `metadata.json` - Problem metadata and function signature
   - `official-tests.json` - Test inputs
   - `Marker.java` - Solution and validation logic
3. Update `courses/blind75/courseinfo.json`
4. Use the `cojudge` CLI to verify the problems

## Adding Languages

Please refer to `docs/ADD_LANGUAGE.md`

## Key Components

### CLI
- Tool: `cojudge` (defined in `bin/cojudge`)

### Code Execution
- `src/lib/runners/` - Language-specific execution logic
- Docker containers for sandboxed execution
- Automatic compilation and runtime management

### Problem Management
- `problems/` - Problem definitions and tests
- `courses/` - Problem pack organization