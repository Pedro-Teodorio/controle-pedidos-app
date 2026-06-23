# AGENTS.md

## Escopo

Este diretório contém os módulos de domínio do app. Cada módulo deve agrupar UI, hooks, schemas, services, repositories e types relacionados a uma mesma área funcional.

## Estrutura Recomendada

Para novos módulos, siga a estrutura:

```txt
src/modules/<module-name>/
  components/
  screens/
  hooks/
    queries/
    mutations/
  repositories/
  services/
  schemas/
  types/
```

## Responsabilidades Por Camada

## `screens`

- Orquestram componentes, hooks e navegação.
- Podem usar `useRouter` e parâmetros de rota.
- Não devem acessar Drizzle diretamente.
- Não devem conter validação de negócio persistente.
- Devem delegar formulário para components quando fizer sentido.

## `components`

- Contêm UI específica do módulo.
- Podem conhecer tipos do domínio.
- Devem receber dados e callbacks por props.
- Não devem executar queries/mutations quando forem componentes puramente visuais.
- Componentes muito reutilizáveis devem ir para `src/shared`.

## `hooks/queries`

- Encapsulam `useQuery`.
- Devem usar factories de query options.
- Devem retornar resultados tipados.
- Não devem montar regra de negócio complexa.

## `hooks/mutations`

- Encapsulam `useMutation`.
- Devem chamar services, não repositories.
- Devem invalidar query keys relacionadas após sucesso.
- Para TanStack Query v5, retorne ou aguarde invalidations quando o estado pending precisar aguardar refetch.

## `hooks/<module>.query-keys.ts`

- Deve centralizar query keys do módulo.
- Query keys devem ser arrays serializáveis.
- Query keys devem incluir todos os parâmetros que alteram o resultado.
- Deve existir uma chave raiz, como `all`.

## `services`

- Concentram regras de negócio.
- Validam dados antes de persistir.
- Normalizam strings, datas, status e valores.
- Geram IDs quando necessário.
- Definem timestamps como `createdAt` e `updatedAt`.
- Chamam repositories.
- Não devem importar React, React Native ou hooks.

## `repositories`

- São a única camada do módulo que acessa Drizzle.
- Devem importar `db` e schemas.
- Devem encapsular queries SQL/Drizzle.
- Devem retornar dados tipados.
- Não devem conter regra de apresentação.
- Não devem formatar dados para UI.

## `schemas`

- Concentram schemas de validação do módulo.
- Use Zod para validação e transformação.
- Separe input de output quando houver transformações.
- Mensagens de erro devem ser claras para o usuário.

## `types`

- Concentram tipos do domínio.
- Separe tipos de input, dados persistidos, filtros e opções de UI.
- Evite tipos duplicados que representam a mesma entidade.

## Padrão TanStack Query

- Use `queryOptions` para centralizar `queryKey`, `queryFn`, `staleTime` e `gcTime`.
- Use query key factory por módulo.
- Mutations devem invalidar a chave raiz do módulo quando a alteração impactar listas, contadores ou detalhes.
- Não use strings soltas de query key espalhadas pelo código.

## Padrão React Hook Form E Zod

- Formulários devem usar `react-hook-form`.
- Inputs controlados em React Native devem usar `Controller`.
- Validação deve usar `zodResolver`.
- Transformações de input devem ficar no schema quando forem parte do contrato do formulário.
- Services ainda devem validar invariantes críticas, porque a UI não é fronteira confiável.

## Boas Práticas

- SOLID: mantenha responsabilidades separadas por camada.
- DRY: extraia duplicações reais, não abstrações especulativas.
- Clean Code: nomes devem expressar intenção do domínio.
- KISS: prefira fluxos simples e explícitos.
- YAGNI: não crie factories, stores ou providers antes da necessidade.
- Imutabilidade: evite mutar arrays e objetos recebidos por parâmetro.
- Baixo acoplamento: módulo não deve depender de detalhes internos de outro módulo.
- Alta coesão: arquivos dentro de um módulo devem tratar do mesmo domínio.

