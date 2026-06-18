# Cojudge Development Guide

## Overview

Cojudge is an offline-first code judge built with SvelteKit and Docker. It provides a LeetCode-style environment for solving algorithmic problems without internet access.

## Architecture

### Frontend
- **Framework**: SvelteKit
- **UI**: In-browser code editor with dark/light mode support
- **State Management**: Local storage for persistent code and progress tracking
- **Features**: Browser-like tabs, problem packs, progress tracking

### Backend
- **Runtime**: Docker containers for consistent, isolated execution
- **Languages**: Java, Python, C++ support
- **Sandboxing**: Dockerode for container management
- **API**: RESTful endpoints for problem execution and management

### Problem System
- **Structure**: Each problem in `problems/` folder with metadata, tests, and marker
- **Judging**: Java-based `Marker.java` with solution and validation logic
- **Courses**: Organized problem packs (e.g., Blind 75)

## Development Setup

### Prerequisites
- Docker (installed and running)
- Node.js and npm
- Add user to docker group:
  ```bash
  sudo usermod -aG docker "$USER"
  newgrp docker
  ```

## Adding Problems

When asked to add a new problem, follow the guide in [`docs/ADD_PROBLEMS.md`](docs/ADD_PROBLEMS.md). It covers:

- Required files and their format
- Standard function-based vs class-based design problems
- Supported parameter/output types
- Starter code conventions for all 5 languages
- How to write `Marker.java` with reference solution and `isCorrect` validator
- Registration in `courses/blind75/courseinfo.json`
- Verification steps

## Adding Problems

1. Create folder: `problems/<slug>/`
2. Add required files:
   - `statement.md` - Problem description
   - `metadata.json` - Problem metadata and function signature
   - `official-tests.json` - Test inputs
   - `Marker.java` - Solution and validation logic
3. Update `courses/blind75/courseinfo.json`

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
- Dynamic problem loading and validation

### User Interface
- In-browser Monaco/CodeMirror editor
- Tab system for multiple solutions
- Progress tracking with local storage

## Testing

Test the judge system by:
1. Running existing problems
2. Submitting various solutions
3. Testing edge cases and error handling
4. Verifying Docker container isolation

## Deployment

The application runs as:
- SvelteKit dev server (development)
- Docker container with built frontend (production)
- Multiple language runtime containers for execution
