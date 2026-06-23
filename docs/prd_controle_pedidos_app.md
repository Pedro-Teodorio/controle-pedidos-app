# PRD — Controle de Pedidos App

## 1. Visão geral

O **Controle de Pedidos App** é um aplicativo mobile local-first para controle de notas de pedidos de serviços. O app será usado para cadastrar serviços, criar notas com pacientes vinculados a serviços, calcular totais, finalizar notas, gerar PDF e compartilhar pelo WhatsApp.

O produto deve ser simples, rápido e confiável para uso diário, funcionando offline e mantendo todos os dados no próprio aparelho.

---

## 2. Objetivo do produto

Criar um app que permita controlar notas de serviços de forma organizada, substituindo listas manuais e reduzindo erros de soma, duplicidade e conferência.

O app deve permitir:

- Cadastrar serviços
- Criar notas de pedido
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

A stack definida para o app é:

```txt
Expo Router + React Native + TypeScript
Drizzle ORM + expo-sqlite
NativeWind + componentes padrão do React Native
TanStack Query
Zustand
React Hook Form + Zod
expo-print
expo-sharing
expo-linking
dayjs
uuid
```

Dependências planejadas, ainda não instaladas no projeto atual:

```txt
expo-updates
burnt ou outra biblioteca de feedback visual
```

---

## 4. Responsabilidades das tecnologias

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

- Schema tipado
- Queries
- Migrations
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

### Zustand

Responsável por estado temporário:

- Rascunho da nota
- Pacientes adicionados antes de salvar
- Quantidades temporárias
- Dados intermediários do fluxo

### React Hook Form + Zod

Responsáveis por formulários e validação:

- Cadastro de serviço
- Criação de nota
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

- Serviços
- Notas
- Itens da nota

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

---

## 5. Conceito principal do domínio

A nota não é apenas uma lista de serviços. Ela representa uma **nota de pedido por cliente**, onde cada linha representa um **paciente vinculado a um serviço específico**.

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

## 6. Entidades principais

## 6.1 Serviço

Representa um serviço cadastrado previamente para ser usado nas notas.

### Campos

```ts
type Servico = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};
```

### Regras

- Nome é obrigatório
- Preço é obrigatório
- Preço não pode ser negativo
- Serviço nasce ativo
- Serviço não deve ser deletado fisicamente no MVP
- Serviço inativado não aparece em novas notas
- Serviço inativado continua preservado no histórico de notas antigas

---

## 6.2 Nota

Representa uma nota de pedido para um cliente.

### Campos

```ts
type Nota = {
  id: string;
  numero: number;
  clienteNome: string;
  observacao: string | null;
  status: 'aberta' | 'finalizada' | 'cancelada';
  total: number;
  criadoEm: string;
  atualizadoEm: string;
  finalizadoEm: string | null;
};
```

### Regras

- Cliente é obrigatório
- Número da nota é sequencial
- ID interno é UUID
- Nota nasce aberta
- Nota finalizada não deve ser editada no MVP
- Nota cancelada não deve ser excluída fisicamente
- Total é calculado pelo service, não pela tela

---

## 6.3 Item da nota

Representa uma linha da nota: um paciente ligado a um serviço.

### Campos

```ts
type NotaItem = {
  id: string;
  notaId: string;
  pacienteNome: string;
  servicoId: string;
  servicoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
};
```

### Regras

- Paciente é obrigatório
- Serviço é obrigatório
- Quantidade deve ser maior que zero
- Valor unitário vem do serviço selecionado, mas pode ser salvo como snapshot
- Valor total é `quantidade * valorUnitario`
- `servicoNome` e `valorUnitario` devem ser salvos no item para preservar histórico
- Se o serviço mudar de preço depois, notas antigas não devem mudar

---

## 7. Estrutura geral do projeto

```txt
src/
  app/
    _layout.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      works/
        index.tsx
      notas.tsx
      ajustes.tsx
    works/
      _layout.tsx
      create.tsx
      [id].tsx

  database/
    client.ts
    schemas/
      works.schema.ts
      notas.schema.ts
      nota-itens.schema.ts
      app-meta.schema.ts

  modules/
    servicos/
      components/
      screens/
      repositories/
      services/
      schemas/
      types/
      hooks/
        servico.query-keys.ts
        queries/
        mutations/

    notas/
      components/
      screens/
      repositories/
      services/
      schemas/
      types/
      stores/
      hooks/
        nota.query-keys.ts
        queries/
        mutations/

    pdf/
      services/
      templates/

    sharing/
      services/

    backup/
      services/
      types/

    ajustes/
      screens/
      services/

  shared/
    ui/
    components/
    hooks/
    utils/
    constants/
    types/

  providers/
    AppProviders.tsx
    QueryProvider.tsx

drizzle/
  migrations.js
  *.sql
  meta/
```

