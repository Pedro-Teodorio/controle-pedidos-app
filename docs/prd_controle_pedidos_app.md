# PRD — Controle de Pedidos App

## 1. Visão geral

O **Controle de Pedidos App** é um aplicativo mobile local-first para controle de notas de pedidos de serviços. O app será usado para cadastrar serviços, criar notas com pacientes vinculados a serviços, calcular totais, finalizar notas, gerar PDF e compartilhar pelo WhatsApp.

O produto deve ser simples, rápido e confiável para uso diário, funcionando offline e mantendo todos os dados no próprio aparelho.

---

## 2. Objetivo do produto

Criar um app que permita controlar notas de serviços de forma organizada, substituindo listas manuais e reduzindo erros de soma, duplicidade e conferência.

O app deve permitir:

- Cadastrar serviços
- Ativar, inativar e excluir serviços permanentemente quando necessário
- Criar notas de pedido
- Informar telefone opcional do cliente
- Adicionar pacientes à nota
- Vincular cada paciente a um serviço
- Definir quantidade e valor
- Calcular total automaticamente
- Finalizar notas
- Gerar PDF
- Compartilhar pelo WhatsApp
- Consultar histórico local
- Fazer manutenção básica do app

---

## 3. Stack do projeto

A stack instalada e adotada pela base atual é:

```txt
Expo Router + React Native + TypeScript
Drizzle ORM + expo-sqlite
NativeWind + React Native
TanStack Query
Zustand
React Hook Form + Zod
expo-print
expo-sharing
expo-linking
dayjs
uuid
@gorhom/bottom-sheet
lucide-react-native
tailwind-variants
tailwind-merge
```

Dependências planejadas, ainda não instaladas no projeto atual:

```txt
expo-updates
burnt ou outra biblioteca de feedback visual
```

Gerenciador de pacotes:

```txt
bun
```

Comandos principais:

```txt
bun install
bun run start
bun run typecheck
bun run lint
bun run format
bun run db:generate
```

---

## 4. Convenção de nomenclatura

O produto usa textos, labels e linguagem de negócio em português. O código interno deve usar inglês para módulos, tipos, schemas, services, repositories, hooks, stores e nomes de campos.

Mapeamento obrigatório:

```txt
Termo de produto: Serviço
Nome técnico: Work

Termo de produto: Nota
Nome técnico: Order

Termo de produto: Item da nota
Nome técnico: OrderItem
```

Regras:

- Textos exibidos ao usuário devem ficar em português.
- Código TypeScript deve usar nomes em inglês.
- Tabelas do SQLite devem usar nomes em inglês e snake_case nas colunas.
- Rotas podem usar português quando forem parte da experiência do usuário, como a aba `notas`.
- Status internos devem ser persistidos em inglês.
- Componentes de UI, como `Badge`, devem traduzir status técnicos para labels em português.

Status internos padronizados:

```txt
WorkStatus = 'active' | 'inactive'
OrderStatus = 'open' | 'closed' | 'canceled'
```

O projeto usa a grafia `canceled` para cancelamento. Não usar `cancelled` em schemas, types, filtros ou query keys.

Labels de UI esperados:

```txt
active -> Ativo
inactive -> Inativo
open -> Aberta
closed -> Finalizada
canceled -> Cancelada
```

---

## Wireframe como referência visual

O diretório `docs/wireframe-controle-de-pedidos` é referência para UX, componentes, estados de tela, fluxos e hierarquia visual.

A arquitetura técnica oficial continua sendo a base real do projeto:

- Expo Router para navegação.
- Drizzle ORM + expo-sqlite para persistência local.
- TanStack Query para estado assíncrono.
- Zustand para rascunho temporário.
- NativeWind para styling.

Referências técnicas antigas no wireframe, como React Navigation ou AsyncStorage, não devem ser seguidas no app real.

O wireframe propõe FAB central para criação de nota. No app real, essa decisão fica condicionada à implementação do módulo `orders`. Até lá, a ação “Nova nota” pode existir como botão dentro da Home e da listagem de notas.

No curto prazo, a navegação mantém 4 tabs: Início, Notas, Serviços e Ajustes. A FAB central fica como refinamento visual da fase de `orders`, não como pré-requisito antes do módulo existir.

---

## 5. Responsabilidades das tecnologias

### Expo Router

Responsável pela navegação file-based:

- Tabs
- Stack
- Rotas dinâmicas
- Telas de criação/edição
- Fluxos de detalhe

### React Native + NativeWind

Responsável pela interface visual:

- Layouts com `View`, `Text`, `Pressable`, `TextInput`, `FlatList`, `ScrollView`
- Estilização com classes Tailwind/NativeWind
- Componentes compartilhados do design system

### Drizzle ORM + expo-sqlite

Responsável pela persistência local:

- Schemas tipados
- Queries type-safe
- Migrations Expo SQLite
- Dados offline
- Histórico local

### TanStack Query

Responsável por estado assíncrono vindo do SQLite:

- Loading
- Error
- Cache
- Refetch
- Mutations
- Invalidação de queries
- Query key factories
- `queryOptions` por domínio

### Zustand

Responsável por estado temporário:

- Rascunho da order
- Pacientes adicionados antes de salvar
- Quantidades temporárias
- Dados intermediários do fluxo de criação

### React Hook Form + Zod

Responsáveis por formulários e validação:

- Cadastro de work
- Criação de order
- Adição de paciente/serviço
- Edição de dados

