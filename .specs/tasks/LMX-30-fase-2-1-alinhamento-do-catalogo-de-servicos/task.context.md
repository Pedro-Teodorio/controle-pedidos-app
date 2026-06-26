# LMX-30 - Fase 2.1 - Alinhamento do catálogo de serviços

**Provider**: Linear
**Issue ID**: LMX-30
**Priority**: High
**Labels**: 
**Status**: Todo
**Project**: Controle de Pedidos APP
**Milestone**: Marco 2 - Serviços
**Team**: Lumos-X
**Assignee**: Pedro Lucas
**Origin**: https://linear.app/pedro-teodorio/issue/LMX-30/fase-21-alinhamento-do-catalogo-de-servicos
**Context Created At**: 2026-06-26
**Suggested Branch**: `git checkout -b LMX-30-fase-2-1-alinhamento-do-catalogo-de-servicos`
**Provider Branch Hint**: pedroteodorio92/lmx-30-fase-21-alinhamento-do-catalogo-de-servicos

---

## Raw Description

## Objetivo

Formalizar as duas operações disponíveis para serviços: inativação e exclusão física.

## Entregáveis

* Manter switch de status para ativar/inativar serviço.
* Manter exclusão física como ação destrutiva.
* Garantir que serviços inativos não apareçam em novas orders.
* Garantir que serviços inativos apareçam no filtro de inativos.
* Ajustar textos para deixar claro que exclusão é permanente.
* Garantir preservação histórica por snapshots em `OrderItem`.

## Critérios de aceite

* Exclusão exige confirmação.
* Serviço excluído sai do catálogo.
* Histórico de notas permanece correto por snapshot.
* `bun run typecheck` passa.
* `bun run lint` passa.

---

## Extracted Keywords

**Domain entities**: serviço, catálogo de serviços, work, order, order item, snapshot histórico
**Actions**: ativar, inativar, excluir fisicamente, filtrar, confirmar ação destrutiva, preservar histórico
**Suspected modules**: `src/modules/works`, `src/modules/orders`, `src/database/schemas`, `src/app/works`, componentes de confirmação, hooks React Query
**Constraints**: inativos fora de novas orders, inativos disponíveis no filtro de inativos, exclusão permanente com confirmação, histórico preservado por snapshot em `OrderItem`

---

## Open Questions

Dúvidas ou pontos em aberto identificados a partir do input original:

- [ ] O módulo `orders` e o schema `OrderItem` já existem ou ainda serão criados em fase posterior?
- [ ] A exclusão física deve ser permitida para serviços já referenciados historicamente por pedidos, considerando a preservação via snapshot?
- [ ] Quais telas devem expor a exclusão permanente: listagem, edição, ambas ou apenas um menu de ações?
- [ ] O filtro de inativos já existe no catálogo de serviços ou deve ser criado/ajustado nesta tarefa?
- [ ] Qual texto exato deve comunicar que exclusão é permanente e diferente de inativação?
