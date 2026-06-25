# Plan: LMX-32 — Fase 2 - Serviços / Works

**Task context**: `.specs/tasks/LMX-32-fase-2-servicos-works/task.context.md`
**Research**: `.specs/tasks/LMX-32-fase-2-servicos-works/research.md`

---

## Approach

A funcionalidade de serviços/works já está majoritariamente implementada no módulo `src/modules/works`, seguindo a arquitetura esperada do projeto: rotas finas, screens no módulo, hooks TanStack Query, service como fronteira de regra de negócio e repository como única camada com Drizzle. A implementação deve focar em completar/hardenizar lacunas encontradas: garantir invalidação aguardada em mutations de edição/exclusão, corrigir pequenos problemas de tipagem/nomenclatura e preservar o comportamento atual de listagem ativa, busca por nome, filtro por status, persistência SQLite e exclusão física com confirmação.

---

## Affected Components

| File | Action | Change |
|------|--------|--------|
| `src/modules/works/hooks/mutations/use-edit-work-mutation.ts` | Modify | Aguardar `queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })` no `onSuccess`, alinhando com `useCreateWorkMutation` e garantindo que o estado pending possa refletir o refetch quando necessário. |
| `src/modules/works/hooks/mutations/use-delete-work-mutation.ts` | Modify | Aguardar `queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })` no `onSuccess`, garantindo atualização das listas, detalhe e contadores após exclusão física. |
| `src/modules/works/screens/EditWorkScreen.tsx` | Modify | Corrigir a tipagem de `useLocalSearchParams` para `id: string`; adicionar tratamento defensivo para ID ausente ou inválido antes de buscar/editar/excluir, se necessário. |
| `src/modules/works/services/works.service.ts` | Modify | Renomear variável local `user` para `work` em `updateWork`; opcionalmente normalizar `description` em update para manter consistência com create, desde que não altere comportamento esperado. |
| `src/modules/works/repositories/works.repository.ts` | Reuse | Já implementa criação, listagem com `search` e `status`, busca por ID, atualização, exclusão física e contagem por status. Sem alteração planejada nesta fase. |
| `src/modules/works/screens/WorkListScreen.tsx` | Reuse | Já inicia filtro como `active`, garantindo que inativos não aparecem na lista ativa; usa busca por texto e filtros de status. Sem alteração planejada. |
| `src/modules/works/components/WorkForm.tsx` | Reuse | Já permite criar, editar e inativar serviço via toggle de status. Sem alteração planejada. |
| `src/modules/works/schemas/work.form.schema.ts` | Reuse | Já valida nome, descrição, preço e status com mensagens em português. Sem alteração planejada. |
| `src/app/(tabs)/works/index.tsx` | Reuse | Rota fina para listagem. Sem alteração planejada. |
| `src/app/works/create.tsx` | Reuse | Rota fina para criação. Sem alteração planejada. |
| `src/app/works/[id].tsx` | Reuse | Rota fina para edição. Sem alteração planejada. |
| `src/database/schemas/works.schema.ts` | Reuse | Schema SQLite existente suficiente para a task. Sem alteração planejada e sem nova migration. |

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Criar nova estrutura vs. ajustar módulo existente | Ajustar módulo existente `src/modules/works` | Research mostrou que CRUD, filtro, busca, persistência e UI já existem; reescrever aumentaria risco sem ganho. |
| Status padrão da lista | Manter padrão na UI (`WorkListScreen` inicia com `statusFilter: 'active'`) | Atende “serviço inativo não aparece em listas ativas” sem impor `active` a todos os consumidores de `worksService.findAllWorks`, preservando flexibilidade para filtros explícitos. |
| Inativação | Usar `updateWork` com `status: 'inactive'` | Schema e formulário já modelam `active`/`inactive`; não há necessidade de criar mutation separada para inativar. |
| Exclusão permanente | Manter `deleteWork` físico no repository e confirmação no `EditWorkScreen` via `ConfirmDialog` | Critério pede exclusão permanente após confirmação; já existe `db.delete(works)`. |
| Busca por nome | Manter `like(works.name, %search%)` nesta fase | Já atende busca parcial por nome. Case-insensitive garantido não foi explicitado no ticket e deve permanecer como questão/risco se necessário. |
| Testes automatizados | Não adicionar runner nesta fase de descoberta; planejar verificação por `bun run typecheck` e `bun run lint` | Projeto não possui script de testes configurado; adicionar infraestrutura de teste seria mudança maior e deve ser aprovado separadamente. |
| Migrações | Não gerar migration | Schema `works` já existe com todos os campos necessários. |

