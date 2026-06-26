# Research

## 1. Resumo executivo

O domínio `works`/serviços já está implementado com:

- status `active`/`inactive` no schema, tipos, formulário e listagem;
- switch de status no formulário de criação/edição;
- listagem padrão filtrando serviços ativos;
- filtro visual para ativos/inativos com contadores;
- exclusão física via `db.delete(works)` protegida por `ConfirmDialog`;
- invalidação de `worksQueryKeys.all` nas mutations de criar, editar e excluir.

Não foi encontrado módulo `orders`, schemas `orders`/`order_items`, rotas `/orders` ou implementação de `OrderItem`/snapshots no código atual. O conceito de snapshot existe no PRD e deve ser considerado como contrato futuro, mas ainda não há artefato implementado em `src`.

Há specs existentes relacionadas:

- `LMX-32` parece refletir o estado atual implementado de `works`.
- `LMX-28` contém uma direção conflitante com a LMX-30/PRD: propõe substituir exclusão física por inativação lógica. O código atual não seguiu essa proposta; mantém exclusão física e inativação via status, alinhado à LMX-30 e ao PRD.

## 2. Evidências de arquivos encontrados com caminhos exatos

### Domínio `works`

- `src/database/schemas/works.schema.ts`
  - Define tabela `works`.
  - Campos: `id`, `name`, `description`, `price`, `status`, `createdAt`, `updatedAt`.
  - Enum de status: `['active', 'inactive']`.

- `src/database/client.ts`
  - Registra apenas `works` em `databaseSchemas`.
  - Não registra `orders` ou `order_items`.

- `drizzle/0000_outstanding_jack_power.sql`
  - Migration inicial cria apenas a tabela `works`.

- `src/modules/works/types/works.types.ts`
  - Define `Work`, `CreateWorkInput`, `UpdateWorkInput`, `FindAllWorksFilters`, `StatusFilter`, `CountByStatus`, `StatusOptions`.

- `src/modules/works/repositories/works.repository.ts`
  - `findAllWorks(filters)` filtra por `search` e `status`.
  - `deleteWork(id)` faz exclusão física com `db.delete(works)`.
  - `countWorksByStatusSummary()` conta ativos e inativos.

- `src/modules/works/services/works.service.ts`
  - Valida nome, preço e ID.
  - Normaliza `name`, `description`, status default `active`, IDs e timestamps.
  - `deleteWork(id)` valida existência e chama exclusão física.

- `src/modules/works/schemas/work.form.schema.ts`
  - Schema Zod do formulário.
  - Valida `name`, `description`, `price` e `status`.

- `src/modules/works/hooks/works.query-keys.ts`
  - Factory de query keys do domínio `works`.

- `src/modules/works/hooks/queries/works.query-options.ts`
  - `queryOptions` para lista, detalhe e contagem por status.

- `src/modules/works/hooks/queries/use-works.ts`
  - Hooks `useWorks`, `useWork`, `useWorksCountByStatus`.

- `src/modules/works/hooks/mutations/use-create-work-mutation.ts`
  - Cria serviço e invalida `worksQueryKeys.all`.

- `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`
  - Edita serviço e invalida `worksQueryKeys.all`.

- `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`
  - Exclui serviço fisicamente e invalida `worksQueryKeys.all`.

- `src/modules/works/screens/WorkListScreen.tsx`
  - Estado inicial `statusFilter = 'active'`.
  - Lista serviços com filtro de status e busca.
  - Monta opções `Ativo` e `Inativo` com contadores.

- `src/modules/works/screens/EditWorkScreen.tsx`
  - Carrega serviço por ID de rota.
  - Edita serviço.
  - Abre `ConfirmDialog` antes de excluir.
  - Texto atual do modal: “O serviço será removido permanentemente do catálogo.”

- `src/modules/works/components/WorkForm.tsx`
  - Formulário com switch “Status ativo”.
  - Texto auxiliar: “Disponível para novas notas”.
  - Botão destrutivo: “Excluir Serviço”.

- `src/modules/works/components/WorkCard.tsx`
  - Exibe `Badge` com status ativo/inativo.

- `src/modules/works/components/WorkListHeaderScreen.tsx`
  - Usa `SearchInput` e `FilterChips`.

