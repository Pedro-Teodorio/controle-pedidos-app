# Plano Técnico: LMX-33 - Banco de orders e order items

## Objetivo

Criar a base persistente para notas e itens usando Drizzle ORM + Expo SQLite, com schemas `orders` e `order_items`, tipos TypeScript do domínio `orders`, migration empacotável no app Expo e registro dos schemas no client do banco.

## Abordagem Técnica

1. Criar schemas Drizzle separados em `src/database/schemas`:
   - `orders.schema.ts` para a tabela `orders`.
   - `order-items.schema.ts` para a tabela `order_items`.
   - Não criar `app-meta.schema.ts` nesta fase, salvo se a implementação de numeração sequencial for explicitamente definida antes da execução. A necessidade de `app_meta` permanece como premissa/lacuna.

2. Registrar os novos schemas em `src/database/client.ts` no objeto `databaseSchemas`.

3. Criar o módulo mínimo de tipos em `src/modules/orders/types/orders.types.ts`, mantendo a camada de domínio independente de Drizzle.

4. Gerar migration com `bun run db:generate` após criar/registrar schemas.

5. Atualizar `drizzle/migrations.js` para importar e expor a nova migration SQL no formato usado por Expo/Drizzle.

6. Validar com os comandos já existentes no projeto:
   - `bun run typecheck`
   - `bun run lint`

## Modelo De Dados Planejado

### `orders`

Campos previstos:

- `id`: `text`, primary key, obrigatório.
- `number`: `integer`, obrigatório, número sequencial da nota.
- `customerName`: coluna `customer_name`, `text`, obrigatório.
- `customerPhone`: coluna `customer_phone`, `text`, nullable.
- `notes`: `text`, nullable.
- `status`: `text`, enum TypeScript/Drizzle com valores `open`, `closed`, `canceled`, obrigatório.
- `total`: `real`, obrigatório, alinhado ao padrão atual de `works.price`.
- `createdAt`: coluna `created_at`, `text`, obrigatório.
- `updatedAt`: coluna `updated_at`, `text`, obrigatório.
- `closedAt`: coluna `closed_at`, `text`, nullable.
- `canceledAt`: coluna `canceled_at`, `text`, nullable.

### `order_items`

Campos previstos:

- `id`: `text`, primary key, obrigatório.
- `orderId`: coluna `order_id`, `text`, obrigatório.
- `patientName`: coluna `patient_name`, `text`, obrigatório.
- `workId`: coluna `work_id`, `text`, obrigatório, sem foreign key para `works`.
- `workName`: coluna `work_name`, `text`, obrigatório, snapshot histórico.
- `quantity`: `real`, obrigatório.
- `unitPrice`: coluna `unit_price`, `real`, obrigatório, snapshot histórico.
- `totalPrice`: coluna `total_price`, `real`, obrigatório.
- `notes`: `text`, nullable.
- `createdAt`: coluna `created_at`, `text`, obrigatório.
- `updatedAt`: coluna `updated_at`, `text`, obrigatório.

## Relacionamentos E Constraints

- `order_items.work_id` SHALL ser armazenado como texto obrigatório sem constraint de foreign key para `works.id`, para não apagar, bloquear ou alterar itens históricos quando um serviço for removido.
- `order_items.work_name` e `order_items.unit_price` SHALL ser snapshots obrigatórios para preservar histórico.
- `order_items.order_id` SHOULD referenciar `orders.id` com foreign key, desde que a migration gerada seja revisada para não introduzir comportamento incompatível com preservação de notas. Se houver delete behavior configurável, não usar cascade sem decisão explícita posterior.
- `orders.status` SHOULD usar enum Drizzle/TypeScript `open | closed | canceled`; restrição SQL de check só será adicionada se compatível com o padrão do projeto e com Drizzle Kit para SQLite/Expo.

## Fluxo De Dados Previsto

