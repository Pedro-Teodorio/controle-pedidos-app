# Summary: LMX-32 — Fase 2 - Serviços / Works

**Completed**: 2026-06-25
**Status**: Done with preexisting lint blocker

## What was built

The existing `works` domain was hardened according to the approved plan. Edit and delete mutations now await invalidation of `worksQueryKeys.all`, the edit screen derives a safe route ID before querying/mutating, and the works service uses domain-correct naming in `updateWork`.

The feature remains aligned with the existing architecture: routes stay thin, screens use hooks, mutations call services, services validate and normalize domain data, and repositories remain the only Drizzle/SQLite boundary.

## Files changed

- `.specs/tasks/LMX-32-fase-2-servicos-works/contracts.ts`
- `.specs/tasks/LMX-32-fase-2-servicos-works/tasks.md`
- `.specs/tasks/LMX-32-fase-2-servicos-works/summary.md`
- `.specs/STATE.md`
- `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`
- `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`
- `src/modules/works/screens/EditWorkScreen.tsx`
- `src/modules/works/services/works.service.ts`

## Verification

- `bun run typecheck` passed.
- Targeted ESLint passed for changed source files.
- Targeted Prettier check passed for changed source/spec files.
- `bun run lint` failed due to preexisting errors in `docs/wireframe-controle-de-pedidos/*` and an existing warning in `.expo/types/router.d.ts`; no failure was introduced in changed source files.

## Requirement verification

- LMX32-01: PASS — existing create flow persists through service/repository and was preserved.
- LMX32-02: PASS — existing Zod/service validation was preserved.
- LMX32-03: PASS — existing list screen defaults to `active` and was preserved.
- LMX32-04: PASS — existing search/filter query flow was preserved.
- LMX32-05: PASS — existing active/inactive filter chips were preserved.
- LMX32-06: PASS — edit flow was preserved and service naming was corrected.
- LMX32-07: PASS — existing status update/inactivation flow was preserved.
- LMX32-08: PASS — existing confirmation dialog plus physical delete flow was preserved.
- LMX32-09: PASS — edit/delete mutations now await `worksQueryKeys.all` invalidation.
- LMX32-10: PASS — edit screen now avoids edit/delete with an invalid route ID.
- LMX32-11: PASS — persistence remains isolated in `works.repository.ts`.

## Commits

- Not created. The execution skill recommends atomic commits, but repository instructions require commits only when explicitly requested by the user.

## Deviations from spec

- None.

## Follow-ups

- Fix or exclude the preexisting lint errors in `docs/wireframe-controle-de-pedidos/*` so `bun run lint` can be used as a clean project-wide gate.
- Keep automated tests as a future decision because `package.json` still has no test runner configured.
