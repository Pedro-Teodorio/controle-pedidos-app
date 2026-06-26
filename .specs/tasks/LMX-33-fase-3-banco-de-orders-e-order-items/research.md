# Research

## 1. Resumo executivo

A codebase já possui uma arquitetura modular estabelecida com `works` como principal referência para implementar `orders` e `order_items`. O padrão atual separa:

- rotas finas em `src/app`;
- domínio em `src/modules`;
- schemas e client Drizzle em `src/database`;
- componentes e utilitários genéricos em `src/shared`.

Atualmente só existe persistência para `works`. Não há módulo `orders` implementado ainda em `src/modules/orders`, nem schemas `orders`, `order_items` ou `app_meta` em `src/database/schemas`.

A task LMX-33 deve criar a base persistente para notas e itens, alinhando com o PRD existente em `docs/prd_controle_pedidos_app.md`, especialmente a seção “Fase 3 — Banco de orders e order items”.

## 2. Artefatos e arquivos relevantes encontrados

### Contexto da task

- `.specs/tasks/LMX-33-fase-3-banco-de-orders-e-order-items/task.context.md`
  - Define entregáveis: schemas `orders`, `order_items`, `app_meta` se necessário, registro em client, migration, atualização de `drizzle/migrations.js` e tipos em `src/modules/orders/types/orders.types.ts`.
  - Critérios importantes:
    - `customer_phone` e `canceled_at` aceitam nulo.
    - Não usar cascade delete entre `works` e `order_items`.
    - Snapshots `workName` e `unitPrice` preservam histórico.

### Documentação de produto

- `docs/prd_controle_pedidos_app.md`
  - Linhas 320-355: entidade `Order`.
  - Linhas 359-392: entidade `OrderItem`.
  - Linhas 740-803: Fase 3 — banco de `orders` e `order_items`.
  - Linhas 1050-1105: padrões esperados de TanStack Query para futura fase de orders.

- `docs/plano_atualizacao_prd_wireframe.md`
  - Linhas 199-212: campos esperados para `orders`, embora ali não apareça `total`.
  - Linhas 214-239: campos esperados para `OrderItem`.

### Banco e Drizzle

- `src/database/client.ts`
  - Registra atualmente apenas `works`.
  - Abre SQLite com `openDatabaseSync('controle-pedidos.db')`.
  - Inicializa Drizzle com `databaseSchemas`.

- `src/database/schemas/works.schema.ts`
  - Único schema persistente atual.
  - Usa `sqliteTable`, `text` e `real`.

- `drizzle.config.ts`
  - `schema: './src/database/schemas/*'`
  - `out: './drizzle'`
  - `dialect: 'sqlite'`
  - `driver: 'expo'`

- `drizzle/migrations.js`
  - Importa `journal` e migration SQL atual.
  - Precisa ser atualizado manualmente após nova migration gerada.

- `drizzle/0000_outstanding_jack_power.sql`
  - Cria apenas a tabela `works`.

- `drizzle/meta/_journal.json`
- `drizzle/meta/0000_snapshot.json`

### Módulo works como referência

- `src/modules/works/types/works.types.ts`
- `src/modules/works/repositories/works.repository.ts`
- `src/modules/works/services/works.service.ts`
- `src/modules/works/schemas/work.form.schema.ts`
- `src/modules/works/hooks/works.query-keys.ts`
- `src/modules/works/hooks/queries/works.query-options.ts`
- `src/modules/works/hooks/queries/use-works.ts`
- `src/modules/works/hooks/mutations/use-create-work-mutation.ts`
- `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`
- `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`

### Rotas e bootstrap

- `src/app/_layout.tsx`
  - Executa `useMigrations(db, migrations)` antes de renderizar o app.
  - Importa `db` como exceção permitida para bootstrap.
  - Configura `QueryClientProvider`.

- `src/app/(tabs)/notas.tsx`
  - Tela de notas ainda é placeholder.

- `src/app/(tabs)/works/index.tsx`
  - Rota fina que delega para `WorkListScreen`.

- `src/app/works/create.tsx`
- `src/app/works/[id].tsx`
  - Rotas finas para criação/edição de serviços.

### Utilitários reutilizáveis

- `src/shared/utils/id.ts`
  - `generateId()` com UUID.