---

## 8. Padrão arquitetural

O app deve seguir o fluxo:

```txt
Route → Screen → Hook TanStack Query → Service → Repository → Drizzle/SQLite
```

Para estado temporário de notas:

```txt
Screen → Zustand Draft Store → Service → Repository → Drizzle/SQLite
```

Regras:

- Arquivos em `src/app` apenas conectam rotas às screens
- Screens não acessam Drizzle diretamente
- Repositories acessam o banco
- Services concentram regra de negócio
- Hooks de query/mutation controlam cache, loading e invalidação
- Zustand não substitui SQLite

---

# 9. Fases de implementação

---

## Fase 0 — Fundação do projeto

### Objetivo

Garantir que a base do app esteja estável antes das funcionalidades de negócio.

### Entregáveis

- Expo Router configurado
- NativeWind configurado
- Providers globais configurados
- TanStack Query configurado
- SQLite/Drizzle configurado
- Migrations funcionando
- Estrutura de pastas criada
- Aliases TypeScript configurados
- Feedback visual configurado com a biblioteca escolhida

### Critérios de aceite

- App abre sem erro
- Navegação por tabs funciona
- NativeWind aplica estilos corretamente
- Banco local inicializa
- Drizzle conecta ao SQLite
- Provider do TanStack Query está ativo
- Toasts aparecem corretamente

---

## Fase 1 — Design system base

### Objetivo

Criar uma base visual consistente usando NativeWind e componentes padrão do React Native.

### Componentes esperados

- `Button`
- `Input`
- `Card`
- `Badge`
- `MoneyText`
- `ScreenContainer`
- `ListScreenContainer`
- `EmptyState`
- `ConfirmDialog`
- `AppHeader`
- `LoadingState`
- `ErrorState`

### Regras visuais

- Fundo padrão: `bg-slate-50`
- Cards: `rounded-2xl border border-slate-200 bg-white p-4`
- Botão primário: `bg-blue-600 text-white`
- Botão destrutivo: `bg-red-600 text-white`
- Total monetário: `text-blue-600 font-bold`
- Status com badges semânticos

### Regra importante de layout

Telas com `FlatList` não devem usar `ScrollView` externo.

Usar:

- `ScreenContainer` para telas simples/formulários
- `ListScreenContainer` para telas com listas

### Critérios de aceite

- Componentes renderizam corretamente
- Componentes aceitam variações principais
- Inputs exibem erro
- Botões possuem estado loading/disabled
- Listas não usam `FlatList` dentro de `ScrollView`

---

## Fase 2 — Serviços

### Status

Funcionalidade finalizada.

### Objetivo

Permitir o gerenciamento dos serviços usados nas notas.

### Funcionalidades

- Criar serviço
- Listar serviços ativos
- Buscar serviço por nome
- Editar serviço
- Inativar serviço

### Camadas implementadas

- Schema Drizzle de serviços
- Migration inicial
- Repository de serviços
- Service de serviços
- Schema Zod de serviço
- Hooks de queries/mutations
- Listagem
- Criação
- Edição
- Inativação

### Critérios de aceite

- Usuário cria serviço
- Usuário edita serviço
- Usuário inativa serviço
- Serviço inativo não aparece em listas ativas
- Dados persistem no SQLite
- Queries são invalidadas após mutation

---

## Fase 3 — Banco de notas e itens

### Objetivo

Criar a estrutura persistente para notas e itens de nota.

### Entregáveis

- Schema `notas`
- Schema `nota_itens`
- Schema `app_meta` se necessário para controle de número sequencial
- Migration de notas
- Tipos TypeScript do módulo de notas

### Tabela `notas`

Campos:

- `id`
- `numero`
- `cliente_nome`
- `observacao`
- `status`
- `total`
- `criado_em`
- `atualizado_em`
- `finalizado_em`

### Tabela `nota_itens`

Campos:

- `id`
- `nota_id`
- `paciente_nome`
- `servico_id`
- `servico_nome`
- `quantidade`
- `valor_unitario`
- `valor_total`
- `observacao`
- `criado_em`
- `atualizado_em`

### Critérios de aceite

- Migrations rodam sem erro
- Tabelas são criadas corretamente
- Relacionamento entre nota e itens funciona
- Relacionamento entre item e serviço funciona
- Datas são salvas em ISO string
- Status aceita apenas valores válidos