---

## Data Flow

### Criar serviço

```txt
Usuário acessa /works/create
  → src/app/works/create.tsx
    → CreateWorkScreen
      → WorkForm valida input via workFormSchema
      → useCreateWorkMutation.mutateAsync(data)
        → worksService.createWork(data)
          → validateCreateWork(data)
          → generateId() + timestamps ISO + status padrão active
          → worksRepository.createWork(workData)
            → db.insert(works).values(workData)
        → queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })
      → router.push('/works')
```

### Listar, buscar e filtrar serviços

```txt
Usuário acessa aba Serviços
  → src/app/(tabs)/works/index.tsx
    → WorkListScreen
      → statusFilter inicia como 'active'
      → searchText inicia vazio
      → useWorks({ status: statusFilter, search: searchText })
        → worksQueryOptions.findAll(filters)
          → worksService.findAllWorks(filters)
            → worksRepository.findAllWorks(filters)
              → Drizzle SELECT works
                 WHERE name LIKE %search% quando houver busca
                 AND status = filters.status quando houver status
                 ORDER BY works.name ASC
      → WorkListHeaderScreen renderiza SearchInput e FilterChips
      → WorkCard renderiza cada Work
```

### Editar ou inativar serviço

```txt
Usuário abre /works/[id]
  → src/app/works/[id].tsx
    → EditWorkScreen
      → useWork(id) carrega detalhe
      → WorkForm recebe defaultValues
      → usuário altera campos ou desativa toggle de status
      → useEditWorkMutation.mutateAsync({ id, data })
        → worksService.updateWork(id, data)
          → validateId(id)
          → validateUpdateWorkInput(data)
          → findWorkById(id) confirma existência
          → worksRepository.updateWork(id, { ...data, updatedAt })
        → queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })
      → router.push('/works')
```

### Excluir serviço permanentemente

```txt
Usuário abre /works/[id]
  → EditWorkScreen
    → WorkForm exibe botão Excluir Serviço quando há defaultValues.name
    → onDelete abre ConfirmDialog
    → usuário confirma
      → useDeleteWorkMutation.mutateAsync({ id })
        → worksService.deleteWork(id)
          → validateId(id)
          → findWorkById(id) confirma existência
          → worksRepository.deleteWork(id)
            → db.delete(works).where(eq(works.id, id))
        → queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })
      → router.push('/works')
```

---

## Implementation Steps

### Phase 1: Query invalidation consistency

1. **Await edit invalidation** (File: `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`)
   - Action: Alterar `onSuccess` para `await queryClient.invalidateQueries({ queryKey: worksQueryKeys.all });`.
   - Why: Garante consistência com a criação e cumpre explicitamente o critério “Queries são invalidadas após mutation”.
   - Dependencies: None.
   - Risk: Low.

2. **Await delete invalidation** (File: `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`)
   - Action: Alterar `onSuccess` para `await queryClient.invalidateQueries({ queryKey: worksQueryKeys.all });`.
   - Why: Garante atualização de listas, contadores e detalhes depois de exclusão permanente.
   - Dependencies: None.
   - Risk: Low.

### Phase 2: Defensive correctness

