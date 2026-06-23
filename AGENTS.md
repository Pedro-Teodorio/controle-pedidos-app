# AGENTS.md

## Projeto

- App Expo/React Native com `expo-router`; o entrypoint declarado é `expo-router/entry` e as rotas ficam em `src/app`, não em uma pasta `app` na raiz.
- O alias TypeScript principal é `@/* -> src/*`; também existem `@shared/*`, `@modules/*` e `@styles/*`.
- `app.json` habilita `experiments.tsconfigPaths` e `experiments.typedRoutes`; preserve isso ao mexer em rotas ou aliases.
- Use Bun como gerenciador: `packageManager` é `bun@1.3.13` e o lockfile é `bun.lock`.
- O banco local é SQLite via `expo-sqlite`, com acesso tipado por Drizzle ORM.
- A UI usa NativeWind/Tailwind, `tailwind-variants`, `tailwind-merge` e componentes compartilhados em `src/shared`.

## Estrutura Principal

- `src/app`: rotas, layouts e bootstrap do app com Expo Router.
- `src/modules`: domínios funcionais do produto, como `works`.
- `src/database`: client SQLite/Drizzle e schemas do banco.
- `src/shared`: UI, componentes, hooks e utils reutilizáveis e independentes de domínio.
- `drizzle`: migrations geradas pelo Drizzle Kit para serem empacotadas no app Expo.

## Comandos

- Instalar dependências: `bun install`.
- Dev server: `bun run start`.
- Gerar projetos nativos: `bun run prebuild`.
- Android/iOS nativo: `bun run android` / `bun run ios`.
- Verificação disponível: `bun run lint` e `bun run typecheck`.
- Formatação: `bun run format` roda ESLint `--fix` e Prettier com `prettier-plugin-tailwindcss`.
- Gerar migrações: `bun run db:generate`.
- Não há script de testes configurado em `package.json`; não invente comando de teste sem adicionar a ferramenta correspondente.

## Arquitetura

- Rotas devem ser finas e delegar implementação para screens dos módulos.
- Módulos concentram UI do domínio, hooks de dados, validações, services, repositories e types.
- Services concentram regra de negócio, validações críticas, normalização, IDs e timestamps.
- Repositories são a única camada de domínio que acessa Drizzle diretamente para consultas de negócio.
- Exceção de bootstrap: `src/app/_layout.tsx` pode importar `db` apenas para executar `useMigrations(db, migrations)` antes da renderização das rotas.
- `shared` não deve importar código de `src/modules` ou `src/app`.
- `src/database` não deve conhecer UI, navegação ou regra de apresentação.
- Prefira fronteiras explícitas entre `app`, `modules`, `database` e `shared`.

## Boas Práticas

- Aplique SOLID de forma pragmática: uma responsabilidade clara por arquivo/camada e dependências apontando para abstrações estáveis do projeto.
- Aplique DRY para duplicação real; não crie abstrações prematuras para cenários ainda inexistentes.
- Aplique Clean Code: nomes claros, funções pequenas, baixo acoplamento, alta coesão e erros compreensíveis.
- Prefira KISS e YAGNI: a solução mais simples correta é melhor que uma arquitetura especulativa.
- Use TypeScript com tipos explícitos nas fronteiras: inputs, outputs, filtros, entidades persistidas e props públicas.
- Preserve imutabilidade: não mute objetos/arrays recebidos por parâmetro.
- Valide dados na UI para experiência do usuário, mas mantenha invariantes críticas nos services.
- Evite compatibilidade retroativa sem necessidade concreta, como dados persistidos, comportamento já entregue ou consumidores externos.

## Expo Router

- Preserve `experiments.typedRoutes` e `experiments.tsconfigPaths`.
- Use grupos como `(tabs)` para organização sem alterar URL.
- Use arquivos dinâmicos como `[id].tsx` para parâmetros de rota.
- Use `_layout.tsx` para layouts compartilhados e providers globais.
- Não mova rotas para `app/` na raiz.
- Não coloque regra de negócio em arquivos de rota.

## TanStack Query

