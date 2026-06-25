# Research: LMX-32

## Relevant Files

| File | What it does | Relevant because |
|------|-------------|-----------------|
| `src/modules/works/types/works.types.ts` | Define `Work`, inputs de criação/edição, filtros e tipos de status. | A task exige código em inglês com `Work`/`works`, filtro por status e operações CRUD sobre serviço. |
| `src/database/schemas/works.schema.ts` | Declara tabela SQLite `works` com `id`, `name`, `description`, `price`, `status`, `createdAt` e `updatedAt`. | Confirma persistência SQLite/Drizzle já estruturada e status `active`/`inactive`. |
| `src/database/client.ts` | Registra o schema `works` no client Drizzle/Expo SQLite. | Confirma que não é necessário criar novo schema nem registrar tabela para esta task. |
| `src/modules/works/repositories/works.repository.ts` | Encapsula Drizzle para criar, listar com filtros, buscar por ID, atualizar, excluir fisicamente e contar por status. | Já cobre persistência, busca por nome, filtro por status, exclusão física e contadores. |
| `src/modules/works/services/works.service.ts` | Valida input, normaliza dados, gera ID/timestamps e chama repository. | É a fronteira de regra de negócio para criar, editar, listar, buscar e excluir serviços. |
| `src/modules/works/hooks/works.query-keys.ts` | Centraliza query keys do domínio `works`. | Mutations devem invalidar `worksQueryKeys.all`; filtros entram na chave de listagem. |
| `src/modules/works/hooks/queries/works.query-options.ts` | Centraliza `queryOptions` para listagem, detalhe e contagem por status. | Segue padrão TanStack Query v5 exigido pelo projeto. |
| `src/modules/works/hooks/queries/use-works.ts` | Expõe hooks `useWorks`, `useWork` e `useWorksCountByStatus`. | É a camada usada por screens para buscar lista ativa/filtrada e detalhe. |
| `src/modules/works/hooks/mutations/use-create-work-mutation.ts` | Mutation de criação chamando service e invalidando `worksQueryKeys.all`. | Atende ao critério de invalidar queries após criar. |
| `src/modules/works/hooks/mutations/use-edit-work-mutation.ts` | Mutation de edição chamando service e invalidando `worksQueryKeys.all`. | Atende ao critério de invalidar queries após editar, mas não aguarda o `invalidateQueries`. |
| `src/modules/works/hooks/mutations/use-delete-work-mutation.ts` | Mutation de exclusão física chamando service e invalidando `worksQueryKeys.all`. | Atende exclusão permanente após confirmação, mas não aguarda o `invalidateQueries`. |
| `src/modules/works/schemas/work.form.schema.ts` | Schema Zod do formulário com validação de nome, descrição, preço e status. | Garante validação de UI em português e transformação de preço/descrição. |
| `src/modules/works/components/WorkForm.tsx` | Formulário React Hook Form/Zod com campos e toggle de status ativo. | Permite criar, editar e inativar serviço pela UI. |
| `src/modules/works/components/WorkCard.tsx` | Card da lista com nome, descrição, preço, badge de status e ação editar. | Exibe serviços listados e evidencia status. |
| `src/modules/works/components/WorkListHeaderScreen.tsx` | Cabeçalho da lista com busca, chips de status e ação criar. | Implementa busca por nome e filtro por status na UI. |
| `src/modules/works/screens/WorkListScreen.tsx` | Tela de listagem com filtro inicial `active`, busca, contadores, estados de loading/erro/vazio e navegação. | Garante que serviços inativos não aparecem por padrão na lista ativa. |
| `src/modules/works/screens/CreateWorkScreen.tsx` | Tela fina do módulo para criar serviço e navegar de volta para `/works`. | Cobre criação via UI. |
| `src/modules/works/screens/EditWorkScreen.tsx` | Tela para buscar serviço, editar e excluir com `ConfirmDialog`. | Cobre edição e exclusão permanente após confirmação. Também permite inativação via formulário. |
| `src/app/(tabs)/works/index.tsx` | Rota fina de aba que renderiza `WorkListScreen`. | Confirma padrão Expo Router com rota delegando para screen do módulo. |
| `src/app/works/create.tsx` | Rota fina para criação. | Confirma navegação `/works/create`. |
| `src/app/works/[id].tsx` | Rota dinâmica fina para edição. | Confirma navegação `/works/:id`. |
| `src/app/works/_layout.tsx` | Stack layout sem header para rotas de works. | Confirma estrutura de navegação do domínio. |

## Identified Conventions

**Arquitetura de módulo**: `src/modules/works` concentra `components`, `screens`, `hooks`, `repositories`, `services`, `schemas` e `types`. Rotas em `src/app` são finas e apenas importam screens do módulo.

**Persistência**: repositories são a única camada do domínio que importa `db` e schemas Drizzle. Services não acessam Drizzle diretamente.

**Service pattern**: funções internas em camelCase, exportadas em objeto `worksService`. Services validam invariantes, normalizam strings, definem status padrão, geram UUID via `generateId()` e timestamps ISO.

**Repository pattern**: funções internas em camelCase, exportadas em objeto `worksRepository`; queries usam Drizzle (`eq`, `and`, `like`, `asc`, `count`). Erros são logados com prefixo e relançados.

**Error handling**: atualmente usa `throw new Error(...)` em services e `try/catch` em repositories/screens. Screens exibem `Alert.alert` para falhas de criação/edição/exclusão e `ErrorState` para falha de listagem.

