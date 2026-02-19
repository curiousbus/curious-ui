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

## Install From Registry (after deployment)
```bash
shadcn add <registry-url>/r/simple-hero.json
```

## Current Phase
Phase 1 scaffold from issue #1:
- workspace + registry generation pipeline
- 6 starter blocks
- lint/typecheck/test/smoke script baseline
- changesets config
