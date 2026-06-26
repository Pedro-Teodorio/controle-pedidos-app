# Tasks: LMX-33 - Banco de orders e order_items

## T1 - Criar schema Drizzle de orders

Status: pending
Depends on: none
Can run in parallel: true

Files:

- src/database/schemas/orders.schema.ts

Scope:

- Criar o schema `orders` com `sqliteTable('orders', ...)` seguindo o padrão de `src/database/schemas/works.schema.ts`.
- Definir `orderStatusValues` com `open`, `closed` e `canceled` para tipagem enum do campo `status`.
- Incluir os campos obrigatórios `id`, `number`, `customer_name`, `status`, `total`, `created_at` e `updated_at`.
- Incluir os campos nullable `customer_phone`, `notes`, `closed_at` e `canceled_at` sem `.notNull()`.
- Usar `real` para `total`, alinhado ao padrão atual de `works.price`.

Acceptance Criteria:

- O arquivo `src/database/schemas/orders.schema.ts` existe.
- A tabela Drizzle se chama `orders`.
- `customer_phone`, `notes`, `closed_at` e `canceled_at` aceitam `NULL`.
- `status` está tipado com os valores `open`, `closed` e `canceled`.

Validation:

- `bun run typecheck`
- `bun run lint`

## T2 - Criar schema Drizzle de order_items

Status: pending
Depends on: none
Can run in parallel: true

Files:

- src/database/schemas/order-items.schema.ts

Scope:

- Criar o schema `order_items` com `sqliteTable('order_items', ...)` seguindo o padrão de schemas existentes.
- Incluir os campos obrigatórios `id`, `order_id`, `patient_name`, `work_id`, `work_name`, `quantity`, `unit_price`, `total_price`, `created_at` e `updated_at`.
- Incluir `notes` como campo nullable sem `.notNull()`.
- Manter `work_id` como `text` obrigatório sem foreign key para `works.id`.
- Garantir que `work_name` e `unit_price` sejam obrigatórios para snapshot histórico.
- Se for criada foreign key de `order_id` para `orders.id`, não configurar cascade delete.

Acceptance Criteria:

- O arquivo `src/database/schemas/order-items.schema.ts` existe.
- A tabela Drizzle se chama `order_items`.
- `work_id` não possui foreign key para `works.id`.
- Não há cascade delete entre `works` e `order_items`.
- `work_name` e `unit_price` são obrigatórios.
- `notes` aceita `NULL`.

Validation:

- `bun run typecheck`
- `bun run lint`

## T3 - Registrar schemas no client do banco

Status: pending
Depends on: T1, T2
Can run in parallel: false

Files:

- src/database/client.ts

Scope:

- Importar `orders` de `@/database/schemas/orders.schema`.
- Importar `orderItems` de `@/database/schemas/order-items.schema`.
- Registrar `orders` e `orderItems` no objeto `databaseSchemas`, preservando `works`.
- Não alterar nome do banco, configuração do Drizzle ou bootstrap de migrations.

Acceptance Criteria:

- `databaseSchemas` contém `works`, `orders` e `orderItems`.
- O client Drizzle continua inicializado com `schema: databaseSchemas`.
- Nenhuma rota, tela ou camada de domínio importa `db` por causa desta task.

Validation:

- `bun run typecheck`
- `bun run lint`

## T4 - Criar tipos TypeScript do domínio orders

Status: pending
Depends on: none
Can run in parallel: true

Files:

- src/modules/orders/types/orders.types.ts

Scope:

- Criar o diretório `src/modules/orders/types` se ainda não existir.
- Definir `OrderStatus = 'open' | 'closed' | 'canceled'`.
- Definir `Order` com propriedades camelCase equivalentes às colunas de `orders`.
- Definir `OrderItem` com propriedades camelCase equivalentes às colunas de `order_items`.
- Definir `OrderWithItems` com `items: OrderItem[]`.
- Definir tipos auxiliares sem regra de negócio: `CreateOrderInput`, `CreateOrderItemInput`, `CreateOrderData`, `CreateOrderItemData`, `UpdateOrderInput`, `UpdateOrderData` e `FindAllOrdersFilters`.
- Manter o arquivo independente de Drizzle e sem imports de código produtivo, exceto tipos se estritamente necessário.