- Use query key factories por domínio.
- Use `queryOptions` para centralizar `queryKey`, `queryFn`, `staleTime` e `gcTime`.
- Mutations devem chamar services, não repositories.
- Mutations devem invalidar queries relacionadas via `queryClient.invalidateQueries`.
- Query keys devem ser arrays serializáveis e conter todas as variáveis que alteram o resultado da query.

## Drizzle e SQLite

- Schemas ficam em `src/database/schemas/*`.
- `src/database/client.ts` centraliza `openDatabaseSync`, schemas e `drizzle`.
- `drizzle.config.ts` gera arquivos em `drizzle/` com `driver: 'expo'`.
- `src/app/_layout.tsx` importa `db` e `../../drizzle/migrations` para executar `useMigrations` antes de renderizar as rotas.
- Para novas migrações Expo/React Native, mantenha `drizzle/migrations.js` importando o `.sql` gerado.
- O bundler aceita `.sql` por causa de `babel-plugin-inline-import` e `metro.config.js`; preserve essa cadeia.

## UI e Styling

- NativeWind está configurado com `src/styles/global.css`; o Tailwind só escaneia `./src/**/*.{ts,tsx}`.
- Preserve a cadeia NativeWind em `babel.config.js` e `metro.config.js`: `jsxImportSource: 'nativewind'`, `nativewind/babel`, `withNativeWind` e suporte a `.sql`.
- `babel.config.js` também usa `react-native-worklets/plugin`; não remova nem reordene sem validar Reanimated/Bottom Sheet.
- Use `className` para estilos e preserve o padrão visual existente.
- Use `tailwind-variants` para variantes reutilizáveis de componentes.
- Rode `bun run format` após mudanças grandes de UI para ordenar classes.

## Cuidados

- `android/`, `ios/`, `.expo/`, `node_modules/` e `expo-env.d.ts` são ignorados; evite basear mudanças nesses artefatos gerados.
- O app usa `react-native-get-random-values` no layout raiz antes de gerar UUIDs; não remova esse import se mexer no bootstrap.
- Rotas de abas estão em `src/app/(tabs)/_layout.tsx`; rotas de criação/edição de serviços estão em `src/app/works`.
- Ao trabalhar em serviços/works, siga `src/modules/works`: screens, components, hooks React Query, service e repository.
- Mutations invalidam `worksQueryKeys.all`; preserve a fábrica de query keys em `src/modules/works/hooks/works.query-keys.ts` ao adicionar queries.

## Exemplos De Implementação

### Rota Fina Com Expo Router

```ts
import { CreateWorkScreen } from '@/modules/works/screens/CreateWorkScreen';

export default CreateWorkScreen;
```

Use este padrão quando a rota apenas conecta uma URL a uma screen de módulo.

### Mutation Com Invalidação TanStack Query

```ts
export const useCreateEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntityInput) => entityService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: entityQueryKeys.all,
      });
    },
  });
};
```

Baseado na recomendação do TanStack Query v5 de invalidar queries relacionadas após mutations.

### Service Como Fronteira De Regra De Negócio

```ts
const createEntity = async (input: CreateEntityInput): Promise<void> => {
  validateCreateEntity(input);

  await entityRepository.create({
    id: generateId(),
    name: input.name.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};
```

Use services para validação, normalização, IDs e timestamps.

### Repository Com Drizzle

```ts
const findEntityById = async (id: string): Promise<Entity | null> => {
  const result = await db
    .select()
    .from(entities)
    .where(eq(entities.id, id))
    .limit(1);

  return result[0] ?? null;
};
```

Repositories acessam Drizzle diretamente; screens, components e services não devem importar `db`.

## Referências

- Expo Router: file-based routing, route groups, dynamic routes e typed routes.
- TanStack Query v5: query keys, `queryOptions`, mutations e invalidation.
- Drizzle ORM + Expo SQLite: schemas, `drizzle.config.ts`, migrations e `useMigrations`.
- React Hook Form + Zod: `Controller`, validação declarativa e resolvers de schema.
- NativeWind/Tailwind: estilos via `className`, `global.css`, preset Babel e `withNativeWind`.
