# Spec Flow State

## Active Tasks

- `LMX-27`: contexto carregado a partir do Linear em 2026-06-23.

## Decisions

- `LMX-27`: consolidar design system com mudanças incrementais em `src/shared`, sem criar nova camada de abstração.
- `LMX-27`: criar `LoadingState` e `ErrorState` em `src/shared/components`.
- `LMX-27`: generalizar `FilterChips` para remover dependência de `src/modules/works`.
- `LMX-27`: não criar barrel exports nesta fase; preservar imports diretos existentes.
- `LMX-27`: não adicionar test runner; validar com `bun run typecheck` e `bun run lint`, conforme critérios da issue.
- `LMX-27`: `FilterChips` foi generalizado para valores string sem dependência de domínio, mantendo tipagem literal no consumo do módulo `works`.
- `LMX-27`: `EmptyState` permanece focado em estado vazio; carregamento de tela/lista foi movido para `LoadingState` no fluxo da `WorkListScreen`.
- `LMX-27`: defaults do `ConfirmDialog` foram localizados para português (`Confirmar`/`Cancelar`).
- `LMX-32`: manter a implementação incremental no módulo existente `src/modules/works`; não criar nova tabela, migration, rota ou infraestrutura de testes nesta task.
- `LMX-32`: não criar commits durante execução porque commits exigem pedido explícito do usuário nesta sessão.

## Blockers

- `LMX-32`: `bun run lint` global está bloqueado por erros preexistentes em `docs/wireframe-controle-de-pedidos/*`; arquivos alterados passaram em ESLint direcionado e Prettier.

## Todos

- Resolver warning preexistente de lint em `.expo/types/router.d.ts` em task separada de higiene.
- Resolver erros preexistentes de lint em `docs/wireframe-controle-de-pedidos/*` ou ajustar escopo do script de lint para não incluir artefatos de documentação/protótipo não compiláveis.
