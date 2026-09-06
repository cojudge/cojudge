## Overview

Cojudge is an offline-first code judge built with SvelteKit and Docker. It provides a LeetCode-style environment for solving algorithmic problems without internet access.

## Adding Problems

When asked to add a new problem, follow the detailed guide in [`docs/ADD_PROBLEMS.md`](docs/ADD_PROBLEMS.md). In general, you should:

1. Create folder: `~/cojudge/problems/<slug>/` (seeded from the repo's `problems/` on first start; user copy overrides bundled content)
2. Add required files:
   - `statement.md` - Problem description
   - `metadata.json` - Problem metadata and function signature
   - `official-tests.json` - Test inputs
   - `Marker.java` - Solution and validation logic
   - `solution.md` - Optional solution walkthrough (see `docs/ADD_PROBLEMS.md`)
3. Update `~/cojudge/courses/blind75/courseinfo.json`
4. Use the `cojudge` CLI to verify the problems

Note: for repo contributions, edit `problems/` / `courses/` in the repo; at runtime the server and CLI read from `~/cojudge` first with the bundled copy as fallback. Override with `COJUDGE_CONTENT_DIR`.

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