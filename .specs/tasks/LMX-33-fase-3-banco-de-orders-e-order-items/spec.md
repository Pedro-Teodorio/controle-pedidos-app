# Spec: LMX-33 - Banco de orders e order items

## Escopo

Esta especificação cobre somente a criação da base persistente de `orders` e `order_items`, o registro dos schemas no client de banco, a geração/empacotamento da migration Drizzle/Expo e a criação dos tipos TypeScript mínimos do domínio `orders`.

## Requisitos Funcionais

### RF-01 - Schema `orders`

WHEN a fase de implementação criar a estrutura de banco para notas,
THEN o sistema SHALL criar o schema Drizzle `orders` em `src/database/schemas/orders.schema.ts`.

WHEN o schema `orders` for definido,
THEN ele SHALL mapear uma tabela SQLite chamada `orders`.

WHEN a tabela `orders` for criada,
THEN ela SHALL conter os campos obrigatórios `id`, `number`, `customer_name`, `status`, `total`, `created_at` e `updated_at`.

WHEN a tabela `orders` for criada,
THEN ela SHALL conter os campos opcionais `customer_phone`, `notes`, `closed_at` e `canceled_at` aceitando `NULL`.

WHEN `orders.status` for tipado,
THEN o status SHALL aceitar somente os valores de domínio `open`, `closed` e `canceled` no TypeScript/Drizzle.

### RF-02 - Schema `order_items`

WHEN a fase de implementação criar a estrutura de banco para itens de nota,
THEN o sistema SHALL criar o schema Drizzle `order_items` em `src/database/schemas/order-items.schema.ts`.

WHEN o schema `order_items` for definido,
THEN ele SHALL mapear uma tabela SQLite chamada `order_items`.

WHEN a tabela `order_items` for criada,
THEN ela SHALL conter os campos obrigatórios `id`, `order_id`, `patient_name`, `work_id`, `work_name`, `quantity`, `unit_price`, `total_price`, `created_at` e `updated_at`.

WHEN a tabela `order_items` for criada,
THEN ela SHALL conter o campo opcional `notes` aceitando `NULL`.

### RF-03 - Preservação histórica de itens

WHEN um item de nota for persistido no futuro,
THEN `order_items.work_name` SHALL armazenar o nome do serviço no momento da criação do item.

WHEN um item de nota for persistido no futuro,
THEN `order_items.unit_price` SHALL armazenar o preço unitário do serviço no momento da criação do item.

WHEN um serviço em `works` for alterado ou removido no futuro,
THEN dados históricos de `order_items.work_name` e `order_items.unit_price` SHALL permanecer independentes do estado atual de `works`.

WHEN a relação entre `order_items` e `works` for definida,
THEN o sistema SHALL NOT usar cascade delete entre `works` e `order_items`.

WHEN `order_items.work_id` for definido,
THEN ele SHALL ser armazenado como texto obrigatório sem foreign key para `works.id`, salvo decisão humana posterior que comprove não bloquear nem apagar histórico.

### RF-04 - Relação entre orders e order_items

WHEN `order_items.order_id` for definido,
THEN ele SHOULD representar o vínculo do item com uma nota em `orders.id`.

WHEN uma foreign key entre `order_items.order_id` e `orders.id` for criada,
THEN a migration SHALL be reviewed para garantir que não haja comportamento de cascade indesejado.

WHEN houver dúvida sobre comportamento de delete entre `orders` e `order_items`,
THEN a implementação SHALL preferir preservação histórica e não exclusão automática.

### RF-05 - Registro dos schemas no client

WHEN os schemas `orders` e `order_items` forem criados,
THEN `src/database/client.ts` SHALL registrar esses schemas em `databaseSchemas`.

WHEN o client Drizzle for inicializado,
THEN os schemas `works`, `orders` e `orderItems` SHALL estar disponíveis no objeto de schema passado ao Drizzle.

### RF-06 - Tipos TypeScript do domínio orders

WHEN a fase de implementação criar tipos de domínio,
THEN o sistema SHALL criar `src/modules/orders/types/orders.types.ts`.

WHEN os tipos forem criados,
THEN eles SHALL incluir `OrderStatus`, `Order`, `OrderItem` e `OrderWithItems`.

WHEN `Order` for definido,
THEN ele SHALL conter propriedades camelCase equivalentes às colunas da tabela `orders`.