Acceptance Criteria:

- Existe `src/modules/orders/types/orders.types.ts`.
- O arquivo exporta `OrderStatus`, `Order`, `OrderItem` e `OrderWithItems`.
- Campos nullable são tipados com `string | null` quando aplicável.
- Tipos de preço, quantidade e total usam `number`, alinhados ao uso de `real` no banco.

Validation:

- `bun run typecheck`
- `bun run lint`

## T5 - Gerar migration Drizzle para orders e order_items

Status: pending
Depends on: T1, T2, T3
Can run in parallel: false

Files:

- drizzle/[nova_migration].sql
- drizzle/meta/[novo_snapshot].json
- drizzle/meta/_journal.json

Scope:

- Executar `bun run db:generate` após os schemas estarem criados e registrados.
- Conferir os artefatos gerados pelo Drizzle Kit.
- Não editar manualmente snapshots JSON gerados, salvo correção estritamente necessária e justificada.

Acceptance Criteria:

- Uma nova migration SQL é criada em `drizzle/`.
- Um novo snapshot é criado em `drizzle/meta/`.
- `drizzle/meta/_journal.json` referencia a nova migration.
- A migration cria as tabelas `orders` e `order_items`.

Validation:

- `bun run typecheck`
- `bun run lint`

## T6 - Revisar SQL da migration contra critérios de persistência histórica

Status: pending
Depends on: T5
Can run in parallel: false

Files:

- drizzle/[nova_migration].sql

Scope:

- Revisar a migration SQL gerada para confirmar campos, nullability e relações.
- Verificar que `orders.customer_phone` aceita `NULL`.
- Verificar que `orders.canceled_at` aceita `NULL`.
- Verificar que `order_items.work_name` e `order_items.unit_price` existem e são obrigatórios.
- Verificar que não existe cascade delete entre `works` e `order_items`.
- Verificar que `order_items.work_id` não referencia `works.id`.
- Se houver FK de `order_items.order_id` para `orders.id`, confirmar que não há cascade delete indesejado.

Acceptance Criteria:

- A migration SQL atende todos os critérios de aceite de banco da spec.
- Não há cascade delete entre `works` e `order_items`.
- O vínculo com `works` é preservado apenas por `work_id`, `work_name` e `unit_price` no item.

Validation:

- `bun run typecheck`
- `bun run lint`

## T7 - Registrar nova migration no empacotamento Expo

Status: pending
Depends on: T5, T6
Can run in parallel: false

Files:

- drizzle/migrations.js

Scope:

- Importar o novo arquivo `.sql` gerado pela migration em `drizzle/migrations.js`.
- Adicionar a nova migration ao objeto `migrations` no formato sequencial já existente (`m0000`, `m0001`, etc.).
- Preservar o import de `journal` e as migrations anteriores.
- Não alterar `src/app/_layout.tsx`.

Acceptance Criteria:

- `drizzle/migrations.js` importa a nova migration SQL.
- A nova migration está presente no objeto `migrations` exportado.
- Migrations anteriores continuam registradas.

Validation:

- `bun run typecheck`
- `bun run lint`

## T8 - Validação final e revisão de escopo

Status: pending
Depends on: T3, T4, T7
Can run in parallel: false

Files:

- src/database/schemas/orders.schema.ts
- src/database/schemas/order-items.schema.ts
- src/database/client.ts
- src/modules/orders/types/orders.types.ts
- drizzle/[nova_migration].sql
- drizzle/meta/[novo_snapshot].json
- drizzle/meta/_journal.json
- drizzle/migrations.js

Scope:

- Executar as validações disponíveis do projeto.
- Revisar o diff para confirmar que nenhuma UI, rota, service, repository, hook ou módulo `works` foi alterado indevidamente.
- Confirmar que `package.json`, configurações Expo/NativeWind/Metro/Babel e `src/app/**` permanecem fora do escopo.

Acceptance Criteria:

- `bun run typecheck` passa.
- `bun run lint` passa.
- O diff contém somente arquivos previstos para banco, tipos e migrations.
- Todos os critérios verificáveis de `spec.md` estão atendidos.

Validation:

- `bun run typecheck`
- `bun run lint`