---

## Fase 4 — Rascunho de nota com Zustand

### Objetivo

Permitir montar uma nota antes de salvar no banco.

### Motivo

O usuário pode preencher cliente, adicionar vários pacientes, escolher serviços, alterar quantidades e revisar o total antes de salvar ou finalizar.

### Store esperada

```ts
type NotaDraftItem = {
  id: string;
  pacienteNome: string;
  servicoId: string;
  servicoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  observacao: string | null;
};

type NotaDraftStore = {
  clienteNome: string;
  observacao: string;
  itens: NotaDraftItem[];

  setClienteNome: (value: string) => void;
  setObservacao: (value: string) => void;
  addItem: (item: Omit<NotaDraftItem, 'id' | 'valorTotal'>) => void;
  updateItem: (id: string, data: Partial<NotaDraftItem>) => void;
  updateQuantidade: (id: string, quantidade: number) => void;
  removeItem: (id: string) => void;
  getTotal: () => number;
  clearDraft: () => void;
};
```

### Regras

- Não salvar no SQLite enquanto estiver apenas montando a nota
- Recalcular total ao adicionar/remover/alterar quantidade
- Limpar draft após salvar/finalizar
- Manter draft ao navegar entre nova nota e adicionar item

### Critérios de aceite

- Usuário adiciona item ao draft
- Usuário remove item do draft
- Usuário altera quantidade
- Total recalcula corretamente
- Draft permanece entre telas do fluxo
- Draft é limpo após salvar/finalizar

---

## Fase 5 — Formulários de nota e item

### Objetivo

Criar validações para dados da nota e itens.

### Schemas esperados

- `nota-form.schema.ts`
- `nota-item-form.schema.ts`

### Validações da nota

- Cliente obrigatório
- Observação opcional

### Validações do item

- Paciente obrigatório
- Serviço obrigatório
- Quantidade maior que zero
- Observação opcional

### Critérios de aceite

- Formulário da nota valida cliente
- Formulário de item valida paciente
- Formulário de item exige serviço
- Quantidade inválida mostra erro
- Mensagens de erro são claras

---

## Fase 6 — Fluxo de criação de nota

### Objetivo

Criar a tela onde a nota é montada.

### Telas

- `NovaNotaScreen`
- `AdicionarNotaItemScreen`

### Componentes

- `NotaForm`
- `NotaDraftItemCard`
- `NotaResumo`
- `AdicionarItemButton`
- `SelecionarServicoList`

### Fluxo

```txt
Usuário informa cliente
↓
Usuário toca em adicionar paciente/serviço
↓
Usuário informa paciente
↓
Usuário seleciona serviço
↓
Usuário informa quantidade
↓
Item entra no draft
↓
Usuário revisa total
↓
Usuário salva ou finaliza
```

### Critérios de aceite

- Tela permite informar cliente
- Tela permite adicionar paciente/serviço
- Lista mostra itens adicionados
- Total aparece em destaque
- Botão salvar cria nota aberta
- Botão finalizar cria nota finalizada
- Botões ficam desabilitados quando não há itens

---

## Fase 7 — Repository e service de notas

### Objetivo

Persistir notas e itens no SQLite.

### Repository esperado

Métodos:

- `createWithItems`
- `findAll`
- `findById`
- `findItemsByNotaId`
- `findWithItemsById`
- `getNextNumero`
- `update`
- `cancel`
- `finalize`

### Service esperado

Métodos:

- `criarNotaAberta`
- `finalizarNovaNota`
- `listarNotas`
- `buscarNotaPorId`
- `buscarNotaComItens`
- `cancelarNota`
- `finalizarNotaExistente`

### Regras de negócio

- Nota precisa ter cliente
- Nota precisa ter pelo menos um item
- Número da nota deve ser sequencial
- Total deve ser calculado no service
- Status deve ser definido pelo service
- Itens devem ser salvos junto com a nota
- Falha ao salvar item deve impedir nota incompleta

### Critérios de aceite

- Nota aberta é salva no banco
- Nota finalizada é salva no banco
- Itens são salvos corretamente
- Total salvo bate com soma dos itens
- Número da nota incrementa corretamente
- Draft é limpo após salvar

---

## Fase 8 — TanStack Query para notas

### Objetivo

Criar os hooks de leitura e escrita para notas.

### Estrutura esperada

```txt
src/modules/notas/hooks/
  nota.query-keys.ts
  queries/
    use-notas.query.ts
    use-nota.query.ts
    use-nota-com-itens.query.ts
  mutations/
    use-criar-nota.mutation.ts
    use-finalizar-nota.mutation.ts
    use-cancelar-nota.mutation.ts
```