### dayjs

Responsável por datas:

- Formatar datas
- Filtrar por hoje
- Definir data de criação/finalização
- Exibir datas no PDF

### uuid

Responsável por IDs internos:

- Works
- Orders
- Order items

### @gorhom/bottom-sheet

Responsável por confirmações e interações de apoio:

- Confirmação de ações destrutivas
- Bottom sheets reutilizáveis
- Dialogs de confirmação

### expo-print

Responsável por gerar PDF da nota.

### expo-sharing

Responsável por compartilhar arquivos, especialmente PDF.

### expo-linking

Responsável por abrir WhatsApp com mensagem pronta.

### expo-updates planejado

Responsável por atualizações OTA quando não envolver mudanças nativas.

### Feedback visual planejado

Responsável por feedback visual rápido:

- Sucesso
- Erro
- Avisos

Enquanto a biblioteca final não for escolhida, a base pode continuar usando `Alert` do React Native em fluxos simples.

---

## 6. Conceito principal do domínio

A nota não é apenas uma lista de serviços. Ela representa uma **nota de pedido por cliente**, onde cada linha representa um **paciente vinculado a um serviço específico**.

No código, a nota é modelada como `Order`, e cada linha da nota é modelada como `OrderItem`.

Exemplo:

```txt
Nota #0012
Cliente: Embu Guaçu

Paciente              Serviço                 Qtd   Unitário   Total
João da Silva         Copping                 2     R$ 90,00   R$ 180,00
Maria Souza           Porcelana               1     R$ 200,00  R$ 200,00
Carlos Pereira        Copping                 4     R$ 90,00   R$ 360,00

Total da nota: R$ 740,00
```

---

## 7. Entidades principais

## 7.1 Work

Representa um serviço cadastrado previamente para ser usado nas notas.

### Campos

```ts
type Work = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
```

### Regras

- Nome é obrigatório.
- Preço é obrigatório.
- Preço deve seguir a regra definida para o catálogo.
- Work nasce com `status: 'active'`.
- Work pode ser inativado via status.
- Work com `status: 'inactive'` não aparece em novas notas.
- Work com `status: 'inactive'` continua visível no filtro de inativos.
- Work pode ser excluído fisicamente para limpeza do catálogo.
- Exclusão física é destrutiva e deve exigir confirmação.
- Orders antigas preservam histórico via snapshot em `OrderItem.workName` e `OrderItem.unitPrice`.
- UI deve apresentar Work como “serviço”.

---

## 7.2 Order

Representa uma nota de pedido para um cliente.

### Campos

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

### Regras

- Cliente é obrigatório.
- Telefone do cliente é opcional.
- Número da order é sequencial.
- ID interno é UUID.
- Order nasce com `status: 'open'` quando salva como nota aberta.
- Order finalizada usa `status: 'closed'`.
- Order cancelada usa `status: 'canceled'`.
- Order com `status: 'closed'` não deve ser editada no MVP.
- Order com `status: 'canceled'` não deve ser excluída fisicamente.
- Total é calculado pelo service, não pela tela.
- `canceledAt` deve ser preenchido ao cancelar a nota.
- UI deve apresentar Order como “nota”.

---

## 7.3 OrderItem

Representa uma linha da nota: um paciente ligado a um serviço.

### Campos

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

### Regras

- Paciente é obrigatório.
- Work é obrigatório.
- Quantidade deve ser maior que zero.
- Valor unitário vem do work selecionado, mas deve ser salvo como snapshot.
- Valor total é `quantity * unitPrice`.
- `workName` e `unitPrice` devem ser salvos no item para preservar histórico.
- Se o work mudar de preço depois, orders antigas não devem mudar.
- `workId` é obrigatório no momento de criação do item, mas o histórico não deve depender da existência futura do `Work`.
- A exclusão física de `Work` não pode apagar, bloquear ou alterar `OrderItem`; não usar cascade delete para histórico.

---

## 7.4 CompanySettings

Representa configurações locais da empresa usadas principalmente na emissão de PDF. Quando esses dados forem necessários para o PDF, devem ser persistidos no SQLite via `company-settings.schema.ts`.

### Campos

```ts
type CompanySettings = {
  name: string;
  phone: string | null;
  nextOrderNumber: number | null;
  updatedAt: string;
};
```

### Regras

- Nome da empresa pode ser usado no cabeçalho do PDF.
- Telefone da empresa pode ser usado no cabeçalho do PDF.
- `nextOrderNumber` só deve existir se for necessário permitir configuração manual de numeração.
- Configurações da empresa não fazem parte de um módulo de clientes.

---

## 8. Estrutura geral do projeto

Estrutura alvo alinhada à base atual:

```txt
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      notas.tsx
      ajustes.tsx
      works/
        index.tsx
    works/
      _layout.tsx
      create.tsx
      [id].tsx
    orders/
      _layout.tsx
      create.tsx
      add-item.tsx
      [id].tsx
      [id]/
        edit.tsx

  database/
    client.ts
    schemas/
      works.schema.ts
      orders.schema.ts
      order-items.schema.ts
      app-meta.schema.ts
      company-settings.schema.ts

  modules/
    works/
      components/
      screens/
      repositories/
      services/
      schemas/
      types/
      hooks/
        works.query-keys.ts
        queries/
          works.query-options.ts
          use-works.ts
        mutations/

    orders/
      components/
      screens/
      repositories/
      services/
      schemas/
      stores/
      types/
      hooks/
        orders.query-keys.ts
        queries/
          orders.query-options.ts
          use-orders.ts
        mutations/

    home/
      screens/

    pdf/
      screens/
      services/
      templates/

    sharing/
      services/

    backup/
      services/
      types/

    settings/
      screens/
      services/
      types/

  shared/
    ui/
    components/
    hooks/
    utils/
    constants/
    types/

drizzle/
  migrations.js
  *.sql
  meta/
```