1. Futuras telas ou services criarão um `Order` com dados do cliente, status e total calculado.
2. Futuras regras de negócio criarão `OrderItem` a partir de um `Work`, copiando `work.name` para `workName` e `work.price` para `unitPrice`.
3. O banco persistirá a nota em `orders` e cada item em `order_items`.
4. A exibição histórica futura deverá usar os snapshots de `order_items`, não joins dinâmicos com `works`.
5. A migration será carregada no bootstrap atual via `src/app/_layout.tsx` e `drizzle/migrations.js`, sem alteração de rotas nesta fase.

## Arquivos Exatos Previstos Para Criação

- `src/database/schemas/orders.schema.ts`
- `src/database/schemas/order-items.schema.ts`
- `src/modules/orders/types/orders.types.ts`
- `drizzle/[nova_migration].sql` gerado por `bun run db:generate`
- `drizzle/meta/[novo_snapshot].json` gerado por `bun run db:generate`

## Arquivos Exatos Previstos Para Modificação

- `src/database/client.ts`
- `drizzle/migrations.js`
- `drizzle/meta/_journal.json` gerado/atualizado por `bun run db:generate`

## Arquivos Que Não Devem Ser Alterados Nesta Task

- `src/app/**`, salvo necessidade não prevista.
- `src/modules/works/**`, salvo se uma incompatibilidade real for identificada.
- `src/shared/**`, pois não há necessidade de utilitário genérico novo.
- Configurações Expo/NativeWind/Metro/Babel.
- `package.json`, pois não há nova dependência planejada.

## Tipos TypeScript Previstos

Em `src/modules/orders/types/orders.types.ts`:

- `OrderStatus = 'open' | 'closed' | 'canceled'`.
- `Order` com campos camelCase equivalentes à tabela `orders`.
- `OrderItem` com campos camelCase equivalentes à tabela `order_items`.
- `OrderWithItems` contendo `items: OrderItem[]`.
- `CreateOrderInput` e `CreateOrderItemInput` para fases posteriores, sem implementar service agora.
- `CreateOrderData` e `CreateOrderItemData` para persistência futura.
- `UpdateOrderInput`/`UpdateOrderData` se necessários para operações futuras de fechamento/cancelamento.
- `FindAllOrdersFilters` para consistência com padrões de consulta futuros.

## Riscos

- Uso de `real` para valores monetários é consistente com `works.price`, mas pode carregar risco de precisão decimal.
- Estratégia final de `number` sequencial não está completamente definida; sem `app_meta`, fases futuras podem usar `max(number) + 1`, com risco de concorrência baixo no cenário local, mas existente.
- Foreign key de `order_items.order_id` precisa ser revisada na migration para evitar cascade indesejado.
- Drizzle enum em SQLite pode não gerar check constraint; a garantia de status pode depender de TypeScript/services em fases posteriores.
- Não há script de testes configurado; validação automatizada disponível é typecheck e lint.

## Premissas

- O PRD principal prevalece sobre divergência menor no plano de wireframe, portanto `orders.total` será incluído.
- `customer_phone` e `canceled_at` são nullable conforme critério de aceite.
- `workName` e `unitPrice` são campos obrigatórios em `order_items`.
- Não haverá cascade delete entre `works` e `order_items`; preferencialmente não haverá FK entre essas tabelas.
- Esta task é apenas infraestrutura de banco e tipos; UI, services, repositories e hooks de orders ficam para fases posteriores, salvo se outro comando aprovado ampliar o escopo.

## Validações Recomendadas

- Conferir manualmente o SQL gerado para garantir:
  - tabela `orders` criada com campos corretos;
  - tabela `order_items` criada com campos corretos;
  - `customer_phone` aceita nulo;
  - `canceled_at` aceita nulo;
  - não existe cascade delete entre `works` e `order_items`;
  - `work_name` e `unit_price` existem como colunas obrigatórias.
- Executar `bun run typecheck`.
- Executar `bun run lint`.
- Revisar `drizzle/migrations.js` para confirmar que a nova migration será empacotada no app Expo.
