# Task Context: LMX-33 - Fase 3 - Banco de orders e order items

## Metadata

Provider: linear
ID: LMX-33
Title: Fase 3 - Banco de orders e order items
Origin: https://linear.app/pedro-teodorio/issue/LMX-33/fase-3-banco-de-orders-e-order-items
Context created at: 2026-06-26T17:49:37
Project: Controle de Pedidos APP
Milestone: Marco 3 - Orders base
Priority: High
Team: Lumos-X
Assignee: Pedro Lucas
Suggested branch: `git checkout -b LMX-33-fase-3-banco-de-orders-e-order-items`

## Provider Status Sync

Provider: linear
Previous status: Todo
New status: In Progress
Sync result: updated
Synced at: 2026-06-26T17:49:37

## Raw Description

```markdown
## Objetivo

Criar estrutura persistente para notas e itens usando `orders` e `order_items`.

## Entregáveis

* Schemas `orders`, `order_items` e `app_meta` se necessário.
* Registrar schemas em `src/database/client.ts`.
* Gerar migration com `bun run db:generate`.
* Atualizar `drizzle/migrations.js`.
* Criar tipos em `src/modules/orders/types/orders.types.ts`.

## Critérios de aceite

* Tabelas criadas corretamente.
* `customer_phone` e `canceled_at` aceitam nulo.
* Não usar cascade delete entre `works` e `order_items`.
* Snapshots `workName` e `unitPrice` preservam histórico.
* `bun run typecheck` e `bun run lint` passam.
```

## Extracted Keywords

- orders
- order_items
- app_meta
- Drizzle ORM
- Expo SQLite
- migrations
- database schema
- order persistence
- item snapshots
- workName
- unitPrice
- customer_phone nullable
- canceled_at nullable
- no cascade delete
- TypeScript types

## Open Questions From Input

- `app_meta` é realmente necessário para esta fase ou apenas opcional para controle de versão/metadados?
- Quais campos completos devem existir em `orders` além de `customer_phone` e `canceled_at`?
- Quais campos completos devem existir em `order_items` além dos snapshots `workName` e `unitPrice`?
- Deve existir relacionamento por chave estrangeira entre `order_items.work_id` e `works.id` sem cascade, ou o vínculo deve ser apenas por snapshot/ID textual?
- Quais convenções de valores monetários devem ser usadas para `unitPrice` e totais: inteiro em centavos, real/float ou texto decimal?