---

## 9. Padrão arquitetural

O app deve seguir o fluxo:

```txt
Route -> Screen -> Hook TanStack Query -> Service -> Repository -> Drizzle/SQLite
```

Para estado temporário de orders:

```txt
Screen -> Zustand Draft Store -> Service -> Repository -> Drizzle/SQLite
```

Regras:

- Arquivos em `src/app` apenas conectam rotas às screens.
- Screens não acessam Drizzle diretamente.
- Repositories são a única camada de domínio que acessa `db`.
- Services concentram regra de negócio, validações críticas, normalização, IDs e timestamps.
- Hooks de query/mutation controlam cache, loading e invalidação.
- Zustand não substitui SQLite.
- Mutations devem chamar services, não repositories.
- Query keys devem ser factories por domínio.
- Queries devem usar `queryOptions` para centralizar `queryKey`, `queryFn`, `staleTime` e `gcTime`.
- `shared` não deve importar código de `src/modules` ou `src/app`.
- Rotas existentes de placeholder devem virar rotas finas antes de receber regra real.

Exemplo de rota fina:

```ts
import { OrderListScreen } from '@/modules/orders/screens/OrderListScreen';

export default OrderListScreen;
```

---

# 10. Fases de implementação

---

## Fase 0 — Fundação do projeto

### Objetivo

Garantir que a base do app esteja estável antes das funcionalidades de negócio.

### Entregáveis

- Expo Router configurado.
- NativeWind configurado.
- TanStack Query configurado.
- SQLite/Drizzle configurado.
- Migrations funcionando.
- Estrutura inicial de pastas criada.
- Aliases TypeScript configurados.
- `react-native-get-random-values` carregado no layout raiz.
- Gesture Handler configurado com `GestureHandlerRootView`.

### Critérios de aceite

- App abre sem erro.
- Navegação por tabs funciona.
- NativeWind aplica estilos corretamente.
- Banco local inicializa com `controle-pedidos.db`.
- Drizzle conecta ao SQLite.
- Migrations rodam antes da renderização das rotas.
- Provider do TanStack Query está ativo.
- `bun run typecheck` passa.
- `bun run lint` passa.

---

## Fase 1 — Design system base

### Objetivo

Criar uma base visual consistente usando NativeWind e componentes padrão do React Native.

### Componentes esperados

- `Button`
- `Input`
- `MoneyInput`
- `TextArea`
- `Card`
- `Badge`
- `MoneyText`
- `Toggle`
- `FooterActions`
- `ScreenContainer`
- `ListScreenContainer`
- `EmptyState`
- `ConfirmDialog`
- `ScreenHeader`
- `SearchInput`
- `FilterChips`
- `LoadingState`
- `ErrorState`
- `QuantityStepper`
- `Toast`
- `DashboardMetricCard`
- `OrderItemRow`
- `OrderTotalCard`
- `SheetActionItem`

### Regras visuais

- Fundo padrão: `bg-slate-50`.
- Cards: `rounded-2xl border border-slate-200 bg-white p-4` ou padrão visual equivalente já usado.
- Botão primário: `bg-blue-600 text-white`.
- Botão destrutivo: `bg-red-600 text-white`.
- Total monetário: `text-blue-600 font-bold`.
- Status com badges semânticos.
- Componentes compartilhados devem aceitar composição via props e `className` quando fizer sentido.
- Campos monetários devem usar `MoneyInput` ou formatação BRL consistente.
- O campo de preço do serviço deve usar `MoneyInput`; não estender `Input` genérico com prefixo/sufixo sem necessidade concreta.

### Regra importante de layout

Telas com `FlatList` não devem usar `ScrollView` externo.

Usar:

- `ScreenContainer` para telas simples/formulários.
- `ListScreenContainer` para telas com listas.
- `FooterActions` para telas com ações fixas de rodapé.

### Critérios de aceite

- Componentes renderizam corretamente.
- Componentes aceitam variações principais.
- Inputs exibem erro.
- Botões possuem estado loading/disabled.
- Listas não usam `FlatList` dentro de `ScrollView`.
- Componentes compartilhados não importam módulos de domínio.

---

## Fase 2 — Serviços, módulo `works`

### Status

Funcionalidade majoritariamente implementada, com ajustes finais de UX e documentação na Fase 2.1.

### Objetivo

Permitir o gerenciamento dos serviços usados nas notas.

### Funcionalidades

- Criar serviço.
- Listar serviços ativos.
- Buscar serviço por nome.
- Editar serviço.
- Inativar serviço.
- Excluir serviço fisicamente.
- Filtrar serviços por status.

### Camadas implementadas

- Schema Drizzle `works.schema.ts`.
- Migration inicial.
- Repository de works.
- Service de works.
- Schema Zod de work.
- Hooks de queries/mutations.
- Query key factory.
- Query options factory.
- Listagem.
- Criação.
- Edição.
- Confirmação com bottom sheet.

### Critérios de aceite

