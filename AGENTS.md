# AGENTS.md

## Purpose
Repository execution policy for all coding agents and collaborators.

## Issue-First Workflow (Mandatory)
1. Before any code change, create or identify a GitHub Issue for that work.
2. Do not start implementation until an Issue ID exists.
3. Every PR must include an explicit issue reference (`Refs #<id>` or `Closes #<id>`).
4. Before merge, verify the PR is linked to an issue and the issue has progress context.
5. If an urgent fix is pushed before issue creation, create a retroactive issue the same day and link commit/PR.

## Git/GitHub Execution Rules
1. Use feature branches for all changes. Avoid direct commits to `main` unless explicitly requested.
2. Keep commits scoped to the issue objective.
3. Run relevant validation before PR (tests/build/lint as applicable).
4. After merge, update the linked issue with outcome and close it when complete.

## Enforcement Checklist
- [ ] Issue exists before implementation
- [ ] Branch created for change
- [ ] PR created with issue reference
- [ ] Validation evidence included in PR
- [ ] Issue commented/closed after merge