3. **Correct route param typing** (File: `src/modules/works/screens/EditWorkScreen.tsx`)
   - Action: Corrigir generic de `useLocalSearchParams` de `{ id: 'string' }` para `{ id: string }` e proteger fluxo caso `id` esteja ausente.
   - Why: Evita erro de tipagem e reduz risco em rotas dinâmicas.
   - Dependencies: None.
   - Risk: Medium, por envolver navegação e comportamento de tela.

4. **Clean service nomenclature** (File: `src/modules/works/services/works.service.ts`)
   - Action: Renomear variável `user` para `work` em `updateWork`; se mexer na normalização de update, preservar imutabilidade e não alterar campos não enviados.
   - Why: Remove ruído herdado de outro domínio e mantém semântica clara.
   - Dependencies: None.
   - Risk: Low.

### Phase 3: Verification

5. **Static verification** (Files: project-wide)
   - Action: Rodar `bun run typecheck` e `bun run lint`.
   - Why: Não há runner de teste configurado; esses são os gates existentes para validar tipagem, lint e formatação.
   - Dependencies: Requires steps 1-4.
   - Risk: Low.

6. **Manual smoke validation** (Flow: works UI)
   - Action: Validar manualmente no app: criar serviço, buscar por nome, filtrar ativo/inativo, editar, inativar e excluir após confirmação.
   - Why: Cobre critérios funcionais em ausência de E2E automatizado.
   - Dependencies: Requires app running and steps 1-4.
   - Risk: Medium, por depender de ambiente local Expo/SQLite.

---

## Testing Strategy

- Unit tests: Não há infraestrutura de testes configurada no `package.json`; não criar comandos fictícios. Se aprovado adicionar testes, priorizar service (`works.service`) e schema (`work.form.schema`) com runner a definir.
- Integration tests: Sem runner configurado. Futuramente, cobrir `worksRepository` com SQLite de teste ou abstração compatível.
- E2E/manual: Criar serviço, listar somente ativos, buscar por nome, filtrar por status, editar, inativar, confirmar exclusão e verificar persistência após recarregar o app.
- Static checks: `bun run typecheck` e `bun run lint`.

---

## Risks

- **Busca case-insensitive não garantida explicitamente**: `like` pode depender de comportamento/collation do SQLite.
  - Mitigation: Manter fora do escopo até confirmação; se exigido, planejar comparação normalizada com `lower()`/collation adequada.
- **Sem suíte de testes automatizados**: Critérios dependem de verificação manual e checks estáticos.
  - Mitigation: Rodar `typecheck`/`lint` e documentar smoke test manual; propor infraestrutura de testes em task separada se necessário.
- **Futura entidade de notas pode referenciar works**: Exclusão física pode precisar de restrição quando notas existirem.
  - Mitigation: Para esta fase, manter exclusão física conforme ticket; revisar quando o domínio de notas for implementado.
- **ID de rota ausente/inválido**: Pode causar query com ID inválido.
  - Mitigation: Corrigir tipagem e adicionar fallback defensivo em `EditWorkScreen`.

---

## Success Criteria

- [ ] Usuário consegue criar serviço com nome, descrição opcional, preço e status.
- [ ] Lista principal exibe serviços ativos por padrão.
- [ ] Usuário consegue buscar serviço por nome na lista.
- [ ] Usuário consegue filtrar serviços por status ativo/inativo.
- [ ] Usuário consegue editar serviço existente.
- [ ] Usuário consegue inativar serviço via edição de status.
- [ ] Usuário consegue excluir serviço fisicamente após confirmação.
- [ ] Dados são persistidos na tabela SQLite `works` via Drizzle.
- [ ] Mutations de criação, edição e exclusão invalidam `worksQueryKeys.all` e aguardam a invalidação quando aplicável.
- [ ] UI permanece em português e código mantém nomenclatura `Work`/`works`.
- [ ] `bun run typecheck` passa.
- [ ] `bun run lint` passa.