- Usuário cria serviço.
- Usuário edita serviço.
- Usuário inativa serviço.
- Usuário exclui serviço permanentemente após confirmação.
- Serviço inativo não aparece em listas ativas.
- Dados persistem no SQLite.
- Queries são invalidadas após mutation.
- UI usa português, código usa `Work`/`works`.

---

## Fase 2.1 — Alinhamento do catálogo de serviços

### Objetivo

Formalizar as duas operações disponíveis para serviços: inativação e exclusão física.

### Entregáveis

- Manter o switch de status para ativar/inativar serviço.
- Manter exclusão física como ação destrutiva.
- Garantir que serviços inativos não apareçam em novas orders.
- Garantir que serviços inativos apareçam no filtro de inativos.
- Garantir que exclusão física exija confirmação.
- Garantir que exclusão física invalide `worksQueryKeys.all`.
- Ajustar textos para deixar claro que exclusão é permanente.
- Garantir que a preservação histórica dependa de snapshots em `OrderItem`.

### Critérios de aceite

- Usuário consegue ativar/inativar serviço.
- Usuário consegue excluir serviço permanentemente.
- Exclusão exige confirmação.
- Serviço inativo não aparece na criação de nota.
- Serviço excluído sai do catálogo.
- Histórico de notas permanece correto por snapshot em `OrderItem`.
- Query keys de `works` são invalidadas após inativação ou exclusão.
- `bun run typecheck` passa.
- `bun run lint` passa.

---

## Fase 3 — Banco de orders e order items

### Objetivo

Criar a estrutura persistente para notas e itens de nota usando nomenclatura técnica `orders` e `order_items`.

### Entregáveis

- Schema `orders` em `src/database/schemas/orders.schema.ts`.
- Schema `order_items` em `src/database/schemas/order-items.schema.ts`.
- Schema `app_meta` se necessário para controle de número sequencial.
- Registro dos schemas em `src/database/client.ts`.
- Migration de orders gerada com `bun run db:generate`.
- Import da migration em `drizzle/migrations.js`.
- Tipos TypeScript em `src/modules/orders/types/orders.types.ts`.

### Tabela `orders`

Campos:

- `id`
- `number`
- `customer_name`
- `customer_phone`
- `notes`
- `status`
- `total`
- `created_at`
- `updated_at`
- `closed_at`
- `canceled_at`

### Tabela `order_items`

Campos:

- `id`
- `order_id`
- `patient_name`
- `work_id`
- `work_name`
- `quantity`
- `unit_price`
- `total_price`
- `notes`
- `created_at`
- `updated_at`

### Critérios de aceite

- Migrations rodam sem erro.
- Tabelas são criadas corretamente.
- `orders.customer_phone` aceita valor nulo.
- `orders.canceled_at` aceita valor nulo e é preenchido ao cancelar.
- Relacionamento entre order e items funciona.
- `order_items.work_id` guarda a referência original do serviço, mas não deve impedir exclusão física de `works`.
- Não usar relacionamento com cascade delete entre `works` e `order_items`.
- Datas são salvas em ISO string.
- Status aceita apenas `open`, `closed` e `canceled`.
- `workName` e `unitPrice` preservam snapshot histórico.
- Alteração posterior em `works.price` não altera notas antigas.
- `bun run typecheck` passa.
- `bun run lint` passa.

---

## Fase 4 — Rascunho de order com Zustand

### Objetivo

Permitir montar uma nota antes de salvar no banco.

### Motivo

O usuário pode preencher cliente, telefone opcional, observação, adicionar vários pacientes, escolher serviços, alterar quantidades e revisar o total antes de salvar ou finalizar.

### Arquivo esperado

```txt
src/modules/orders/stores/order-draft.store.ts
```

### Store esperada

```ts
type OrderDraftItem = {
  id: string;
  patientName: string;
  workId: string;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
};

type OrderDraftStore = {
  customerName: string;
  customerPhone: string;
  notes: string;
  items: OrderDraftItem[];

  setCustomerName: (value: string) => void;
  setCustomerPhone: (value: string) => void;
  setNotes: (value: string) => void;
  addItem: (item: Omit<OrderDraftItem, 'id' | 'totalPrice'>) => void;
  updateItem: (id: string, data: Partial<OrderDraftItem>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  getTotal: () => number;
  clearDraft: () => void;
};
```

### Regras

- Não salvar no SQLite enquanto estiver apenas montando a nota.
- Recalcular total ao adicionar/remover/alterar quantidade.
- Limpar draft após salvar/finalizar.
- Manter draft ao navegar entre nova nota e adicionar item.
- Preservar imutabilidade ao atualizar arrays e objetos.

### Critérios de aceite

- Usuário adiciona item ao draft.
- Usuário remove item do draft.
- Usuário altera quantidade.
- Total recalcula corretamente.
- Draft mantém cliente, telefone opcional, observação e items entre telas.
- Draft permanece entre telas do fluxo.
- Draft é limpo após salvar/finalizar.

---

## Fase 5 — Formulários de order e order item

### Objetivo

Criar validações para dados da nota e itens.

### Schemas esperados

- `src/modules/orders/schemas/order.form.schema.ts`
- `src/modules/orders/schemas/order-item.form.schema.ts`

### Validações da order

- `customerName` obrigatório.
- `customerPhone` opcional.
- `notes` opcional.

### Validações do item

- `patientName` obrigatório.
- `workId` obrigatório.
- `quantity` maior que zero.
- `notes` opcional.

