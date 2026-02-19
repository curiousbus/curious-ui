# frontend-template-blocks

Reusable frontend blocks/templates powered by `shadcn` registry + Base UI composition.

## Goals
- Publish reusable blocks/templates installable via `shadcn add`.
- Keep behavior and accessibility composable with Base UI primitives.
- Keep styling tokenized and portable.

## Monorepo Structure
- `apps/registry`: hosts generated registry JSON output (`public/r`).
- `packages/blocks`: source blocks and registry item definitions.
- `scripts`: local quality checks and registry build scripts.
- `registry.json`: root shadcn registry manifest generated from `packages/blocks/registry`.

## Quick Start
```bash
pnpm install
pnpm run build:registry
pnpm run check
```

## Release Flow
```bash
pnpm changeset
pnpm run changeset:status
```

After changesets are merged into `main`, GitHub Actions will:
- open a version PR via `changesets/action`
- run publish flow via `pnpm run release:publish`
- skip npm publish automatically when `NPM_TOKEN` is not configured

## Registry Hosting
- Deployment workflow: `.github/workflows/deploy-registry.yml`
- Target URL (GitHub Pages): `https://curiousbus.github.io/frontend-template-blocks/`
- Registry entrypoint: `https://curiousbus.github.io/frontend-template-blocks/registry.json`
- Example item URL: `https://curiousbus.github.io/frontend-template-blocks/r/simple-hero.json`

## Install From Registry (after deployment)
```bash
shadcn add <registry-url>/r/simple-hero.json
```

## Current Phase
Phase 1 scaffold from issue #1:
- workspace + registry generation pipeline
- 6 starter blocks
- lint/typecheck/test/smoke script baseline
- changesets + release/deploy workflows
