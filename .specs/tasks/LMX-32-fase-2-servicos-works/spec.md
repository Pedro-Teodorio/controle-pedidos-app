# Spec: LMX-32 — Fase 2 - Serviços / Works

**Plan**: `.specs/tasks/LMX-32-fase-2-servicos-works/plan.md`
**Status**: Draft

---

## Functional Requirements

### [LMX32-01] — Criar serviço

WHEN o usuário enviar o formulário de criação em `/works/create` com `name` válido, `price` válido, `description` opcional e `status` válido ou ausente
THEN the system SHALL persist a new `Work` in SQLite table `works`
AND the persisted record SHALL have generated `id`, ISO `createdAt`, ISO `updatedAt`, trimmed `name`, normalized `description`, numeric `price`, and `status` defaulting to `active` when omitted
AND the UI SHALL navigate back to `/works` after a successful mutation
AND the code SHALL use `Work`/`works` naming while visible UI text remains in Portuguese.

**Verified by**: manual smoke test for creating a service; static verification with `bun run typecheck` and `bun run lint`.

---

### [LMX32-02] — Validar criação de serviço

WHEN the create flow receives an empty `name`, non-finite `price`, or negative `price`
THEN the system SHALL reject the submission before persistence
AND the UI SHALL show validation/error messages in Portuguese
AND the repository SHALL NOT insert a new `works` row for invalid data.

**Verified by**: manual smoke test with invalid form inputs; static verification.

---

### [LMX32-03] — Listar serviços ativos por padrão

WHEN the user opens the Serviços tab
THEN the screen SHALL request works with `status: 'active'`
AND the rendered list SHALL NOT include works whose `status` is `inactive`
AND the list SHALL be ordered by work name ascending according to repository query behavior.

**Verified by**: manual smoke test with at least one active and one inactive service.

---

### [LMX32-04] — Buscar serviço por nome

WHEN the user types text in the service search input
THEN the screen SHALL query works with the current `search` text and current `status` filter
AND the repository SHALL apply a partial name match using the service name field
AND the rendered list SHALL contain only works matching the active search/filter combination.

**Verified by**: manual smoke test searching by partial service name.

---

### [LMX32-05] — Filtrar serviços por status

WHEN the user selects the `Ativo` status filter
THEN the screen SHALL render only works with `status: 'active'`.

WHEN the user selects the `Inativo` status filter
THEN the screen SHALL render only works with `status: 'inactive'`.

AND the status filter labels SHALL be displayed in Portuguese.

**Verified by**: manual smoke test toggling status chips.

---

### [LMX32-06] — Editar serviço

WHEN the user submits the edit form for an existing work ID with valid fields
THEN the system SHALL update the matching `works` row in SQLite
AND the update SHALL set a new ISO `updatedAt`
AND the system SHALL preserve fields not included in the update input according to current repository update behavior
AND the UI SHALL navigate back to `/works` after a successful mutation.

**Verified by**: manual smoke test editing name, description, price and status.

---

### [LMX32-07] — Inativar serviço

WHEN the user disables the status toggle in the edit form and submits it for an existing work
THEN the system SHALL persist `status: 'inactive'` for that work
AND the work SHALL disappear from the default active list
AND the work SHALL appear when the `Inativo` filter is selected.

**Verified by**: manual smoke test inactivating a service and checking active/inactive filters.

---

### [LMX32-08] — Excluir serviço fisicamente após confirmação

WHEN the user presses `Excluir Serviço` in the edit screen
THEN the UI SHALL open a confirmation dialog before deletion.

WHEN the user confirms deletion in the confirmation dialog
THEN the system SHALL physically delete the matching row from SQLite table `works`
AND the UI SHALL navigate back to `/works` after successful deletion.

WHEN the user cancels the confirmation dialog
THEN the system SHALL NOT delete the work.

**Verified by**: manual smoke test confirming and canceling deletion.

---

### [LMX32-09] — Invalidar queries após mutations

WHEN create, edit, or delete mutation succeeds
THEN the mutation hook SHALL invalidate TanStack Query queries using `worksQueryKeys.all`
AND edit/delete invalidation SHALL be awaited or returned so pending state can consistently represent refetch completion when needed.

