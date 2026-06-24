# Plano De Atualização Do PRD Com Base No Wireframe

## Objetivo

Atualizar `docs/prd_controle_pedidos_app.md` para refletir com mais precisão:

- A base real do app Expo/React Native.
- A nomenclatura técnica `Work`, `Order` e `OrderItem`.
- A experiência visual e os fluxos definidos no wireframe.
- A separação correta entre MVP, pós-MVP e referências visuais futuras.
- A regra esclarecida para serviços: inativação via status e exclusão física permitida.

## Referências

- PRD atual: `docs/prd_controle_pedidos_app.md`.
- Wireframe/protótipo: `docs/wireframe-controle-de-pedidos`.
- Telas documentadas no wireframe: `docs/wireframe-controle-de-pedidos/src/docs.jsx:151-264`.
- Fluxos e mapa de navegação: `docs/wireframe-controle-de-pedidos/src/docs.jsx:386-463`.
- Componentes e tokens visuais: `docs/wireframe-controle-de-pedidos/src/components.jsx:6-318`.
- UI primitives do wireframe: `docs/wireframe-controle-de-pedidos/src/ui.jsx:4-277`.
- Fluxo de criar nota: `docs/wireframe-controle-de-pedidos/src/screens.jsx:6-184`.
- Fluxo de adicionar item: `docs/wireframe-controle-de-pedidos/src/screens.jsx:187-299`.
- Detalhe da nota e ações: `docs/wireframe-controle-de-pedidos/src/screens.jsx:303-444`.
- Prévia de PDF: `docs/wireframe-controle-de-pedidos/src/screens.jsx:461-539`.
- Serviços no wireframe: `docs/wireframe-controle-de-pedidos/src/screens.jsx:541-738`.
- Código real de edição de serviço: `src/modules/works/screens/EditWorkScreen.tsx`.
- Schema real do formulário de serviço: `src/modules/works/schemas/work.form.schema.ts`.

## Premissas Atualizadas

O wireframe deve ser tratado como referência de UX/UI e fluxo, não como fonte técnica final.

A fonte técnica final é a base real do app:

- Expo Router.
- React Native.
- TypeScript.
- Drizzle ORM.
- expo-sqlite.
- TanStack Query.
- Zustand.
- React Hook Form.
- Zod.
- NativeWind.
- Bun.

O wireframe ainda contém referências técnicas antigas, como React Navigation e AsyncStorage. Essas referências devem ser ignoradas ou substituídas no PRD por Expo Router, Drizzle/SQLite e TanStack Query.

## Decisões Confirmadas

### Nomenclatura

Código interno:

- `Work`.
- `Order`.
- `OrderItem`.

Produto/UI:

- Serviço.
- Nota.
- Item da nota.

Status internos:

```txt
WorkStatus = 'active' | 'inactive'
OrderStatus = 'open' | 'closed' | 'canceled'
```

Labels na UI:

```txt
active -> Ativo
inactive -> Inativo
open -> Aberta
closed -> Finalizada
canceled -> Cancelada
```

### Serviços

A exclusão física de `Work` é permitida.

A inativação e a exclusão têm papéis diferentes:

- Inativação: feita pelo switch de status no formulário.
- Exclusão física: ação destrutiva para limpeza do catálogo e redução de poluição visual.
- Histórico de notas não depende da existência futura do `Work`.
- Histórico deve ser preservado via snapshot em `OrderItem.workName` e `OrderItem.unitPrice`.

## Alterações No PRD

## 1. Criar Seção “Wireframe Como Referência Visual”

Adicionar uma seção após a stack ou após a convenção de nomenclatura.

Conteúdo sugerido:

```md
## Wireframe como referência visual

O diretório `docs/wireframe-controle-de-pedidos` é referência para UX, componentes, estados de tela, fluxos e hierarquia visual.

A arquitetura técnica oficial continua sendo a base real do projeto:

- Expo Router para navegação.
- Drizzle ORM + expo-sqlite para persistência local.
- TanStack Query para estado assíncrono.
- Zustand para rascunho temporário.
- NativeWind para styling.

Referências técnicas antigas no wireframe, como React Navigation ou AsyncStorage, não devem ser seguidas no app real.
```

## 2. Atualizar Regras De Serviço

Substituir a regra atual que diz que serviço não deve ser deletado fisicamente.

Nova regra:

```md
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
```

## 3. Remover Ou Reescrever A Fase 2.1

