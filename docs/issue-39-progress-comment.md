Progress update for #39:

- Implemented registration block `auth-sign-up` (component/story/registry/export)
- Implemented API-driven table block `data-table` with typed contract:
  - search + sort + pagination query model
  - iconized row actions
  - edit/delete integration hooks
  - loading/error/empty states
- Added deep interface design doc `docs/api-registration-data-table.md`
- Updated examples app and README
- Validation passed: `pnpm run format` and `pnpm run check`

PR branch: `codex/issue-39-registration-table`
Commit: `3e2744d`
