# frontend-template-blocks

Reusable frontend blocks/templates powered by `shadcn` registry + Base UI composition.

## Goals
- Publish reusable blocks/templates installable via `shadcn add`.
- Keep behavior and accessibility composable with Base UI primitives.
- Keep styling tokenized and portable.

## Requirements
- Node.js `>=20`
- `pnpm@10`
- Git
- Optional: GitHub CLI (`gh`) for issue/PR operations

## Project Structure
- `apps/registry`: static hosting output for registry JSON (`public/r`) and pages deployment artifacts.
- `apps/examples`: local Vite app for block preview and manual QA.
- `packages/blocks`: block source code + registry item manifests.
- `scripts`: quality gates, registry build, smoke install, release helpers.
- `registry.json`: generated root shadcn registry manifest.

## First-Time Setup
```bash
pnpm install
pnpm run build:registry
pnpm run check
```

Notes:
- `pnpm install` runs `prepare` and enables Husky hooks automatically.
- If hooks are missing locally, run `pnpm run prepare`.

## Local Development
```bash
pnpm run dev:examples
pnpm run storybook
```

Build commands:
```bash
pnpm run build:registry
pnpm run build:examples
pnpm run build:storybook
```

## Code Quality (Biome + Custom Checks)
```bash
pnpm run format        # biome check --write .
pnpm run lint          # biome + registry integrity checks
pnpm run typecheck
pnpm run test
pnpm run check         # repo standard quality gate
```

Visual regression:
```bash
pnpm exec playwright install chromium
pnpm run visual:update
pnpm run visual:test
```

## Git Hooks and Commit Rules
This repository uses:
- `husky` for Git hooks
- `lint-staged` for staged-file checks
- `biome` for unified lint/format
- `commitlint` + Conventional Commits for commit message validation

Active hooks:
- `pre-commit`: `pnpm exec lint-staged`
- `commit-msg`: `pnpm exec commitlint --edit "$1"`

If commit is blocked:
1. Run `pnpm run format`
2. Re-stage files
3. Commit again

Commit examples:
- `feat(blocks): add feature-comparison block`
- `fix(registry): clean stale output before build`
- `docs(readme): add contributor setup guide`

## Contribution Workflow
1. Create or pick an issue first (issue-first workflow).
2. Create a branch from `main` with prefix `codex/` (for example `codex/add-feature-comparison`).
3. Implement changes with tests/docs.
4. Run `pnpm run check` (and `pnpm run visual:test` if UI is affected).
5. Push branch and open PR; include `Closes #<issue-number>` in PR body.
6. Merge and close the issue.

## Adding a New Block Checklist
1. Add component in `packages/blocks/src/<block-name>.tsx`.
2. Add registry item in `packages/blocks/registry/<block-name>.json`.
3. Export in `packages/blocks/src/index.ts`.
4. Add Storybook story in `packages/blocks/src/stories`.
5. Update examples app if needed.
6. Update visual test coverage in `tests/visual/blocks.spec.ts`.
7. Run `pnpm run build:registry` and `pnpm run smoke:install`.

## Consumer Guide
1. Initialize shadcn in your project (if not already done).
2. Install block by item URL:

```bash
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/cta-banner.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/hero-split.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/sidebar-navigation.json
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/auth-sign-in.json
```

3. Discover all items:
- `https://curiousbus.github.io/frontend-template-blocks/registry.json`

## Hosting and Release
- Deploy workflow: `.github/workflows/deploy-registry.yml`
- CI workflow: `.github/workflows/ci.yml`
- Visual regression workflow: `.github/workflows/visual-regression.yml`
- Release workflow: `.github/workflows/release.yml`

GitHub Pages endpoints:
- Site root (Storybook): `https://curiousbus.github.io/frontend-template-blocks/`
- Registry entrypoint: `https://curiousbus.github.io/frontend-template-blocks/registry.json`
- Registry items: `https://curiousbus.github.io/frontend-template-blocks/r/<item>.json`

## Auth Sign-In (Composable + Better Auth)
Install:

```bash
shadcn add https://curiousbus.github.io/frontend-template-blocks/r/auth-sign-in.json
```

Composable usage:

```tsx
import {
  AuthSignInCard,
  AuthSignInHeader,
  AuthSignInContent,
  AuthProviderGroup,
  AuthGoogleButton,
  AuthAppleButton,
  AuthSeparator,
  AuthEmailPasswordForm,
  AuthFooter,
} from "@ftb/blocks";

export function SignInView() {
  return (
    <AuthSignInCard>
      <AuthSignInHeader
        title="Welcome back"
        description="Continue with social sign-in or email/password."
      />
      <AuthSignInContent className="grid gap-6">
        <AuthProviderGroup>
          <AuthGoogleButton onProviderSignIn={() => {}} />
          <AuthAppleButton onProviderSignIn={() => {}} />
        </AuthProviderGroup>
        <AuthSeparator />
        <AuthEmailPasswordForm onSubmitCredentials={() => {}} />
        <AuthFooter>
          New here?{" "}
          <a href="/sign-up" className="underline underline-offset-4">
            Create account
          </a>
        </AuthFooter>
      </AuthSignInContent>
    </AuthSignInCard>
  );
}
```

Better Auth client wiring:

```tsx
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
authClient.signIn.social({ provider: "twitter", callbackURL: "/dashboard" }); // X
authClient.signIn.email({ email, password });
authClient.signIn.magicLink({ email, callbackURL: "/dashboard" });
```