A Fase 2.1 não deve mais dizer para substituir exclusão física por inativação.

Nova versão sugerida:

```md
## Fase 2.1 — Alinhamento do catálogo de serviços

### Objetivo

Formalizar as duas operações disponíveis para serviços: inativação e exclusão física.

### Entregáveis

- Manter o switch de status para ativar/inativar serviço.
- Manter exclusão física como ação destrutiva.
- Garantir que serviços inativos não apareçam na seleção de serviços em novas notas.
- Garantir que serviços inativos apareçam no filtro de inativos.
- Garantir que exclusão física exija confirmação.
- Garantir que exclusão física invalide `worksQueryKeys.all`.
- Ajustar textos para deixar claro que exclusão é permanente.

### Critérios de aceite

- Usuário consegue ativar/inativar serviço.
- Usuário consegue excluir serviço permanentemente.
- Exclusão exige confirmação.
- Serviço inativo não aparece na criação de nota.
- Serviço excluído sai do catálogo.
- Histórico de notas permanece correto por snapshot em `OrderItem`.
```

## 4. Atualizar Entidade `Order`

O wireframe usa telefone do cliente em criação, listagem, detalhe e PDF.

Referências:

- `docs/wireframe-controle-de-pedidos/src/screens.jsx:96-100`.
- `docs/wireframe-controle-de-pedidos/src/prototype.jsx:377-379`.
- `docs/wireframe-controle-de-pedidos/src/screens.jsx:494-498`.

Atualizar `Order`:

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

Atualizar tabela `orders`:

```txt
id
number
customer_name
customer_phone
notes
status
created_at
updated_at
closed_at
canceled_at
```

## 5. Atualizar Entidade `OrderItem`

O PRD já prevê paciente, mas o wireframe ainda não captura paciente no fluxo de adicionar item.

Referências:

- PRD atual exige `patientName`.
- Wireframe de adicionar item só seleciona serviço e quantidade: `docs/wireframe-controle-de-pedidos/src/screens.jsx:187-299`.

Manter `patientName` no PRD e atualizar a especificação do fluxo visual:

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

Atualizar `AddOrderItemScreen` para conter:

- Campo “Nome do paciente \*”.
- Busca de serviço ativo.
- Seleção de serviço.
- Stepper ou input de quantidade.
- Subtotal.
- Botão “Adicionar à nota”.

## 6. Atualizar Fase 6

A Fase 6 deve refletir o fluxo real desejado pelo produto e pelo PRD, não apenas o wireframe atual.

Fluxo revisado:

```txt
Usuário informa cliente
Usuário informa telefone opcional
Usuário informa observação opcional
Usuário toca em adicionar paciente/serviço
Usuário informa paciente
Usuário seleciona serviço ativo
Usuário define quantidade
Sistema calcula subtotal
Item entra no draft
Usuário revisa total
Usuário salva como aberta ou finaliza quando persistência estiver disponível
```

Componentes esperados:

- `OrderForm`.
- `OrderDraftItemCard`.
- `OrderSummary`.
- `AddOrderItemButton`.
- `WorkSelectorList`.
- `QuantityStepper`.
- `FooterActions`.

Referências do wireframe:

- Criar nota: `docs/wireframe-controle-de-pedidos/src/screens.jsx:6-184`.
- Adicionar item: `docs/wireframe-controle-de-pedidos/src/screens.jsx:187-299`.

## 7. Atualizar Fase 1 De UI/Design System

O wireframe especifica componentes que devem entrar no PRD como alvo visual.

Adicionar ou reforçar:

- `MoneyInput` ou `Input` com `prefix`.
- `FooterActions`.
- `QuantityStepper`.
- `Toast`.
- `DashboardMetricCard`.
- `OrderItemRow`.
- `OrderTotalCard`.
- `SheetActionItem`.

Referências:

- Component gallery: `docs/wireframe-controle-de-pedidos/src/components.jsx:6-318`.
- UI primitives: `docs/wireframe-controle-de-pedidos/src/ui.jsx:4-277`.

Observação importante:

O componente real `Input` ainda não suporta `prefix`, mas o wireframe usa `R$` no campo de preço. O PRD deve especificar uma decisão:

- Criar `MoneyInput`.
- Ou estender `Input` com `prefix` e `suffix`.

Recomendação: criar `MoneyInput` para evitar complexidade no `Input` genérico.