- `src/shared/utils/date.ts`
  - `formatDateTime`.

- `src/shared/ui/MoneyText.tsx`
  - Formatação simples de moeda com `amount.toFixed(2)`.

## 3. Arquitetura existente observada

A arquitetura atual segue camadas bem definidas:

- `src/app`
  - Rotas e layouts Expo Router.
  - Deve conter arquivos pequenos.
  - Não deve conter regra de negócio.
  - Pode importar screens dos módulos.
  - Exceção: `src/app/_layout.tsx` importa `db` para migrations.

- `src/modules`
  - Domínios funcionais.
  - `works` concentra UI, hooks, schemas, service, repository e types.
  - Para `orders`, a estrutura esperada é análoga:
    - `src/modules/orders/types/orders.types.ts`
    - futuramente services/repositories/hooks/schemas/screens.

- `src/database`
  - Infraestrutura SQLite/Drizzle.
  - Schemas por tabela.
  - Client central com registro de schemas.
  - Não deve conhecer UI, navegação ou regra de apresentação.

- `src/shared`
  - Componentes, UI primitives, hooks e utils genéricos.
  - Não deve importar `modules` nem `app`.
  - Não deve conter termos de domínio como `Work` ou `Order`.

O padrão atual para domínio é:

1. UI chama hooks/mutations.
2. Mutations chamam services.
3. Services validam, normalizam, geram IDs/timestamps e chamam repositories.
4. Repositories acessam Drizzle diretamente.
5. Schemas de banco ficam em `src/database/schemas`.

## 4. Banco de dados e migrations existentes

### Estado atual

Há apenas a tabela `works`.

Arquivo: `src/database/schemas/works.schema.ts`

Campos:

- `id`: `text`, primary key
- `name`: `text`, not null
- `description`: `text`, nullable
- `price`: `real`, not null
- `status`: `text`, enum `['active', 'inactive']`, not null
- `createdAt`: coluna `created_at`, `text`, not null
- `updatedAt`: coluna `updated_at`, `text`, not null

Migration atual: `drizzle/0000_outstanding_jack_power.sql`

```sql
CREATE TABLE `works` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `price` real NOT NULL,
  `status` text NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
```

### Configuração Drizzle

Arquivo: `drizzle.config.ts`

- Usa `driver: 'expo'`.
- Busca schemas em `./src/database/schemas/*`.
- Gera migrations em `./drizzle`.

### Registro no client

Arquivo: `src/database/client.ts`

Atualmente:

```ts
import { works } from '@/database/schemas/works.schema';

export const databaseSchemas = {
  works,
};
```

Para LMX-33, será necessário registrar novos schemas, por exemplo:

- `orders`
- `orderItems`
- possivelmente `appMeta`

### Migrations Expo

Arquivo: `drizzle/migrations.js`

Atualmente importa apenas:

- `./0000_outstanding_jack_power.sql`

Após gerar nova migration com `bun run db:generate`, será necessário adicionar o import do novo `.sql` e registrar em `migrations`.

## 5. Módulo works e padrões reutilizáveis

### Tipos

Arquivo: `src/modules/works/types/works.types.ts`

Padrão observado:

- Entidade principal completa: `Work`.
- Input de criação: `CreateWorkInput`.
- Input de atualização parcial: `UpdateWorkInput`.
- Data para banco: `CreateWorkData`, `UpdateWorkData`.
- Filtros: `FindAllWorksFilters`.
- Tipos auxiliares de UI: `StatusFilter`, `CountByStatus`, `StatusOptions`.

Para `orders`, o padrão pode ser reaproveitado com:

- `Order`
- `OrderItem`
- `OrderWithItems`
- `CreateOrderInput`
- `CreateOrderItemInput`
- `CreateOrderData`
- `CreateOrderItemData`
- `UpdateOrderInput`
- `UpdateOrderData`
- `FindAllOrdersFilters`
- `OrderStatus`
- tipos de resumo se necessário em fase futura.

### Service

Arquivo: `src/modules/works/services/works.service.ts`

Padrões relevantes:

- Validação crítica no service.
- Normalização de strings com `.trim()`.
- Conversão de string vazia para `null` já ocorre no schema de form, mas service também protege invariantes.
- Geração de ID com `generateId()`.
- Timestamps com `new Date().toISOString()`.
- Repository é a única dependência de persistência.
- Service não importa React, React Native nem `db`.

