# LMX-32 - Fase 2 - Serviços / Works

**Provider**: Linear
**Issue ID**: LMX-32
**Priority**: High
**Labels**: -
**Status**: In Progress
**Parent**: Marco 2 - Serviços
**Branch**: pedroteodorio92/lmx-32-fase-2-servicos-works

---

## Description

## Objetivo

Permitir o gerenciamento dos serviços usados nas notas.

## Funcionalidades

* Criar serviço.
* Listar serviços ativos.
* Buscar serviço por nome.
* Editar serviço.
* Inativar serviço.
* Excluir serviço fisicamente.
* Filtrar serviços por status.

## Critérios de aceite

* Usuário cria, edita, inativa e exclui serviço permanentemente após confirmação.
* Serviço inativo não aparece em listas ativas.
* Dados persistem no SQLite.
* Queries são invalidadas após mutation.
* UI usa português, código usa `Work`/`works`.

---

## Comments (relevant)

-

---

## Extracted Keywords

**Domain entities**: Work, works, serviço, serviços, nota, notas
**Actions**: create, list active, search by name, edit, deactivate, delete permanently, filter by status, persist, invalidate queries
**Suspected modules**: src/modules/works, src/app/works, src/database/schemas, drizzle, TanStack Query hooks
**Constraints**: SQLite persistence via Drizzle; inactive Work must not appear in active lists; mutations must invalidate related queries; UI text in Portuguese; code naming in English using Work/works; physical deletion requires confirmation.

---

## Open Questions

- [ ] O status de serviço deve aceitar apenas `active`/`inactive` ou há outros estados previstos?
- [ ] A exclusão física deve ser bloqueada se houver notas referenciando o serviço, ou o domínio ainda não possui notas relacionadas?
- [ ] A busca por nome deve ser case-insensitive e/ou parcial?
- [ ] A listagem principal deve mostrar somente ativos por padrão e usar filtro de status em uma tela/controle separado?