### Rotas

- `src/app/(tabs)/works/index.tsx`
  - Rota fina que renderiza `WorkListScreen`.

- `src/app/works/create.tsx`
  - Rota fina que exporta `CreateWorkScreen`.

- `src/app/works/[id].tsx`
  - Rota dinâmica fina que exporta `EditWorkScreen`.

- `src/app/(tabs)/notas.tsx`
  - Tela placeholder de “Notas”.
  - Não há módulo `orders` conectado.

### Componentes compartilhados reutilizáveis

- `src/shared/components/ConfirmDialog.tsx`
  - Dialog genérico com botão destrutivo.
  - Usado na exclusão de serviço.

- `src/shared/hooks/useBottomSheet.ts`
  - Hook para abrir/fechar bottom sheet.

- `src/shared/components/FilterChips.tsx`
  - Chips genéricos com label e count.

- `src/shared/ui/Badge.tsx`
  - Já possui labels para `active`, `inactive`, `open`, `closed`, `canceled`, `draft`.

- `src/shared/ui/Toggle.tsx`
  - Usado para status ativo/inativo.

- `src/shared/ui/SearchInput.tsx`
  - Busca textual.

- `src/shared/ui/Button.tsx`
  - Possui variantes usadas por ações destrutivas.

### Specs e documentação relacionadas

- `.specs/tasks/LMX-28-works-alinhar-inativacao-de-servicos-ao-prd/research.md`
- `.specs/tasks/LMX-28-works-alinhar-inativacao-de-servicos-ao-prd/spec.md`
- `.specs/tasks/LMX-32-fase-2-servicos-works/research.md`
- `.specs/tasks/LMX-32-fase-2-servicos-works/spec.md`
- `.specs/tasks/LMX-32-fase-2-servicos-works/summary.md`
- `docs/prd_controle_pedidos_app.md`

## 3. Estado atual do domínio works/serviços

### Persistência

A tabela `works` existe com status obrigatório:

```ts
status: text('status', { enum: status }).notNull()
```

Status aceitos:

```ts
['active', 'inactive']
```

Não há campo de soft delete, `deletedAt` ou equivalente.

### Listagem e catálogo

`WorkListScreen` inicia com:

```ts
const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
```

Portanto, por padrão, o catálogo lista apenas serviços ativos.

O repository aplica filtro de status quando informado:

```ts
if (filters.status !== undefined) {
  conditions.push(eq(works.status, filters.status));
}
```

Isso já permite:

- catálogo padrão de ativos;
- filtro de inativos;
- busca combinada com status.

### Inativação/ativação

A inativação existe como edição do campo `status` via formulário:

- `WorkForm` usa `Toggle`;
- `onValueChange` transforma boolean em `'active'` ou `'inactive'`;
- `useEditWorkMutation` chama `worksService.updateWork`;
- `worksService.updateWork` repassa status ao repository.

O texto do switch já comunica:

```text
Status ativo
Disponível para novas notas
```

### Exclusão física

A exclusão física está implementada:

- `WorkForm` exibe botão “Excluir Serviço” em edição.
- `EditWorkScreen` abre `ConfirmDialog`.
- `worksService.deleteWork(id)` valida ID e existência.
- `worksRepository.deleteWork(id)` executa:

```ts
await db.delete(works).where(eq(works.id, id));
```

O texto atual do diálogo já indica permanência:

```text
O serviço será removido permanentemente do catálogo.
```

Possível ajuste de copy: deixar ainda mais explícito que é diferente de inativar e não pode ser desfeito.

### Contadores

`worksRepository.countWorksByStatusSummary()` conta ativos e inativos separadamente.

`WorkListScreen` exibe:

- `Ativo`
- `Inativo`

com contagens vindas de `useWorksCountByStatus`.

## 4. Estado atual de orders/order items/snapshots, se existir

Não foi encontrada implementação atual de `orders`, `order_items` ou `OrderItem` em `src`.

Não encontrados:

- `src/modules/orders/**/*`
- `src/database/schemas/orders.schema.ts`
- `src/database/schemas/order-items.schema.ts`
- `src/app/orders/**/*`
- referências em código fonte a `OrderItem`, `order_items`, `workName`, `unitPrice`.