Para `orders`, o service futuro deve calcular:

- `total` da order;
- `totalPrice` de cada item;
- snapshots `workName` e `unitPrice`;
- `closedAt` e `canceledAt` conforme status.

### Repository

Arquivo: `src/modules/works/repositories/works.repository.ts`

Padrões relevantes:

- Importa `db` de `@/database/client`.
- Importa schema de `@/database/schemas/works.schema`.
- Usa operadores Drizzle:
  - `and`
  - `asc`
  - `count`
  - `eq`
  - `like`
- Repositories retornam tipos do domínio.
- Capturam erro com `console.error` e relançam.

Para `orders`, o repository deve ser responsável por inserir em `orders` e `order_items`, buscar order com items e encapsular joins/transações se forem necessárias em fase futura.

### Query keys

Arquivo: `src/modules/works/hooks/works.query-keys.ts`

Padrão:

```ts
export const worksQueryKeys = {
  all: ['works'] as const,
  findAll: () => ['works', 'findAll'] as const,
  findAllWithFilters: (filters) => ['works', 'findAll', filters] as const,
  findById: (id: string) => ['works', 'detail', id] as const,
  countByStatus: () => ['works', 'summary', 'countByStatus'] as const,
};
```

Para `orders`, o PRD já prevê:

- `ordersQueryKeys.all`
- `ordersQueryKeys.findAll()`
- `ordersQueryKeys.findAllWithFilters(filters)`
- `ordersQueryKeys.findById(id)`
- `ordersQueryKeys.findWithItemsById(id)`
- `ordersQueryKeys.summary()`

### Query options

Arquivo: `src/modules/works/hooks/queries/works.query-options.ts`

Padrão:

- Usa `queryOptions`.
- Centraliza `queryKey`, `queryFn`, `staleTime`, `gcTime`.
- Chama service, não repository.

### Mutations

Arquivos:

- `src/modules/works/hooks/mutations/use-create-work-mutation.ts`
- `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`
- `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`

Padrão:

- `useMutation`.
- `mutationFn` chama service.
- `onSuccess` invalida `worksQueryKeys.all`.

Para orders, mutations futuras devem invalidar `ordersQueryKeys.all`.

### Form schema

Arquivo: `src/modules/works/schemas/work.form.schema.ts`

Padrões:

- Usa Zod.
- Transforma preço aceitando string ou number.
- Troca vírgula por ponto.
- Valida `Number.isFinite`.
- Não permite preço negativo.
- Transforma descrição vazia em `null`.

Esse padrão é reutilizável para quantidades, preços e campos opcionais em forms de orders/order items, embora LMX-33 foque principalmente banco e tipos.

## 6. Fronteiras entre camadas

### `src/app`

- Deve apenas declarar rotas/layouts.
- `src/app/(tabs)/notas.tsx` hoje é placeholder; não há integração com `orders`.
- Rotas de `works` mostram o padrão correto de delegação:
  - `src/app/works/create.tsx` exporta `CreateWorkScreen`.
  - `src/app/works/[id].tsx` exporta `EditWorkScreen`.
- Para LMX-33 provavelmente não é necessário alterar rotas, pois a task é de banco/tipos.

### `src/modules`

- Deve conter o novo módulo `orders` para tipos e, futuramente, services/repositories/hooks/screens.
- Para esta task, o entregável explícito é `src/modules/orders/types/orders.types.ts`.
- O módulo `orders` pode depender de tipos públicos de `works` apenas se houver necessidade real, mas deve evitar acoplamento desnecessário. Como `order_items` preservam snapshot, `workName` e `unitPrice` devem existir nos próprios tipos de order item.

### `src/database`

- Novos schemas devem ficar em arquivos separados:
  - `src/database/schemas/orders.schema.ts`
  - `src/database/schemas/order-items.schema.ts`
  - opcionalmente `src/database/schemas/app-meta.schema.ts`
- `src/database/client.ts` deve registrar todos os schemas.
- `database` não deve importar nada de `modules`.

### `src/shared`

- Pode fornecer `generateId` e utilitários genéricos em services futuros.
- Não deve receber tipos ou componentes específicos de orders.
- Não deve acessar banco.

## 7. Implicações para orders e order_items

### Campos esperados para `orders`

