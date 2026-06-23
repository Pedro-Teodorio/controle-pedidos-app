# AGENTS.md

## Escopo

Este diretório contém a configuração local de banco SQLite via `expo-sqlite`, integração com Drizzle ORM e schemas do banco.

## Responsabilidades

- Centralizar o client Drizzle.
- Declarar schemas SQLite.
- Exportar os schemas usados pelo client.
- Servir como base para geração de migrações.

## Estrutura

```txt
src/database/
  client.ts
  schemas/
```

## `client.ts`

- Deve abrir o banco com `openDatabaseSync`.
- Deve usar o nome `controle-pedidos.db`.
- Deve inicializar Drizzle com os schemas registrados.
- Deve exportar `db`.
- Deve exportar `databaseSchemas` quando necessário.

## `schemas`

- Cada entidade/tabela deve ter seu próprio arquivo de schema.
- Use `sqliteTable` para declarar tabelas.
- Use tipos SQLite adequados: `text`, `real`, `integer`, etc.
- Campos obrigatórios devem usar `.notNull()`.
- IDs devem ser declarados como primary key quando aplicável.
- Enums devem ser declarados com `as const` e reutilizados no schema.

## Drizzle ORM

- Repositories devem consumir os schemas e o `db`.
- Services não devem importar `db`.
- Screens e components nunca devem importar `db`.
- Prefira queries type-safe do Drizzle.
- Use operadores do Drizzle como `eq`, `and`, `like`, `asc` e `count`.

## Migrações

- Gere migrações com `bun run db:generate`.
- Preserve `drizzle.config.ts` com `dialect: 'sqlite'`.
- Preserve `drizzle.config.ts` com `driver: 'expo'`.
- Preserve `drizzle.config.ts` com `schema: './src/database/schemas/*'`.
- Preserve `drizzle.config.ts` com `out: './drizzle'`.
- Não edite migrations geradas manualmente sem motivo claro.
- Em Expo/React Native, migrations precisam ser empacotadas no app.
- Após gerar `.sql`, garanta que `drizzle/migrations.js` importe o arquivo gerado.
- Preserve suporte a `.sql` no bundler via `babel-plugin-inline-import` e `metro.config.js`.

## Alterações De Schema

- Atualize o schema em `src/database/schemas`.
- Gere migration com `bun run db:generate`.
- Revise o SQL gerado.
- Atualize types do módulo afetado.
- Atualize repositories e services.
- Rode `bun run typecheck`.
- Rode `bun run lint`.

## Boas Práticas

- SOLID: banco é infraestrutura; domínio fica em services.
- DRY: não duplique definição de campos entre schemas e tipos sem necessidade.
- Clean Code: nomes de colunas devem ser claros e estáveis.
- Segurança: não interpole SQL manualmente quando Drizzle resolver.
- Integridade: preserve `createdAt` e `updatedAt` em formato ISO quando seguir o padrão atual.
- Evolução incremental: mudanças de schema devem ser pequenas e migráveis.

## Exemplos De Implementação

### Schema Drizzle SQLite

```ts
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const orderStatus = ['open', 'closed', 'cancelled'] as const;

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  total: real('total').notNull(),
  status: text('status', { enum: orderStatus }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

Use `as const` para enums e tipos SQLite adequados para cada coluna.

### Registro No Client

```ts
import { orders } from '@/database/schemas/orders.schema';
import { works } from '@/database/schemas/works.schema';

export const databaseSchemas = {
  orders,
  works,
};

export const sqliteDatabase = openDatabaseSync('controle-pedidos.db');

export const db = drizzle(sqliteDatabase, {
  schema: databaseSchemas,
});
```

Todo novo schema deve ser registrado em `databaseSchemas`.

### Configuração Drizzle Kit

```ts
export default defineConfig({
  schema: './src/database/schemas/*',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
});
```

Preserve `driver: 'expo'`, porque migrations Expo SQLite precisam ser geradas para bundle no app.

### Uso Correto Em Repository

```ts
const countOpenOrders = async (): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, 'open'));

  return result[0]?.count ?? 0;
};
```

Acesso ao banco deve ficar em repositories, nunca em screens ou components.

### Fluxo De Alteração De Schema

```txt
1. Alterar ou criar schema em src/database/schemas.
2. Registrar schema em src/database/client.ts.
3. Rodar bun run db:generate.
4. Revisar SQL gerado em drizzle/.
5. Garantir import em drizzle/migrations.js.
6. Atualizar types, repository e service do módulo afetado.
7. Rodar bun run typecheck.
8. Rodar bun run lint.
```

## Referências

- Drizzle ORM: schemas TypeScript-first, queries type-safe e Drizzle Kit.
- Expo SQLite: banco local empacotado e acessado dentro do app Expo.
- Drizzle Expo SQLite: migrations via `useMigrations` antes da renderização das rotas.
