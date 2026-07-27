# Contributing to Cojudge

Thanks for your interest! Here's how to get started.

## Reporting Issues

Open a [GitHub Issue](https://github.com/cojudge/cojudge/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Your OS, Docker version, Node.js version

## Submitting Changes

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run `npm test` to check for regressions
5. Push and open a PR

## Adding Problems

See [`docs/ADD_PROBLEMS.md`](docs/ADD_PROBLEMS.md) for the full guide.

## Adding Languages

See [`docs/ADD_LANGUAGE.md`](docs/ADD_LANGUAGE.md) for the full guide.

## Code Style

- TypeScript with strict types
- Svelte 5 runes syntax
- No trailing semicolons, 2-space indentation
- Follow existing patterns in `src/`

## Development

```bash
npm install
npm run dev     # starts Vite dev server
npm run build  # production build
npm test       # vitest unit tests
npm run test:e2e # Playwright e2e tests
```

Docker is required for judging. See [README](README.md#troubleshooting) for platform-specific setup.