Conforme PRD e contexto da task:

- `id`: string/UUID, primary key.
- `number`: número sequencial.
- `customer_name`: obrigatório.
- `customer_phone`: nullable.
- `notes`: nullable.
- `status`: `open | closed | canceled`.
- `total`: number.
- `created_at`: ISO string.
- `updated_at`: ISO string.
- `closed_at`: nullable.
- `canceled_at`: nullable.

No TypeScript, a entidade esperada é:

```ts
type Order = {
  id: string;
  number: number;
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  status: 'open' | 'closed' | 'canceled';
  total: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  canceledAt: string | null;
};
```

### Campos esperados para `order_items`

Conforme PRD e contexto da task:

- `id`: string/UUID, primary key.
- `order_id`: vínculo com order.
- `patient_name`: obrigatório.
- `work_id`: referência original do serviço.
- `work_name`: snapshot histórico.
- `quantity`: number.
- `unit_price`: snapshot histórico.
- `total_price`: number.
- `notes`: nullable.
- `created_at`: ISO string.
- `updated_at`: ISO string.

No TypeScript, a entidade esperada é:

```ts
type OrderItem = {
  id: string;
  orderId: string;
  patientName: string;
  workId: string;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### Relacionamento com works

O critério “não usar cascade delete entre `works` e `order_items`” é crítico.

Além disso, o PRD afirma que exclusão física de `Work` não pode apagar, bloquear ou alterar `OrderItem`.

Implicação prática:

- `order_items.work_id` deve guardar o ID original do serviço.
- `order_items.work_name` e `order_items.unit_price` devem ser snapshots obrigatórios.
- Deve-se evitar FK de `order_items.work_id` para `works.id` se ela puder bloquear a exclusão física de `works`.
- Se for criada FK para `works`, ela não deve ter cascade; porém, mesmo `NO ACTION` pode impedir exclusão quando foreign keys estão ativas. Portanto, a opção mais segura para o critério de aceite é persistir `work_id` como `text not null` sem constraint FK para `works`.

### Relacionamento entre orders e order_items

O PRD exige que o relacionamento entre order e items funcione.

Opções a decidir no plano:

- Criar FK `order_items.order_id -> orders.id`.
- Decidir comportamento de delete:
  - Sem cascade, preserva itens mesmo se order for removida, mas pode gerar órfãos se houver exclusão física.
  - Com cascade, remove itens ao excluir order, mas a regra de produto diz que orders canceladas não devem ser excluídas fisicamente; não está claro se orders abertas poderiam ser excluídas.
- Como a task só proíbe cascade entre `works` e `order_items`, ainda há espaço para FK entre `orders` e `order_items`, mas o comportamento deve ser explicitado.

### Valores monetários

O projeto atual usa:

- `real` no banco para `works.price`.
- `number` no TypeScript.
- `MoneyText` com `amount.toFixed(2)`.

Para consistência imediata, `orders.total`, `order_items.unit_price` e `order_items.total_price` provavelmente seguiriam `real`.

Risco: valores monetários em `real` podem ter problemas de precisão. Como o padrão atual já usa `real`, mudar para centavos inteiros exigiria decisão arquitetural mais ampla e possível migração futura de `works.price`.

### `app_meta`

A task diz “`app_meta` se necessário”.

Possível necessidade:

- Controlar próximo número sequencial de order.
- Armazenar chave como `next_order_number`.

Alternativas:

- Usar `max(orders.number) + 1`.
- Criar `app_meta` genérica chave/valor.
- Criar futura `company_settings` com `nextOrderNumber`, conforme PRD seção `CompanySettings`.

Para LMX-33, ainda há lacuna sobre estratégia oficial de numeração sequencial.

## 8. Riscos e lacunas de informação

1. **Estratégia de número sequencial**
   - Não está definido se `number` será gerado por `app_meta`, por `max(number) + 1`, por tabela de settings ou por outro mecanismo.
   - A task cita `app_meta` como opcional.

2. **Precisão monetária**
   - O projeto usa `real` para `works.price`.
   - Orders terão totais e snapshots monetários; `real` é consistente, mas tem risco de precisão.
   - Não há decisão explícita entre real/float, inteiro em centavos ou texto decimal.

3. **Foreign key de `work_id`**
   - O aceite exige que exclusão física de `works` não afete `order_items`.
   - FK com `NO ACTION` pode bloquear deleção de `works`.
   - Recomendável planejar `work_id` como texto sem FK para `works`, mas isso deve ser assumido explicitamente.

4. **Foreign key de `order_id`**
   - O relacionamento order-items deve funcionar.
   - Não está claro se deve haver cascade entre `orders` e `order_items`.
   - Não há regra final sobre exclusão física de orders abertas.

5. **Índices e constraints**
   - Não há padrão atual de índices na codebase.
   - Pode ser útil índice em:
     - `orders.number`
     - `orders.status`
     - `orders.customer_name`
     - `order_items.order_id`
   - Não há critério de aceite explícito para índices.

6. **Constraints de status**
   - Drizzle enum em `text('status', { enum })` melhora tipagem, mas SQLite gerado atualmente não cria check constraint para `works.status`.
   - O critério diz “Status aceita apenas `open`, `closed` e `canceled`”, mas talvez isso seja garantido mais por TypeScript/service do que por constraint SQL, salvo implementação manual.

7. **Ausência de testes**
   - `package.json` não tem script de testes.
   - Critérios de aceite exigem apenas `bun run typecheck` e `bun run lint`.

8. **Módulo orders ainda inexistente**
   - Não há `src/modules/orders`.
   - A task pede tipos, mas futuras fases preveem stores, services, repositories, hooks e screens.

9. **Divergência menor em documentação**
   - `docs/prd_controle_pedidos_app.md` lista `total` em `Order` e na tabela `orders`.
   - `docs/plano_atualizacao_prd_wireframe.md` mostra uma lista de atualização da tabela `orders` sem `total`, mas o PRD principal e a Fase 3 incluem `total`.

## 9. Recomendações para planejamento

1. **Criar schemas separados**
   - `src/database/schemas/orders.schema.ts`
   - `src/database/schemas/order-items.schema.ts`
   - `src/database/schemas/app-meta.schema.ts` apenas se a estratégia de numeração exigir.

2. **Registrar schemas no client**
   - Atualizar `src/database/client.ts` para incluir `orders`, `orderItems` e opcionalmente `appMeta`.

3. **Seguir convenções de nomes**
   - Arquivos com kebab-case quando já indicado: `order-items.schema.ts`.
   - Objeto exportado camelCase: `orderItems`.
   - Colunas snake_case no banco.
   - Propriedades camelCase no TypeScript/Drizzle.

4. **Definir enums como `as const`**
   - Exemplo:
     - `orderStatus = ['open', 'closed', 'canceled'] as const`.

5. **Preservar snapshots em `order_items`**
   - `workName`/`work_name` obrigatório.
   - `unitPrice`/`unit_price` obrigatório.
   - Não depender de join com `works` para exibir histórico.

6. **Evitar FK de `order_items.work_id` para `works.id`**
   - Para atender o aceite de exclusão física de works sem cascade e sem bloqueio.
   - Guardar `work_id` como `text not null`.

7. **Decidir FK de `order_items.order_id` para `orders.id`**
   - Recomenda-se explicitar no plano se haverá FK e qual comportamento de delete.
   - A task não proíbe cascade entre orders e order_items, mas o domínio parece favorecer preservação de notas.

8. **Alinhar valores monetários com padrão atual**
   - Para consistência com `works.price`, usar `real` inicialmente em:
     - `orders.total`
     - `order_items.unit_price`
     - `order_items.total_price`
   - Registrar risco de precisão se futuramente migrar para centavos.

9. **Criar tipos em `src/modules/orders/types/orders.types.ts`**
   - Incluir ao menos:
     - `OrderStatus`
     - `Order`
     - `OrderItem`
     - `OrderWithItems`
     - tipos de input/data se úteis para próximas fases.

10. **Gerar e revisar migration**
    - Gerar com `bun run db:generate`.
    - Revisar SQL gerado.
    - Atualizar `drizzle/migrations.js` com novo import e entrada `m0001` ou equivalente.

11. **Validar com comandos existentes**
    - `bun run typecheck`
    - `bun run lint`

12. **Não alterar rotas nesta fase salvo necessidade**
    - `src/app/(tabs)/notas.tsx` ainda é placeholder.
    - A task LMX-33 é focada em banco e tipos, não UI.
