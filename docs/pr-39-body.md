## Summary
- add new `auth-sign-up` block with validation + async submit callbacks
- add new `data-table` block with typed API contracts for search/sort/pagination and icon row actions
- add Storybook stories and registry entries for both blocks
- update exports, README consumer docs, and examples app
- add interface design doc for backend integration

## Main Design Files
- `packages/blocks/src/auth-sign-up.tsx`
- `packages/blocks/src/data-table.tsx`
- `docs/api-registration-data-table.md`

## Validation
- `pnpm run format`
- `pnpm run check`

Closes #39