### Regras

- Zod valida contrato de formulário.
- React Hook Form deve usar `Controller` para inputs controlados.
- Services continuam validando invariantes críticas.
- Transformações de strings vazias para `null` devem ficar nos schemas quando fizer sentido.

### Critérios de aceite

- Formulário da nota valida cliente.
- Formulário da nota aceita telefone opcional.
- Formulário de item valida paciente.
- Formulário de item exige serviço.
- Quantidade inválida mostra erro.
- Mensagens de erro são claras.
- Tipos de input e output do Zod são exportados.

---

## Fase 6 — Fluxo de criação de order

### Objetivo

Criar a tela onde a nota é montada.

### Telas

- `CreateOrderScreen`
- `AddOrderItemScreen`

### Rotas

```txt
src/app/orders/create.tsx
src/app/orders/add-item.tsx
```

### Componentes

- `OrderForm`
- `OrderDraftItemCard`
- `OrderSummary`
- `AddOrderItemButton`
- `WorkSelectorList`
- `QuantityStepper`
- `FooterActions`

### Fluxo

```txt
Usuário informa cliente
↓
Usuário informa telefone opcional
↓
Usuário informa observação opcional
↓
Usuário toca em adicionar paciente/serviço
↓
Usuário informa paciente
↓
Usuário seleciona serviço ativo
↓
Usuário define quantidade
↓
Sistema calcula subtotal
↓
Item entra no draft
↓
Usuário revisa total
↓
Usuário aciona salvar ou finalizar quando a persistência estiver disponível
```

### Critérios de aceite

- Tela permite informar cliente.
- Tela permite informar telefone opcional.
- Tela permite informar observação opcional.
- Tela permite adicionar paciente/serviço.
- Tela de adicionar item contém campo “Nome do paciente \*”.
- Tela de adicionar item permite buscar e selecionar apenas serviço ativo.
- Tela de adicionar item permite definir quantidade com stepper ou input.
- Tela de adicionar item mostra subtotal antes de adicionar à nota.
- Tela de adicionar item possui botão “Adicionar à nota”.
- Lista mostra itens adicionados.
- Total aparece em destaque.
- Botão salvar fica preparado para criar order `open`, mas a persistência efetiva fica na Fase 7.
- Botão finalizar fica preparado para criar order `closed`, mas a persistência efetiva fica na Fase 7.
- Botões ficam desabilitados quando não há itens.
- Rotas em `src/app` permanecem finas.

---

## Fase 7 — Repository e service de orders

### Objetivo

Persistir orders e order items no SQLite.

### Repository esperado

Métodos:

- `createWithItems`
- `findAll`
- `findById`
- `findItemsByOrderId`
- `findWithItemsById`
- `getNextNumber`
- `update`
- `cancel`
- `close`

### Service esperado

Métodos:

- `createOpenOrder`
- `createClosedOrder`
- `listOrders`
- `findOrderById`
- `findOrderWithItems`
- `cancelOrder`
- `closeExistingOrder`

### Regras de negócio

- Order precisa ter cliente.
- Telefone do cliente é opcional e deve ser persistido como `null` quando vazio.
- Order precisa ter pelo menos um item.
- Número da order deve ser sequencial.
- Total deve ser calculado no service.
- Status deve ser definido pelo service.
- Cancelamento deve preencher `canceledAt`.
- Items devem ser salvos junto com a order.
- Falha ao salvar item deve impedir order incompleta.
- Repository não deve conter regra de apresentação.
- Screen não deve acessar repository.

### Critérios de aceite

- Order `open` é salva no banco.
- Order `closed` é salva no banco.
- Telefone opcional do cliente é salvo quando informado.
- Items são salvos corretamente.
- Total salvo bate com soma dos items.
- Número da order incrementa corretamente.
- Draft é limpo após salvar.
- Mutations futuras conseguem usar os services sem acessar repository diretamente.

---

## Fase 8 — TanStack Query para orders

### Objetivo

Criar os hooks de leitura e escrita para orders.

### Estrutura esperada

```txt
src/modules/orders/hooks/
  orders.query-keys.ts
  queries/
    orders.query-options.ts
    use-orders.ts
  mutations/
    use-create-order-mutation.ts
    use-close-order-mutation.ts
    use-cancel-order-mutation.ts
    use-edit-order-mutation.ts
```

### Query keys esperadas

- `ordersQueryKeys.all`
- `ordersQueryKeys.findAll()`
- `ordersQueryKeys.findAllWithFilters(filters)`
- `ordersQueryKeys.findById(id)`
- `ordersQueryKeys.findWithItemsById(id)`
- `ordersQueryKeys.summary()`

### Queries

- Listar orders.
- Buscar order por ID.
- Buscar order com items.
- Buscar orders por status.
- Buscar orders por cliente/número.
- Buscar resumo para dashboard quando necessário.

### Mutations

- Criar order com `status: 'open'`.
- Criar order com `status: 'closed'`.
- Finalizar order existente.
- Cancelar order.
- Editar order com `status: 'open'`.

### Critérios de aceite

- Listagem atualiza após criar order.
- Detalhe atualiza após finalizar/cancelar.
- Loading e erro são tratados.
- Query keys são padronizadas e serializáveis.
- Query keys incluem variáveis que alteram resultado.
- Queries usam `queryOptions`.
- Mutations invalidam caches corretos com `ordersQueryKeys.all` quando impactarem listas, contadores ou detalhes.