Existe apenas:

- `src/app/(tabs)/notas.tsx`
  - placeholder visual de “Notas”.

O PRD define o contrato futuro:

- `OrderItem.workId`
- `OrderItem.workName`
- `OrderItem.unitPrice`
- `OrderItem.totalPrice`
- `workName` e `unitPrice` devem preservar snapshot histórico;
- exclusão física de `Work` não pode apagar, bloquear ou alterar `OrderItem`;
- não usar cascade delete entre `works` e `order_items`.

## 5. Padrões arquiteturais observados

### Rotas finas em `src/app`

As rotas apenas exportam screens dos módulos:

- `src/app/(tabs)/works/index.tsx`
- `src/app/works/create.tsx`
- `src/app/works/[id].tsx`

Não há regra de negócio nas rotas.

### Módulo concentrando domínio

`src/modules/works` concentra:

- `components`
- `screens`
- `hooks`
- `repositories`
- `services`
- `schemas`
- `types`

### Repository como única fronteira Drizzle

Apenas `works.repository.ts` importa:

- `db`
- `works` schema
- operadores Drizzle como `eq`, `and`, `like`, `asc`, `count`.

### Service como regra de negócio

`works.service.ts` concentra:

- validações críticas;
- normalização;
- geração de ID;
- timestamps;
- validação de existência antes de update/delete.

### TanStack Query

Padrão observado:

- query key factory em `works.query-keys.ts`;
- `queryOptions` em `works.query-options.ts`;
- hooks pequenos em `use-works.ts`;
- mutations chamando services;
- invalidação via `worksQueryKeys.all`.

### Formulário

Padrão observado:

- React Hook Form;
- `Controller`;
- `zodResolver`;
- schema Zod por módulo;
- mensagens de validação em português.

### UI compartilhada

Componentes genéricos em `src/shared`:

- não conhecem domínio;
- recebem labels/callbacks por props;
- usam NativeWind/Tailwind;
- `ConfirmDialog` e `FilterChips` já suportam o caso desta tarefa.

## 6. Código reutilizável/componentes/hook/services relevantes

### Para status ativo/inativo

- `src/modules/works/types/works.types.ts`
  - `StatusFilter = 'active' | 'inactive'`.

- `src/modules/works/schemas/work.form.schema.ts`
  - `status: z.enum(['active', 'inactive']).default('active')`.

- `src/modules/works/components/WorkForm.tsx`
  - switch de status já pronto.

- `src/modules/works/screens/WorkListScreen.tsx`
  - filtro ativo/inativo já pronto.

- `src/shared/ui/Badge.tsx`
  - labels visuais `Ativo` e `Inativo`.

### Para catálogo e busca

- `worksRepository.findAllWorks(filters)`
  - reutilizável por futuras telas de seleção de serviço em orders.
  - Para novas orders, usar explicitamente `{ status: 'active' }`.

- `useWorks(filters)`
  - já aceita filtro por status e busca.
  - Pode ser reutilizado em tela de seleção de serviço, desde que o módulo `orders` não crie acoplamento inadequado.

### Para exclusão física

- `useDeleteWorkMutation`
- `worksService.deleteWork`
- `worksRepository.deleteWork`
- `ConfirmDialog`
- `useBottomSheet`

### Para invalidação

- `worksQueryKeys.all`
- mutations já invalidam `worksQueryKeys.all`.

### Para OrderItem futuro

Não há código implementado reutilizável de `orders`.

Reuso conceitual recomendado:

- seguir estrutura de módulo descrita em `src/modules/AGENTS.md`;
- seguir pattern de service/repository/hooks de `works`;
- usar `generateId` de `src/shared/utils/id.ts`;
- usar timestamps ISO no service;
- manter snapshot em service de orders/order items, não na UI.

## 7. Fronteiras e restrições entre src/app, src/modules, src/database, src/shared

### `src/app`

- Deve conter rotas, layouts e bootstrap.
- Rotas devem ser finas.
- Não deve acessar Drizzle.
- Não deve conter regra de negócio.
- Exceção existente: `src/app/_layout.tsx` pode importar `db` para migrations.

### `src/modules`