### Queries

- Listar notas
- Buscar nota por ID
- Buscar nota com itens
- Buscar notas por status
- Buscar notas por cliente/número

### Mutations

- Criar nota aberta
- Criar nota finalizada
- Finalizar nota existente
- Cancelar nota

### Critérios de aceite

- Listagem atualiza após criar nota
- Detalhe atualiza após finalizar/cancelar
- Loading e erro são tratados
- Query keys são padronizadas
- Mutations invalidam caches corretos

---

## Fase 9 — Listagem de notas

### Objetivo

Permitir consultar notas criadas.

### Tela

- `NotasScreen`

### Funcionalidades

- Listar notas
- Buscar por cliente
- Buscar por número
- Filtrar por status
- Abrir detalhe da nota
- Criar nova nota

### Filtros

- Todas
- Abertas
- Finalizadas
- Canceladas

### Componentes

- `NotaCard`
- `StatusFilter`
- `NotasHeader`
- `EmptyState`

### Layout

Usar `ListScreenContainer` com:

- Header
- Busca
- Filtros
- FlatList
- Empty state

### Critérios de aceite

- Lista notas corretamente
- Busca por cliente funciona
- Busca por número funciona
- Filtro de status funciona
- Estado vazio aparece corretamente
- Notas exibem número, cliente, data, status e total

---

## Fase 10 — Detalhe da nota

### Objetivo

Permitir visualizar todos os dados de uma nota.

### Tela

- `NotaDetalheScreen`

### Conteúdo

- Número da nota
- Status
- Cliente
- Observação
- Data de criação
- Data de finalização quando existir
- Lista de pacientes/serviços
- Quantidade
- Valor unitário
- Valor total por item
- Total geral

### Ações por status

Se aberta:

- Editar
- Finalizar
- Cancelar
- Gerar PDF opcional

Se finalizada:

- Gerar PDF
- Compartilhar
- Duplicar futuramente

Se cancelada:

- Visualizar histórico
- Sem ações principais

### Critérios de aceite

- Detalhe carrega nota e itens
- Valores aparecem formatados
- Status aparece como badge
- Ações mudam conforme status
- Cancelar exige confirmação
- Finalizar exige confirmação

---

## Fase 11 — Edição de nota aberta

### Objetivo

Permitir ajustar uma nota ainda não finalizada.

### Regras

- Apenas notas abertas podem ser editadas
- Nota finalizada não pode ser editada no MVP
- Nota cancelada não pode ser editada
- Itens podem ser adicionados/removidos/alterados
- Total deve ser recalculado

### Funcionalidades

- Editar cliente
- Editar observação
- Adicionar paciente/serviço
- Remover item
- Alterar quantidade
- Atualizar total

### Critérios de aceite

- Nota aberta pode ser editada
- Nota finalizada bloqueia edição
- Alterações persistem no banco
- Total recalcula corretamente
- Listagem reflete atualização

---

## Fase 12 — Dashboard inicial

### Objetivo

Dar visão rápida do estado atual das notas.

### Tela

- `HomeScreen`

### Dados exibidos

- Notas abertas
- Notas finalizadas hoje
- Total finalizado hoje
- Notas recentes
- Atalho para nova nota
- Atalho para serviços

### Uso de dayjs

- Calcular início do dia
- Calcular fim do dia
- Filtrar notas finalizadas hoje
- Exibir datas amigáveis

### Critérios de aceite

- Dashboard mostra dados reais do SQLite
- Total do dia considera apenas notas finalizadas
- Notas recentes aparecem corretamente
- Atalhos navegam corretamente

---

## Fase 13 — PDF da nota

### Objetivo

Gerar um PDF profissional da nota.

### Arquivos

```txt
src/modules/pdf/
  templates/nota-pdf.template.ts
  services/nota-pdf.service.ts
```

### Conteúdo do PDF

- Nome do app/negócio
- Número da nota
- Cliente
- Data
- Status
- Observação
- Tabela com pacientes e serviços
- Quantidade
- Valor unitário
- Valor total
- Total geral

### Regras

- PDF deve usar os dados salvos da nota
- PDF deve preservar valores históricos dos itens
- PDF deve ter layout limpo
- PDF deve ser legível no celular

### Critérios de aceite

- PDF é gerado sem erro
- PDF contém todos os itens
- Total está correto
- Datas estão formatadas
- PDF pode ser compartilhado

---

## Fase 14 — Compartilhamento e WhatsApp

### Objetivo