---

## Fase 9 — Listagem de notas, módulo `orders`

### Objetivo

Permitir consultar notas criadas.

### Tela

- `OrderListScreen`

### Rota

`src/app/(tabs)/notas.tsx` deve ser rota fina:

```ts
import { OrderListScreen } from '@/modules/orders/screens/OrderListScreen';

export default OrderListScreen;
```

### Funcionalidades

- Listar notas.
- Buscar por cliente.
- Buscar por número.
- Exibir telefone do cliente quando existir.
- Filtrar por status.
- Abrir detalhe da nota.
- Criar nova nota.

### Filtros de UI

- Todas.
- Abertas.
- Finalizadas.
- Canceladas.

### Filtros técnicos

- `open`.
- `closed`.
- `canceled`.

### Componentes

- `OrderCard`
- `OrderStatusFilter`
- `OrderListHeader`
- `EmptyState`

### Layout

Usar `ListScreenContainer` com:

- Header.
- Busca.
- Filtros.
- FlatList.
- Empty state.

### Critérios de aceite

- Lista notas corretamente.
- Busca por cliente funciona.
- Busca por número funciona.
- Filtro de status funciona.
- Estado vazio aparece corretamente.
- Notas exibem número, cliente, telefone quando existir, data, status e total.
- `FlatList` não fica dentro de `ScrollView`.

---

## Fase 10 — Detalhe da nota, módulo `orders`

### Objetivo

Permitir visualizar todos os dados de uma nota.

### Tela

- `OrderDetailScreen`

### Rota

```txt
src/app/orders/[id].tsx
```

### Conteúdo

- Número da nota.
- Status.
- Cliente.
- Telefone do cliente quando existir.
- Observação.
- Data de criação.
- Data de finalização quando existir.
- Data de cancelamento quando existir.
- Lista de pacientes/serviços.
- Quantidade.
- Valor unitário.
- Valor total por item.
- Total geral.

### Ações por status

Se `open`:

- Editar.
- Finalizar.
- Cancelar.
- Gerar PDF opcional.

Se `closed`:

- Gerar PDF.
- Compartilhar.
- Duplicar futuramente.

Se `canceled`:

- Visualizar histórico.
- Sem ações principais.

### Critérios de aceite

- Detalhe carrega order e items.
- Valores aparecem formatados.
- Status aparece como badge em português.
- Ações mudam conforme status técnico.
- Cancelar exige confirmação.
- Finalizar exige confirmação.

---

## Fase 11 — Edição de order com status `open`

### Objetivo

Permitir ajustar uma nota enquanto a order ainda estiver com `status: 'open'`.

### Tela

- `EditOrderScreen`

### Rota

```txt
src/app/orders/[id]/edit.tsx
```

### Regras

- Apenas orders `open` podem ser editadas.
- Order `closed` não pode ser editada no MVP.
- Order `canceled` não pode ser editada.
- Items podem ser adicionados/removidos/alterados.
- Total deve ser recalculado no service.

### Funcionalidades

- Editar cliente.
- Editar telefone opcional do cliente.
- Editar observação.
- Adicionar paciente/serviço.
- Remover item.
- Alterar quantidade.
- Atualizar total.

### Critérios de aceite

- Nota aberta, representada por `status: 'open'`, pode ser editada.
- Nota finalizada, representada por `status: 'closed'`, bloqueia edição.
- Alterações persistem no banco.
- Total recalcula corretamente.
- Listagem reflete atualização.
- Services preservam invariantes mesmo se a UI falhar.

---

## Fase 12 — Dashboard inicial

### Objetivo

Dar visão rápida do estado atual das notas.

### Tela

- `HomeScreen`

### Módulo recomendado

```txt
src/modules/home/screens/HomeScreen.tsx
```

### Rota

`src/app/(tabs)/index.tsx` deve ser rota fina.

### Dados exibidos no MVP

- Notas abertas.
- Notas finalizadas hoje.
- Total finalizado hoje.
- Notas recentes.
- Atalho para nova nota.
- Atalho para serviços.

### Atalhos e dados futuros

- Atalho para Clientes.
- Atalho para Relatórios.
- Comparativo com ontem.
- Top serviços.

### Uso de dayjs

- Calcular início do dia.
- Calcular fim do dia.
- Filtrar orders `closed` hoje.
- Exibir datas amigáveis.

### Critérios de aceite

- Dashboard mostra dados reais do SQLite.
- Total do dia considera apenas orders `closed`.
- Notas recentes aparecem corretamente.
- Atalhos navegam corretamente.
- Atalhos de clientes e relatórios não fazem parte do MVP.
- Rota da home não contém regra de negócio.

---

## Fase 13 — PDF da nota

### Objetivo

Gerar um PDF profissional da nota.

### Arquivos

```txt
src/modules/pdf/
  screens/OrderPdfPreviewScreen.tsx
  templates/order-pdf.template.ts
  services/order-pdf.service.ts
```

### Fluxo

```txt
Detalhe da nota
↓
Gerar PDF
↓
Prévia do PDF
↓
Compartilhar ou baixar
```

### Conteúdo do PDF

- Nome do app/negócio.
- Número da nota.
- Cliente.
- Telefone do cliente quando existir.
- Data.
- Status.
- Observação.
- Tabela com pacientes e serviços.
- Quantidade.
- Valor unitário.
- Valor total.
- Total geral.

### Regras