- Deve conter domínios funcionais.
- `works` já segue a estrutura esperada.
- Screens orquestram navegação, hooks e componentes.
- Hooks usam Query.
- Mutations chamam services, não repositories.
- Services validam e normalizam.
- Repositories acessam Drizzle.

### `src/database`

- Deve conter schemas e client.
- Atualmente só conhece `works`.
- Não deve conhecer UI, navegação ou regra de apresentação.
- Novos schemas de `orders`/`order_items`, quando existirem, devem ser registrados em `databaseSchemas`.

### `src/shared`

- Deve conter componentes, UI primitives, hooks e utils genéricos.
- Não deve importar `src/modules` nem `src/app`.
- Não deve conter termos ou regras específicas como `Work`/`Order`.
- `ConfirmDialog`, `FilterChips`, `Badge`, `Toggle` e `SearchInput` já são reutilizáveis.

## 8. Lacunas e perguntas em aberto

### Lacunas encontradas

- Não existe módulo `orders`.
- Não existe schema `orders`.
- Não existe schema `order_items`.
- Não existe implementação de `OrderItem`.
- Não existe snapshot histórico implementado no código atual.
- Não há testes automatizados configurados em `package.json`.
- Não há proteção técnica atual contra exclusão física de `Work` usado futuramente por `OrderItem`; isso dependerá do design futuro de `order_items` sem cascade e com snapshots.

### Conflito de contexto/spec

- `LMX-28` propõe trocar exclusão física por inativação lógica.
- `LMX-30` e o PRD pedem manter duas operações:
  - inativação via status;
  - exclusão física destrutiva.
- `LMX-32` e o código atual estão alinhados com a existência das duas operações.

### Perguntas em aberto

- A exclusão física deve continuar permitida mesmo quando existir `OrderItem.workId` apontando para o serviço, desde que snapshots preservem histórico?
- Quando `orders` for implementado, o filtro `{ status: 'active' }` deve ficar no módulo `orders` ao buscar serviços disponíveis, ou deve haver um método explícito no domínio `works`, como `findActiveWorksForOrderSelection`?
- O texto atual “removido permanentemente do catálogo” é suficiente ou deve declarar “esta ação não pode ser desfeita”?
- O PRD exige que inativos não apareçam em novas orders, mas como orders ainda não existem, esta task deve apenas garantir o contrato em `works` ou criar API/hook preparatório?
- Deve haver bloqueio/alerta diferente para excluir serviço já usado historicamente quando orders forem implementadas?

## 9. Recomendações para PLAN

1. Preservar o estado atual de duas operações:
   - inativação/ativação via `WorkForm.status`;
   - exclusão física via `deleteWork`.

2. Não aplicar a direção da LMX-28 de substituir exclusão física por inativação lógica, pois conflita com LMX-30 e PRD atual.

3. Ajustar copy de exclusão para reforçar destrutividade:
   - botão pode continuar “Excluir Serviço”;
   - modal deve dizer explicitamente que a exclusão é permanente e não pode ser desfeita;
   - distinguir de “inativar”, que apenas remove de novas notas.

4. Garantir no plano que serviços inativos não aparecem em novas orders como contrato futuro:
   - como `orders` ainda não existe, registrar que a implementação efetiva deve ocorrer na criação do módulo `orders`;
   - se houver alteração agora, preferir adicionar método/hook claro para seleção de serviços ativos somente se houver consumidor imediato.

5. Manter `worksRepository.findAllWorks({ status: 'active' })` como base para seleção de serviços em novas notas.

6. Não criar schema/migration de orders nesta tarefa, salvo se o escopo do PLAN for ampliado, pois PRD indica isso como Fase 3.

7. Para snapshot histórico, documentar no PLAN que:
   - `OrderItem.workName` e `OrderItem.unitPrice` devem ser preenchidos no momento da criação do item;
   - histórico não deve depender da existência futura do `Work`;
   - não usar cascade delete de `works` para `order_items`.

8. Validar que mutations de edição e exclusão continuam aguardando `invalidateQueries({ queryKey: worksQueryKeys.all })`.

9. Verificações disponíveis:
   - `bun run typecheck`;
   - `bun run lint`;
   - não planejar comando de teste automatizado sem introduzir infraestrutura, pois `package.json` não possui script de testes.