## Regras Para Novos Módulos

- Crie service antes de repository quando houver regra de negócio.
- Crie repository apenas se houver acesso a dados.
- Crie query keys antes de hooks de query.
- Crie schemas para formulários com validação.
- Use `@/shared` para UI e utils reutilizáveis.
- Não importe código de `src/app`.

## Exemplos De Implementação

### Estrutura De Um Módulo

```txt
src/modules/orders/
  components/
    OrderCard.tsx
    OrderForm.tsx
  screens/
    OrderListScreen.tsx
    CreateOrderScreen.tsx
    EditOrderScreen.tsx
  hooks/
    queries/
      orders.query-options.ts
      use-orders.ts
    mutations/
      use-create-order-mutation.ts
      use-edit-order-mutation.ts
    orders.query-keys.ts
  repositories/
    orders.repository.ts
  services/
    orders.service.ts
  schemas/
    order.form.schema.ts
  types/
    orders.types.ts
```

### Query Key Factory

```ts
export const ordersQueryKeys = {
  all: ['orders'] as const,
  findAll: () => ['orders', 'findAll'] as const,
  findAllWithFilters: (filters: FindAllOrdersFilters) =>
    ['orders', 'findAll', filters] as const,
  findById: (id: string) => ['orders', 'detail', id] as const,
};
```

Boas práticas TanStack Query: query keys são arrays, devem ser serializáveis e devem conter variáveis que mudam o resultado.

### Query Options

```ts
export const ordersQueryOptions = {
  findAll: (filters: FindAllOrdersFilters = {}) =>
    queryOptions({
      queryKey: ordersQueryKeys.findAllWithFilters(filters),
      queryFn: () => ordersService.findAll(filters),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }),
};
```

Use `queryOptions` para centralizar `queryKey`, `queryFn` e configurações padrão.

### Query Hook

```ts
export const useOrders = (
  filters: FindAllOrdersFilters = {}
): UseQueryResult<Order[], Error> => {
  return useQuery(ordersQueryOptions.findAll(filters));
};
```

Hooks devem ser pequenos e apenas adaptar TanStack Query para o módulo.

### Mutation Hook

```ts
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      });
    },
  });
};
```

Mutations chamam services e invalidam queries do módulo.

### Service

```ts
const createOrder = async (input: CreateOrderInput): Promise<void> => {
  if (!input.customerName.trim()) {
    throw new Error('Nome do cliente é obrigatório');
  }

  await ordersRepository.create({
    id: generateId(),
    customerName: input.customerName.trim(),
    total: input.total,
    status: input.status ?? 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};
```

Services concentram regra de negócio, validação e normalização.

### Repository

```ts
const findAllOrders = async (
  filters: FindAllOrdersFilters
): Promise<Order[]> => {
  const conditions = [];

  if (filters.search?.trim()) {
    conditions.push(like(orders.customerName, `%${filters.search.trim()}%`));
  }

  return await db
    .select()
    .from(orders)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(orders.customerName));
};
```

Repositories encapsulam Drizzle e não formatam dados para UI.

### Schema Zod Para Formulário

```ts
export const orderFormSchema = z.object({
  customerName: z.string().trim().min(1, 'Informe o nome do cliente'),
  total: z.coerce.number().positive('Informe um total válido'),
  notes: z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});
```

Transformações de input pertencem ao schema quando fazem parte do contrato do formulário.

### Form Com React Hook Form

```tsx
const form = useForm<OrderFormInput, unknown, OrderFormData>({
  resolver: zodResolver(orderFormSchema),
  values: {
    customerName: defaultValues?.customerName ?? '',
    total: defaultValues?.total ?? 0,
    notes: defaultValues?.notes ?? null,
  },
});
```

A UI valida com Zod, mas o service ainda valida invariantes críticas.

## Referências

- TanStack Query v5: query keys, `queryOptions`, mutations e invalidation.
- React Hook Form: `Controller` para inputs controlados em React Native.
- Zod: schemas como contrato de validação e transformação de input.
- Drizzle ORM: repositories com queries type-safe.