- PDF deve usar os dados salvos da order.
- Prévia deve usar dados persistidos da order.
- PDF deve preservar valores históricos dos items.
- PDF deve incluir `customerPhone` quando existir.
- PDF deve incluir dados da empresa quando configurados.
- Prévia de PDF é alvo de UX; se a stack nativa não permitir preview confiável no MVP, geração e compartilhamento do PDF não devem ser bloqueados.
- PDF deve ter layout limpo.
- PDF deve ser legível no celular.
- O arquivo e service usam `Order`, mas o conteúdo apresentado usa “nota”.

### Critérios de aceite

- PDF é gerado sem erro.
- PDF contém todos os items.
- Total está correto.
- Datas estão formatadas.
- Prévia do PDF renderiza os dados persistidos, se for viável tecnicamente no app.
- PDF pode ser compartilhado.

---

## Fase 14 — Compartilhamento e WhatsApp

### Objetivo

Permitir compartilhar a nota com facilidade.

### Arquivo recomendado

```txt
src/modules/sharing/services/order-sharing.service.ts
```

### Funcionalidades

- Compartilhar PDF via `expo-sharing`.
- Abrir WhatsApp com mensagem pronta via `expo-linking`.
- Compartilhar resumo textual se necessário.
- Permitir compartilhar a partir do detalhe ou da prévia do PDF.
- Exibir erro se compartilhamento não estiver disponível no dispositivo.

### Mensagem sugerida

```txt
Olá, segue sua nota de pedido.

Nota #0012
Cliente: Embu Guaçu
Total: R$ 740,00
```

### Critérios de aceite

- PDF pode ser compartilhado.
- WhatsApp abre com texto pronto.
- Se não houver telefone, compartilhamento genérico funciona.
- Compartilhamento funciona a partir do detalhe da nota e da prévia do PDF.
- Usuário recebe feedback quando compartilhamento não estiver disponível.
- Erros são tratados com feedback visual.
- Quando a biblioteca de toast for escolhida, os feedbacks devem ser padronizados.

---

## Fase 15 — Settings e versão

### Objetivo

Criar área de manutenção do app.

### Tela

- `SettingsScreen`

### Módulo recomendado

```txt
src/modules/settings/
  screens/
    SettingsScreen.tsx
  services/
```

### Rota

`src/app/(tabs)/ajustes.tsx` deve ser rota fina:

```ts
import { SettingsScreen } from '@/modules/settings/screens/SettingsScreen';

export default SettingsScreen;
```

### Funcionalidades MVP

- Exibir versão do app.
- Exibir informações do app.
- Exibir dados básicos da empresa se necessários para PDF.
- Configurar nome da empresa.
- Configurar telefone da empresa.

### Funcionalidades futuras

- Verificar atualização OTA com `expo-updates`.
- Aplicar atualização OTA.
- Configurar próximo número da nota, se necessário.
- Configurar modelo de PDF.
- Limpar dados locais.
- Backup e restauração avançados.

### Critérios de aceite

- Versão aparece corretamente.
- Informações básicas aparecem corretamente.
- Dados básicos da empresa são usados no PDF quando configurados.
- Rota de ajustes não contém formulário de exemplo ou lógica temporária.
- Fluxo OTA só é implementado quando `expo-updates` for adicionado.

---

## Fase 16 — Backup e restauração

### Objetivo

Evitar perda de dados no uso real.

### Funcionalidades

- Exportar backup em JSON.
- Compartilhar backup.
- Importar backup.
- Validar estrutura do backup.
- Restaurar dados.

### Dados exportados

- Works.
- Orders.
- Order items.
- App meta.
- Company settings, quando implementado.
- Versão do app.
- Versão do schema.
- Data de exportação.

### Regras

- Importação deve exigir confirmação.
- Backup inválido deve mostrar erro claro.
- Backup não deve duplicar dados sem estratégia definida.
- Antes de implementar importação, definir se restauração substitui tudo ou faz merge.
- Backup deve preservar snapshots de `workName` e `unitPrice` nos order items.

### Critérios de aceite

- Usuário exporta backup.
- Backup contém dados reais.
- Usuário restaura backup válido.
- Backup inválido não quebra o app.
- Estratégia de duplicidade está documentada antes de importar dados.

---

# Pós-MVP — Clientes

Clientes são derivados das orders salvas. Não haverá cadastro independente de clientes no MVP.

Funcionalidades futuras:

- Listar clientes derivados das notas.
- Ver total gasto por cliente.
- Ver histórico de notas por cliente.
- Criar nova nota com cliente pré-preenchido.

---

# Pós-MVP — Relatórios

Relatórios não fazem parte do MVP inicial.

Funcionalidades futuras:

- Filtrar por período.
- Exibir faturamento.
- Exibir totais por status.
- Exibir top serviços.
- Exportar relatório em PDF.

---

# 11. Roadmap resumido

## Marco 1 — Fundação

Fases:

- Fase 0
- Fase 1

Resultado:

- App estruturado.
- Design system base.
- Banco pronto.
- Providers prontos.

## Marco 2 — Serviços

Fases:

- Fase 2
- Fase 2.1

Resultado:

- CRUD de serviços completo.
- Inativação e exclusão física de serviços documentadas com responsabilidades distintas.
- Histórico de orders preservado por snapshots em `OrderItem`.

## Marco 3 — Orders base

Fases:

- Fase 3
- Fase 4
- Fase 5
- Fase 6

Resultado:

