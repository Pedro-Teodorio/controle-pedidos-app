# Tasks: LMX-32 — Fase 2 - Serviços / Works

**Spec**: `.specs/tasks/LMX-32-fase-2-servicos-works/spec.md`
**Contracts**: `.specs/tasks/LMX-32-fase-2-servicos-works/contracts.ts`

---

## Dependency Graph

```txt
T1 ─┬─→ T3 ─→ T5
    ├─→ T4 ─→ T5
    └─→ T2 ─→ T5
```

---

## T1 · Await works mutation invalidations

**What**: Update edit/delete mutations so successful mutations await invalidation of `worksQueryKeys.all`.
**Where**: `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`, `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`
**Depends on**: —
**Reuses**: `useCreateWorkMutation` invalidation pattern.
**Contracts**: `EditWorkMutationContractInput`, `DeleteWorkMutationContractInput`, `QueryInvalidationContract`
**Done when**: Both `onSuccess` handlers await `queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })`.
**Tests**: no runner configured; static verification only.
**Gate**: `bun run typecheck`
**Req**: LMX32-09

---

## T2 · Correct edit route ID handling

**What**: Correct `useLocalSearchParams` typing and ensure edit/delete do not run when route ID is absent or invalid.
**Where**: `src/modules/works/screens/EditWorkScreen.tsx`
**Depends on**: —
**Reuses**: Existing `Alert.alert`, `useWork`, `useEditWorkMutation`, `useDeleteWorkMutation` screen pattern.
**Contracts**: `EditWorkRouteParamsContract`
**Done when**: The screen derives a safe string ID, uses it for query/edit/delete, and shows a safe Portuguese error path for invalid route params.
**Tests**: no runner configured; static verification only.
**Gate**: `bun run typecheck`
**Req**: LMX32-10

---

## T3 · Clean works service nomenclature

**What**: Rename the misleading local `user` variable in `updateWork` to `work` without changing behavior.
**Where**: `src/modules/works/services/works.service.ts`
**Depends on**: —
**Reuses**: Existing service validation and repository call flow.
**Contracts**: `WorksServiceContract`, `UpdateWorkContractInput`
**Done when**: `updateWork` uses domain-correct naming and still validates existence before update.
**Tests**: no runner configured; static verification only.
**Gate**: `bun run typecheck`
**Req**: LMX32-06, LMX32-11

---

## T4 · Verify existing works flows against approved spec

**What**: Confirm existing implementation still satisfies create, list active, search, status filter, inactivate, delete confirmation and persistence boundaries.
**Where**: `src/modules/works`, `src/app/works`, `src/database/schemas/works.schema.ts`
**Depends on**: T1, T2, T3
**Reuses**: Existing module architecture identified in `research.md`.
**Contracts**: all contracts
**Done when**: No extra code changes are needed beyond T1-T3, and full static gates pass.
**Tests**: static verification plus code review due to absent runner.
**Gate**: `bun run typecheck` and `bun run lint`
**Req**: LMX32-01, LMX32-02, LMX32-03, LMX32-04, LMX32-05, LMX32-07, LMX32-08, LMX32-11

---

## T5 · Final documentation artifacts

**What**: Update task status and write execution summary.
**Where**: `.specs/tasks/LMX-32-fase-2-servicos-works/tasks.md`, `.specs/tasks/LMX-32-fase-2-servicos-works/summary.md`, `.specs/STATE.md`
**Depends on**: T1, T2, T3, T4
**Reuses**: `linear-spec-flow` summary template.
**Contracts**: all contracts
**Done when**: `summary.md` records implementation, verification, deviations and follow-ups.
**Tests**: documentation only.
**Gate**: final diff review
**Req**: all

---

## Status

| Task | Status                             | Gate                                                                                                                                               | Commit        |
| ---- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| T1   | Done                               | `bun run typecheck` passed                                                                                                                         | Not committed |
| T2   | Done                               | `bun run typecheck` passed                                                                                                                         | Not committed |
| T3   | Done                               | `bun run typecheck` passed                                                                                                                         | Not committed |
| T4   | Done with preexisting lint blocker | `bun run typecheck` passed; targeted ESLint/Prettier passed; global `bun run lint` blocked by existing `docs/wireframe-controle-de-pedidos` errors | Not committed |
| T5   | Done                               | final diff review completed                                                                                                                        | Not committed |
