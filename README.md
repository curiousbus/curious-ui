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

## Storybook
```bash
pnpm run storybook
pnpm run build:storybook
```

## Examples App
```bash
pnpm run dev:examples
pnpm run build:examples
pnpm run preview:examples
```

## Visual Regression
```bash
pnpm exec playwright install chromium
pnpm run visual:update
pnpm run visual:test
```

GitHub workflow: `.github/workflows/visual-regression.yml`

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
- One-time setup: enable GitHub Pages in repo settings (`Settings -> Pages`) and select GitHub Actions as the source.

## Use This Registry (Consumer Guide)
1. Initialize shadcn in your project (if you have not done it yet).
2. Install a block by item URL:

```bash
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/simple-hero.json
```

3. Swap the item filename to install other blocks:

```bash
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/feature-grid.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/pricing-cards.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/testimonial-wall.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/stats-strip.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/cta-banner.json
```

4. Browse available links from the homepage: `https://curiousbus.github.io/frontend-template-blocks/`

## Current Phase
Phase 1 scaffold from issue #1 + issue #6:
- workspace + registry generation pipeline
- 6 starter blocks
- lint/typecheck/test/smoke script baseline
- changesets + release/deploy workflows
- Storybook + examples app + Playwright visual regression