- Criar nota em rascunho.
- Adicionar pacientes/serviços.
- Calcular total.
- Preparar fluxo visual para salvar/finalizar após a camada de persistência.

## Marco 4 — Persistência e histórico

Fases:

- Fase 7
- Fase 8
- Fase 9
- Fase 10
- Fase 11

Resultado:

- Salvar orders.
- Listar notas.
- Ver detalhes.
- Editar notas abertas.
- Salvar/finalizar orders usando repository, service e mutations.

## Marco 5 — Uso diário

Fases:

- Fase 12
- Fase 13
- Fase 14

Resultado:

- Dashboard.
- PDF.
- Compartilhamento.

## Marco 6 — Manutenção

Fases:

- Fase 15
- Fase 16

Resultado:

- Settings.
- Backup.
- Restauração.
- Atualizações OTA futuras.

---

# 12. MVP mínimo aceitável

O MVP estará pronto quando o app permitir:

- Cadastrar serviço.
- Editar serviço.
- Ativar/inativar serviço.
- Excluir serviço permanentemente.
- Listar serviços.
- Criar nota.
- Informar cliente da nota.
- Informar telefone opcional do cliente.
- Adicionar paciente vinculado a serviço.
- Definir quantidade.
- Calcular total.
- Salvar nota aberta.
- Finalizar nota.
- Cancelar nota.
- Listar notas.
- Ver detalhe da nota.
- Gerar PDF.
- Pré-visualizar PDF, se viável.
- Compartilhar PDF.

Observação técnica:

- Apesar dos termos de produto estarem em português, a implementação usa `Work`, `Order` e `OrderItem`.

Fora do MVP inicial:

- Clientes como módulo próprio.
- Relatórios.
- Backup automático.
- Tema escuro.
- Login.
- Sincronização em nuvem.
- Multiusuário.
- Edição de nota finalizada.
- OTA com `expo-updates`.
- Modelos avançados de PDF.

---

# 13. Definition of Done geral

Uma funcionalidade só deve ser considerada pronta quando:

- Tela implementada.
- Validação implementada.
- Toda lista tem estados loading, error, empty e no-results.
- Feedback visual implementado.
- Ação destrutiva exige confirmação.
- Todo formulário tem estado submitting.
- Todo fluxo crítico dá feedback visual.
- Toda tela respeita Safe Area.
- Toda lista usa `ListScreenContainer`/`FlatList`.
- Formulários longos usam `ScreenContainer`.
- Ações de rodapé seguem o padrão `FooterActions` quando houver botões fixos.
- Campos monetários usam `MoneyInput` ou formatação BRL consistente.
- Targets interativos devem ter tamanho confortável para toque.
- Dados persistem quando necessário.
- Queries são invalidadas corretamente.
- Query keys são serializáveis e incluem variáveis que alteram resultado.
- Queries usam `queryOptions` quando forem TanStack Query.
- Mutations chamam services, não repositories.
- Tela não acessa Drizzle diretamente.
- Service concentra regra de negócio.
- Repository concentra acesso ao banco.
- Novos schemas são registrados em `databaseSchemas`.
- Toda migration gerada é importada em `drizzle/migrations.js`.
- Componentes seguem o design system.
- Código interno usa inglês.
- Labels e mensagens ao usuário usam português.
- Rotas em `src/app` permanecem finas.
- Funciona após fechar e abrir o app.
- `bun run typecheck` passa.
- `bun run lint` passa.
- Checklist manual do fluxo afetado foi executado enquanto não houver testes automatizados.

Não há script de testes configurado no `package.json`. Não considerar testes automatizados como obrigatórios enquanto a ferramenta não for adicionada ao projeto, mas fluxos críticos devem ter checklist manual registrado na entrega.

Checklist manual mínimo para fluxos críticos:

- Criar, editar, ativar/inativar e excluir serviço.
- Criar nota aberta.
- Finalizar nota.
- Cancelar nota.
- Listar e filtrar notas.
- Abrir detalhe da nota.
- Gerar e compartilhar PDF.
- Exportar e importar backup quando a funcionalidade existir.

---

# 14. Próximo passo imediato

Como `works` já possui criação, edição, status ativo/inativo e exclusão física, o próximo passo é alinhar o PRD e pequenos detalhes de UX do módulo antes de iniciar orders.

## Ajustes finais em works

1. Garantir que o texto de exclusão deixe claro que a ação é permanente.
2. Garantir que o switch ativo/inativo esteja documentado como mecanismo oficial de inativação.
3. Garantir que serviços inativos não serão usados em novas orders.
4. Garantir que a preservação histórica dependerá de snapshots em `OrderItem`.

Depois disso, iniciar:

## Fase 3 — Banco de orders e order items

Ordem recomendada:

1. Criar `orders.schema.ts`.
2. Criar `order-items.schema.ts`.
3. Criar `app-meta.schema.ts` se o controle sequencial exigir.
4. Registrar schemas em `src/database/client.ts`.
5. Gerar migration com `bun run db:generate`.
6. Atualizar `drizzle/migrations.js` com o novo SQL.
7. Criar `orders.types.ts`.

As etapas seguintes pertencem às Fases 4, 5 e 6, respectivamente:

1. Criar `order-draft.store.ts`.
2. Criar schemas Zod de order e order item.
3. Criar fluxo visual de nova nota.

Esse caminho mantém o projeto organizado e evita misturar persistência, UI e rascunho na mesma etapa.