## 8. Atualizar Navegação

O wireframe propõe bottom tabs com FAB central para nova nota.

Referências:

- `docs/wireframe-controle-de-pedidos/src/components.jsx:299-318`.
- `docs/wireframe-controle-de-pedidos/src/prototype.jsx:155-179`.
- `docs/wireframe-controle-de-pedidos/src/docs.jsx:439-463`.

A base atual tem 4 tabs:

- Início.
- Notas.
- Serviços.
- Ajustes.

Plano recomendado:

- Manter 4 tabs no curto prazo.
- Adicionar ação visual de “Nova nota” dentro de Home e Notas no MVP.
- Deixar FAB central como refinamento de UI da fase de Orders, não como requisito antes de `orders` existir.

Texto sugerido para o PRD:

```md
O wireframe propõe FAB central para criação de nota. No app real, essa decisão fica condicionada à implementação do módulo `orders`. Até lá, a ação “Nova nota” pode existir como botão dentro da Home e da listagem de notas.
```

## 9. Atualizar Fase 12 Dashboard

O wireframe inclui:

- Métricas rápidas.
- Total do dia.
- Atalhos para Clientes, Relatórios e Serviços.
- Notas recentes.

Referências:

- Dashboard: `docs/wireframe-controle-de-pedidos/src/prototype.jsx:198-283`.
- Tela documentada: `docs/wireframe-controle-de-pedidos/src/docs.jsx:151-160`.

O PRD deve separar MVP e pós-MVP.

MVP:

- Notas abertas.
- Notas finalizadas hoje.
- Total finalizado hoje.
- Notas recentes.
- Atalho para nova nota.
- Atalho para serviços.

Pós-MVP:

- Clientes.
- Relatórios.
- Comparativo com ontem.
- Top serviços.

## 10. Adicionar Seção Pós-MVP Para Clientes E Relatórios

O wireframe traz `Clientes` e `Relatórios`, mas o PRD não deve tratá-los como MVP.

Referências:

- Clientes: `docs/wireframe-controle-de-pedidos/src/docs.jsx:228-244`.
- Relatórios: `docs/wireframe-controle-de-pedidos/src/docs.jsx:246-253`.
- Fluxos: `docs/wireframe-controle-de-pedidos/src/docs.jsx:423-432`.

Adicionar ao PRD:

```md
## Pós-MVP — Clientes

Clientes são derivados das orders salvas. Não haverá cadastro independente de clientes no MVP.

Funcionalidades futuras:

- Listar clientes derivados das notas.
- Ver total gasto por cliente.
- Ver histórico de notas por cliente.
- Criar nova nota com cliente pré-preenchido.
```

```md
## Pós-MVP — Relatórios

Relatórios não fazem parte do MVP inicial.

Funcionalidades futuras:

- Filtrar por período.
- Exibir faturamento.
- Exibir totais por status.
- Exibir top serviços.
- Exportar relatório em PDF.
```

## 11. Atualizar Fase 13 PDF

O wireframe inclui prévia de PDF.

Referência:

- `docs/wireframe-controle-de-pedidos/src/screens.jsx:461-539`.

Atualizar Fase 13 para incluir:

- `OrderPdfPreviewScreen`.
- `order-pdf.template.ts`.
- `order-pdf.service.ts`.

Fluxo:

```txt
Detalhe da nota
Gerar PDF
Prévia do PDF
Compartilhar ou baixar
```

Regras:

- A prévia deve usar dados persistidos da order.
- O PDF deve incluir `customerPhone` quando existir.
- O PDF deve incluir dados da empresa quando configurados.
- O PDF deve preservar snapshots dos items.

## 12. Adicionar Configurações Da Empresa

O wireframe usa dados da empresa no PDF.

Referências:

- Mock `empresa`: `docs/wireframe-controle-de-pedidos/src/data.jsx:78-82`.
- PDF Preview: `docs/wireframe-controle-de-pedidos/src/screens.jsx:476-479`.

Adicionar entidade futura ou configuração local:

```ts
type CompanySettings = {
  name: string;
  phone: string | null;
  nextOrderNumber: number | null;
  updatedAt: string;
};
```

Adicionar à Fase 15:

- Nome da empresa.
- Telefone da empresa.
- Próximo número da nota, se necessário.
- Configurações de PDF.

## 13. Atualizar Fase 15 Settings

O wireframe define Ajustes como configuração de empresa, numeração, modelo de PDF e dados locais.