WHEN `OrderItem` for definido,
THEN ele SHALL conter propriedades camelCase equivalentes às colunas da tabela `order_items`.

WHEN tipos auxiliares forem úteis para fases posteriores,
THEN o arquivo SHOULD incluir inputs/data types como `CreateOrderInput`, `CreateOrderItemInput`, `CreateOrderData`, `CreateOrderItemData`, `UpdateOrderInput`, `UpdateOrderData` e `FindAllOrdersFilters`, sem implementar regra de negócio.

### RF-07 - Migration Drizzle/Expo

WHEN os schemas forem implementados,
THEN a migration SHALL ser gerada com `bun run db:generate`.

WHEN a migration for gerada,
THEN ela SHALL criar corretamente as tabelas `orders` e `order_items`.

WHEN a migration for gerada,
THEN `drizzle/migrations.js` SHALL ser atualizado para importar e registrar o novo arquivo `.sql`.

WHEN o app executar migrations via `src/app/_layout.tsx`,
THEN a nova migration SHALL estar disponível para o mecanismo de migrations Expo/Drizzle existente.

### RF-08 - Validação técnica

WHEN a implementação terminar,
THEN `bun run typecheck` SHALL passar.

WHEN a implementação terminar,
THEN `bun run lint` SHALL passar.

WHEN a migration SQL for revisada,
THEN ela SHALL demonstrar que `customer_phone` e `canceled_at` aceitam `NULL`.

WHEN a migration SQL for revisada,
THEN ela SHALL demonstrar que não há cascade delete entre `works` e `order_items`.

## Edge Cases

- IF `customer_phone` não for informado, THEN a coluna `customer_phone` SHALL aceitar `NULL`.
- IF uma nota for cancelada, THEN a coluna `canceled_at` SHALL aceitar timestamp ou `NULL` antes do cancelamento.
- IF uma nota ainda estiver aberta, THEN `closed_at` SHALL aceitar `NULL`.
- IF um item não possuir observações, THEN `order_items.notes` SHALL aceitar `NULL`.
- IF um `Work` usado em um item for excluído futuramente, THEN `order_items` SHALL preservar `work_id`, `work_name` e `unit_price` sem cascade delete.
- IF o preço de um `Work` mudar futuramente, THEN itens já persistidos SHALL manter seu `unit_price` histórico.
- IF o nome de um `Work` mudar futuramente, THEN itens já persistidos SHALL manter seu `work_name` histórico.
- IF Drizzle SQLite não gerar check constraint para enum de status, THEN a tipagem TypeScript/Drizzle SHALL continuar restringindo o domínio e validações de service deverão reforçar a regra em fases posteriores.
- IF a estratégia de número sequencial exigir metadados globais, THEN `app_meta` SHALL ser decidido antes da implementação; caso contrário, `app_meta` SHALL permanecer fora do escopo desta task.

## Fora De Escopo

- Implementar services, repositories, hooks, query keys ou mutations de `orders`.
- Implementar telas ou rotas para criação, listagem, edição, fechamento ou cancelamento de notas.
- Alterar `src/app/(tabs)/notas.tsx`.
- Alterar o módulo `works`, exceto se for estritamente necessário por incompatibilidade de tipos.
- Migrar valores monetários de `real` para centavos inteiros.
- Criar `contracts.ts`, `tasks.md`, `summary.md` ou qualquer aprovação de execução durante este comando.
- Criar commits, PRs ou mover a issue para revisão.

## Critérios De Aceite Verificáveis

- Existe `src/database/schemas/orders.schema.ts` com tabela `orders` e campos planejados.
- Existe `src/database/schemas/order-items.schema.ts` com tabela `order_items` e campos planejados.
- `src/database/client.ts` registra `orders` e `orderItems` em `databaseSchemas`.
- Existe `src/modules/orders/types/orders.types.ts` com `OrderStatus`, `Order`, `OrderItem` e `OrderWithItems`.
- A migration gerada contém criação de `orders`.
- A migration gerada contém criação de `order_items`.
- A migration mostra `customer_phone` como nullable.
- A migration mostra `canceled_at` como nullable.
- A migration não contém cascade delete entre `works` e `order_items`.
- `order_items` contém colunas obrigatórias `work_name` e `unit_price`.
- `drizzle/migrations.js` importa e registra a nova migration SQL.
- `bun run typecheck` passa.
- `bun run lint` passa.