**TanStack Query**: usa factory de query keys (`worksQueryKeys`), `queryOptions` para centralizar `queryKey`, `queryFn`, `staleTime` e `gcTime`, hooks pequenos com `useQuery`, e mutations chamando services.

**Invalidation pattern**: `useCreateWorkMutation` aguarda `queryClient.invalidateQueries`, enquanto `useEditWorkMutation` e `useDeleteWorkMutation` chamam sem `await`. A regra do projeto recomenda retornar/aguardar invalidations quando o estado pending precisar aguardar refetch.

**Form pattern**: UI usa React Hook Form com `Controller`, `zodResolver` e schema em `src/modules/works/schemas`. Mensagens são em português. Campos opcionais são normalizados no schema.

**Naming**: UI e mensagens usam português (`Serviços`, `Criar serviço`, `Erro ao...`); código usa `Work`, `works`, `CreateWorkInput`, `FindAllWorksFilters`.

**Tests**: não há arquivos `*.spec.ts`, `*.test.ts`, `*.spec.tsx` ou `*.test.tsx` encontrados. `package.json` não possui script de teste; os comandos de verificação disponíveis são `bun run typecheck` e `bun run lint`.

## Reusable Code

| Code | Location | How to use |
|------|----------|------------|
| `worksRepository.findAllWorks(filters)` | `src/modules/works/repositories/works.repository.ts` | Lista serviços aplicando `search` por nome e `status`. |
| `worksRepository.updateWork(id, data)` | `src/modules/works/repositories/works.repository.ts` | Atualiza dados do serviço, incluindo mudança de status para inativar. |
| `worksRepository.deleteWork(id)` | `src/modules/works/repositories/works.repository.ts` | Exclui fisicamente o registro da tabela `works`. |
| `worksRepository.countWorksByStatusSummary()` | `src/modules/works/repositories/works.repository.ts` | Alimenta contadores dos filtros `Ativo` e `Inativo`. |
| `worksService.createWork(data)` | `src/modules/works/services/works.service.ts` | Cria serviço com ID e timestamps. |
| `worksService.updateWork(id, input)` | `src/modules/works/services/works.service.ts` | Edita serviço e permite inativação via `status: 'inactive'`. |
| `worksService.deleteWork(id)` | `src/modules/works/services/works.service.ts` | Valida existência e executa exclusão física. |
| `WorkForm` | `src/modules/works/components/WorkForm.tsx` | Reutilizado por criação e edição; toggle controla status ativo/inativo. |
| `ConfirmDialog` | `src/shared/components/ConfirmDialog` | Já usado em `EditWorkScreen` para confirmação antes de exclusão permanente. |
| `FilterChips` | `src/shared/components/FilterChips` | Já usado no cabeçalho para filtrar por status. |
| `SearchInput` | `src/shared/ui/SearchInput` | Já usado para busca textual por serviço. |

## Existing Pattern to Follow

A feature de `works` já está majoritariamente implementada seguindo o padrão esperado do projeto:

1. Rotas Expo Router finas em `src/app/(tabs)/works/index.tsx`, `src/app/works/create.tsx` e `src/app/works/[id].tsx`.
2. Screens do módulo orquestram navegação, hooks e componentes.
3. Components são visuais e recebem callbacks por props.
4. Hooks de query usam `worksQueryOptions` e `worksQueryKeys`.
5. Mutations chamam `worksService` e invalidam `worksQueryKeys.all`.
6. Service valida/normaliza e chama repository.
7. Repository encapsula Drizzle/SQLite.

## Gaps — What Needs to be Created or Adjusted

- Não há necessidade aparente de criar novas rotas, schema ou tabela: a estrutura de `works` já existe.
- `useEditWorkMutation` e `useDeleteWorkMutation` devem aguardar ou retornar `queryClient.invalidateQueries(...)` para manter consistência com `useCreateWorkMutation` e com a orientação do projeto.
- `EditWorkScreen` usa `useLocalSearchParams<{ id: 'string' }>()`, o que parece tipagem incorreta; deve ser avaliado para `id: string` e fallback quando `id` vier ausente/array.
- `worksService.updateWork` usa variável local chamada `user` ao buscar um `Work`; é ruído de nomenclatura e deve ser corrigido para `work` se houver alteração no arquivo.
- `worksService.findAllWorks` apenas repassa filtros ao repository. Se o contrato exigir que “listar ativos” seja sempre o padrão de domínio, pode normalizar `status: 'active'` quando o filtro vier vazio. Porém a UI já define `statusFilter` inicial como `active`; mudar no service afetaria consumidores futuros.
- Busca por nome usa `like(works.name, ...)`; em SQLite o comportamento de case sensitivity pode depender de collation/configuração. Não há normalização explícita para busca case-insensitive.
- Não há testes automatizados configurados. Para esta task, a verificação prática disponível sem adicionar ferramenta é `bun run typecheck` e `bun run lint`.

## Open Questions (update task.context.md if needed)

- [ ] A busca por nome precisa ser case-insensitive garantida por contrato, ou o comportamento atual do SQLite é suficiente?
- [ ] O service deve aplicar `status: 'active'` por padrão quando nenhum filtro for informado, ou a regra “ativos por padrão” pertence apenas à tela atual?
- [ ] Exclusão física deve futuramente verificar vínculo com notas antes de deletar, ou essa restrição fica para a fase de notas?
- [ ] É esperado adicionar uma suíte de testes nesta task, mesmo sem runner configurado, ou manter apenas `typecheck`/`lint` como validação por enquanto?