Permitir compartilhar a nota com facilidade.

### Funcionalidades

- Compartilhar PDF via `expo-sharing`
- Abrir WhatsApp com mensagem pronta via `expo-linking`
- Compartilhar resumo textual se necessário

### Mensagem sugerida

```txt
Olá, segue sua nota de pedido.

Nota #0012
Cliente: Embu Guaçu
Total: R$ 740,00
```

### Critérios de aceite

- PDF pode ser compartilhado
- WhatsApp abre com texto pronto
- Se não houver telefone, compartilhamento genérico funciona
- Erros são tratados com toast

---

## Fase 15 — Ajustes e versão

### Objetivo

Criar área de manutenção do app.

### Tela

- `AjustesScreen`

### Funcionalidades

- Exibir versão do app
- Verificar atualização OTA
- Aplicar atualização OTA
- Informações do app
- Atalho para backup futuramente

### Critérios de aceite

- Versão aparece corretamente
- App verifica update
- App informa quando não há update
- App aplica update quando disponível

---

## Fase 16 — Backup e restauração

### Objetivo

Evitar perda de dados no uso real.

### Funcionalidades

- Exportar backup em JSON
- Compartilhar backup
- Importar backup
- Validar estrutura do backup
- Restaurar dados

### Dados exportados

- Serviços
- Notas
- Itens da nota
- App meta
- Versão do app
- Versão do schema
- Data de exportação

### Regras

- Importação deve exigir confirmação
- Backup inválido deve mostrar erro claro
- Backup não deve duplicar dados sem estratégia definida

### Critérios de aceite

- Usuário exporta backup
- Backup contém dados reais
- Usuário restaura backup válido
- Backup inválido não quebra o app

---

# 10. Roadmap resumido

## Marco 1 — Fundação

Fases:

- Fase 0
- Fase 1

Resultado:

- App estruturado
- Design system base
- Banco pronto
- Providers prontos

## Marco 2 — Serviços

Fase:

- Fase 2

Resultado:

- CRUD de serviços completo

## Marco 3 — Notas base

Fases:

- Fase 3
- Fase 4
- Fase 5
- Fase 6

Resultado:

- Criar nota em rascunho
- Adicionar pacientes/serviços
- Calcular total

## Marco 4 — Persistência e histórico

Fases:

- Fase 7
- Fase 8
- Fase 9
- Fase 10
- Fase 11

Resultado:

- Salvar notas
- Listar notas
- Ver detalhes
- Editar notas abertas

## Marco 5 — Uso diário

Fases:

- Fase 12
- Fase 13
- Fase 14

Resultado:

- Dashboard
- PDF
- Compartilhamento

## Marco 6 — Manutenção

Fases:

- Fase 15
- Fase 16

Resultado:

- Atualizações
- Backup
- Restauração

---

# 11. MVP mínimo aceitável

O MVP estará pronto quando o app permitir:

- Cadastrar serviço
- Listar serviço
- Criar nota
- Informar cliente da nota
- Adicionar paciente vinculado a serviço
- Definir quantidade
- Calcular total
- Salvar nota aberta
- Finalizar nota
- Listar notas
- Ver detalhe da nota
- Gerar PDF
- Compartilhar PDF

Fora do MVP inicial:

- Login
- Sincronização em nuvem
- Multiusuário
- Relatórios avançados
- Tema escuro
- Edição de nota finalizada
- Backup automático

---

# 12. Definition of Done geral

Uma funcionalidade só deve ser considerada pronta quando:

- Tela implementada
- Validação implementada
- Loading tratado
- Erro tratado
- Estado vazio tratado
- Toast de feedback implementado
- Ação destrutiva exige confirmação
- Dados persistem quando necessário
- Queries são invalidadas corretamente
- Tela não acessa Drizzle diretamente
- Service concentra regra de negócio
- Repository concentra acesso ao banco
- Componentes seguem o design system
- Funciona após fechar e abrir o app

---

# 13. Próximo passo imediato

Como a funcionalidade **Serviços** já foi finalizada, o próximo passo é iniciar:

## Fase 3 — Banco de notas e itens

Ordem recomendada:

1. Criar `notas.schema.ts`
2. Criar `nota-itens.schema.ts`
3. Registrar schemas em `src/database/client.ts`
4. Gerar migration
5. Rodar migration no app
6. Criar `nota.types.ts`
7. Criar `nota-draft.store.ts`
8. Criar schemas Zod de nota e item
9. Criar fluxo visual de nova nota

Esse caminho mantém o projeto organizado e evita misturar persistência, UI e rascunho na mesma etapa.
