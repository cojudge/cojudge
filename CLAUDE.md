# CoJudge Development Guide

## Overview

CoJudge is an offline-first competitive programming platform built with SvelteKit and Docker. It provides a LeetCode-style environment for solving algorithmic problems without internet access.

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

## Troubleshooting

### Docker Issues
- Check Docker daemon status
- Verify user in docker group
- For Colima/macOS: Set `HOST_DOCKER_SOCKET` environment variable

### Common Issues
- Container build failures: Check base images and dependencies
- Language runtime errors: Verify Docker images and compilation steps
- UI problems: Check SvelteKit configuration and build process
