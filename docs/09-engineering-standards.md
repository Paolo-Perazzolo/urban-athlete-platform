# Engineering Standards

## Purpose
These rules define how we write and maintain code in this repository so delivery stays fast, readable, and scalable.

## Core principles
- Keep solutions simple and explicit.
- Prefer small, testable steps over large rewrites.
- Match existing project style unless there is an approved refactor.
- Avoid dead code, duplicate logic, and hidden side effects.

## Project structure
- Route pages live in `app/src/routes/...`.
- Reusable UI components live in `app/src/lib/components/...`.
- Shared utilities live in `app/src/lib/utils/...`.
- SQL migrations live in `app/supabase/migrations/...`.
- Documentation lives in `docs/...`.

## File size and complexity limits
- Target max file length: **300 lines**.
- Hard warning threshold: **450 lines** (refactor required in next iteration).
- Keep functions focused; target max **40 lines per function**.
- If a component handles >2 major concerns (data, map, modal, forms), split logic into helpers/components.

## Naming conventions
- Svelte components: `PascalCase.svelte` (e.g. `SpotCard.svelte`).
- Route files: SvelteKit conventions (`+page.svelte`, `+layout.svelte`, etc.).
- JS variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE`.
- DB columns/tables: `snake_case`.
- Boolean names should read as predicates (`isLoading`, `hasError`, `canSubmit`).

## UI and frontend rules
- Mobile-first layout by default.
- Preserve current design language (neutral palette, existing card/button system).
- Every async state must have loading, error, and empty-state UI.
- Add basic accessibility support for interactive controls (labels, keyboard support, `aria-label` where needed).

## Data and API rules
- Validate and coerce external data before rendering.
- Escape untrusted content if injecting HTML.
- Avoid silent failures: surface clear user-facing errors.
- Do not block UI on non-critical operations.

## Git and delivery workflow
- Work on `dev` branch.
- Keep commits atomic and message them by intent.
- Push small increments that can be manually tested.

## Mandatory docs rule before pushing to `dev`
Before any push to `dev`, update documentation if code changes affect architecture, behavior, scope, workflows, or data model.

Minimum required checks before push:
1. Update affected docs in `docs/`.
2. Append decision note in `docs/05-decisions-log.md`.
3. If process/rules changed, update this file (`docs/09-engineering-standards.md`) and/or `.windsurf/workflows/update-docs.md`.

## PR / change checklist
- [ ] Feature works on desktop and mobile
- [ ] No obvious console/runtime errors
- [ ] Loading/error/empty states present
- [ ] Naming and file structure follow standards
- [ ] Docs updated when required