Referência:

- `docs/wireframe-controle-de-pedidos/src/docs.jsx:255-263`.

Atualizar Fase 15 para separar MVP e futuro.

MVP:

- Exibir versão.
- Exibir informações do app.
- Exibir dados básicos da empresa se necessários para PDF.
- Configuração simples de nome/telefone da empresa.

Futuro:

- OTA com `expo-updates`.
- Modelo de PDF.
- Limpar dados locais.
- Backup/restauração avançados.

## 14. Atualizar Fase 14 Compartilhamento

O wireframe usa prévia e ações de baixar/compartilhar.

Referências:

- PDF Preview: `docs/wireframe-controle-de-pedidos/src/screens.jsx:533-535`.
- Ações da nota: `docs/wireframe-controle-de-pedidos/src/screens.jsx:383-397`.
- Bottom sheet ações da nota: `docs/wireframe-controle-de-pedidos/src/screens.jsx:401-417`.

Atualizar critérios:

- Compartilhar PDF pelo sistema.
- Abrir WhatsApp com texto pronto.
- Exibir erro se compartilhamento não estiver disponível.
- Permitir compartilhar a partir do detalhe ou da prévia.

## 15. Atualizar Definition Of Done

Adicionar critérios de UX vindos do wireframe:

- Toda lista tem estados loading, error, empty e no-results.
- Toda ação destrutiva usa confirmação.
- Todo formulário tem estado submitting.
- Todo fluxo crítico dá feedback visual.
- Toda tela respeita Safe Area.
- Toda lista usa `ListScreenContainer`/`FlatList`.
- Formulários longos usam `ScreenContainer`.
- Ações de rodapé seguem o padrão `FooterActions` quando houver botões fixos.
- Campos monetários usam `MoneyInput` ou formatação BRL consistente.
- Targets interativos devem ter tamanho confortável para toque.

## 16. Atualizar MVP

MVP atualizado:

- Cadastrar serviço.
- Editar serviço.
- Ativar/inativar serviço.
- Excluir serviço permanentemente.
- Listar serviços.
- Criar nota.
- Informar cliente.
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

Fora do MVP:

- Clientes como módulo próprio.
- Relatórios.
- Backup automático.
- Tema escuro.
- Login.
- Sincronização em nuvem.
- Multiusuário.
- OTA.
- Modelos avançados de PDF.

## 17. Atualizar Próximo Passo Imediato

O próximo passo imediato não deve ser trocar exclusão por inativação.

Nova recomendação:

```md
# Próximo passo imediato

Como `works` já possui criação, edição, status ativo/inativo e exclusão física, o próximo passo é alinhar o PRD e pequenos detalhes de UX do módulo antes de iniciar orders.

## Ajustes finais em works

1. Garantir que o texto de exclusão deixe claro que a ação é permanente.
2. Garantir que o switch ativo/inativo esteja documentado como mecanismo oficial de inativação.
3. Garantir que serviços inativos não serão usados em novas orders.
4. Garantir que a preservação histórica dependerá de snapshots em `OrderItem`.

Depois disso, iniciar Fase 3 — Banco de orders e order items.
```

## 18. Ordem Recomendada De Atualização Do PRD

1. Inserir seção “Wireframe como referência visual”.
2. Corrigir regras de `Work`.
3. Reescrever Fase 2.1.
4. Atualizar `Order` com `customerPhone` e `canceledAt`.
5. Confirmar `OrderItem.patientName`.
6. Atualizar tabelas `orders` e `order_items`.
7. Atualizar Fase 1 com componentes do wireframe.
8. Atualizar Fase 6 com paciente e telefone.
9. Atualizar navegação/FAB como decisão condicionada.
10. Atualizar Dashboard com MVP e pós-MVP.
11. Adicionar pós-MVP de Clientes e Relatórios.
12. Atualizar PDF com `OrderPdfPreviewScreen`.
13. Atualizar Settings com dados da empresa.
14. Atualizar DoD com critérios de UX.
15. Atualizar MVP e próximo passo imediato.

## Observações Finais

A base real deve continuar guiando decisões técnicas.

O wireframe deve guiar:

- Layout.
- Hierarquia visual.
- Estados de tela.
- Componentes desejados.
- Fluxos de usuário.
- Padrões de feedback.

O PRD deve ser a fonte consolidada que resolve divergências entre wireframe e código real.
