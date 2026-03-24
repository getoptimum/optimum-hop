# Contributing to Optimum HOP

Thanks for your interest in contributing. This guide covers the workflow and conventions we follow.

## Getting started

1. **Fork** the repository and clone your fork.
1. Create a feature branch from `main`:

```bash
git checkout -b feat/short-description
```

1. Install dependencies:

```bash
yarn install --frozen-lockfile
```

## Branch naming

| Prefix | Use |
|---|---|
| `feat/` | New feature or enhancement |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `chore/` | Tooling, CI, dependency updates |

## Development

```bash
make run-dev        # VitePress dev server
make lint           # ESLint
make lint-markdown  # markdownlint
make build          # Production build
```

All four checks must pass before opening a PR.

## Pull requests

* Target `main`.
* Keep PRs focused - one concern per PR.
* Provide a short description of **what** and **why**.
* CI runs lint, markdown lint, and build automatically on every PR.

## Project structure

* `docs/` - User-facing documentation (VitePress pages).
* `integration/` - Docker Compose integration packs, synced from the gateway repo.
* `.github/workflows/` - CI/CD pipelines.

## Code style

* JavaScript/TypeScript: ESLint + Prettier (run `yarn lint:fix && yarn format`).
* Markdown: markdownlint (config in `.markdownlint.json`).

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) style (e.g. `feat:`, `fix:`, `docs:`, `chore:`).

## Questions

Open an issue if something is unclear.