**Verified by**: code review of `use-create-work-mutation.ts`, `use-edit-work-mutation.ts`, and `use-delete-work-mutation.ts`; static verification.

---

### [LMX32-10] — Tratar ID de rota de edição

WHEN the edit screen receives a valid route parameter `id`
THEN the screen SHALL use that ID to load, edit, and delete the work.

WHEN the edit screen does not receive a valid string `id`
THEN the screen SHALL avoid executing edit/delete mutations with an invalid ID
AND the UI SHALL fail safely instead of crashing due to route parameter typing.

**Verified by**: static verification and manual navigation to an edit route.

---

### [LMX32-11] — Persistir dados no SQLite via camadas corretas

WHEN any create, list, search, filter, edit, inactivate, or delete operation needs persisted data
THEN the domain SHALL access Drizzle/SQLite only through `src/modules/works/repositories/works.repository.ts`
AND screens, components, hooks, and services SHALL NOT import `db` directly.

**Verified by**: code review and static verification.

---

## Edge Cases

| Scenario | Expected behavior |
|----------|-------------------|
| Create form submitted with blank name | Reject submission with Portuguese validation message; no database insert. |
| Create/edit form submitted with non-numeric price | Reject submission with Portuguese validation message; no invalid price persisted. |
| Create/edit form submitted with negative price | Reject submission with Portuguese validation message; no invalid price persisted. |
| Description submitted as empty string | Normalize to `null` in form/create flow. |
| Create submitted without status | Persist service with `status: 'active'`. |
| Default services list has inactive records in database | Inactive records are not rendered while current filter is `active`. |
| Search text has leading/trailing spaces | Search should use the trimmed value in repository filtering. |
| Search returns no records | Render empty/search state instead of crashing. |
| Status filter is active and search matches only inactive records | Render empty/search state; do not show inactive records. |
| Editing a missing or deleted work ID | Service rejects with `Work ID <id> não encontrado`; UI shows an error path instead of persisting changes. |
| Edit route parameter is absent or invalid | Screen does not execute edit/delete with invalid ID and fails safely. |
| User opens delete dialog and cancels | Work remains persisted. |
| Delete succeeds | Work is physically removed and queries are invalidated. |
| Delete target no longer exists | Service rejects with `Work ID <id> não encontrado`; UI shows deletion error. |
| Query/load failure | List screen renders `ErrorState` with Portuguese message and retry action. |
| Mutation failure | Create/edit/delete screens show Portuguese `Alert` error messages. |
| No automated test runner exists | Do not invent a test command; use `bun run typecheck`, `bun run lint`, and manual smoke validation unless test infrastructure is explicitly approved. |

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Criar novo módulo de serviços do zero | O módulo `src/modules/works` já existe e atende à arquitetura. |
| Nova tabela ou migration de banco | Schema `works` já possui os campos necessários. |
| Status além de `active` e `inactive` | Ticket não solicita outros estados e schema atual limita o enum. |
| Garantia explícita de busca case-insensitive | Ticket só exige busca por nome; comportamento case-insensitive deve ser confirmado antes de alterar query/collation. |
| Bloqueio de exclusão por vínculo com notas | Domínio de notas não foi identificado como implementado nesta task; revisar quando notas referenciem works. |
| Adicionar infraestrutura de testes automatizados | Projeto não possui runner/script de testes; adicionar ferramenta deve ser decisão separada. |
| Alterações visuais amplas | A UI existente já segue português e padrões compartilhados. |

---

## Requirement Traceability

| ID | Short name | Status |
|----|------------|--------|
| LMX32-01 | Criar serviço | Pending |
| LMX32-02 | Validar criação | Pending |
| LMX32-03 | Listar ativos por padrão | Pending |
| LMX32-04 | Buscar por nome | Pending |
| LMX32-05 | Filtrar por status | Pending |
| LMX32-06 | Editar serviço | Pending |
| LMX32-07 | Inativar serviço | Pending |
| LMX32-08 | Excluir após confirmação | Pending |
| LMX32-09 | Invalidar queries | Pending |
| LMX32-10 | Tratar ID de rota | Pending |
| LMX32-11 | Persistência via repository | Pending |
