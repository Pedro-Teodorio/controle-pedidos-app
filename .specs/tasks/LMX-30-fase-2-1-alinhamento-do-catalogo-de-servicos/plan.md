# Plano Técnico - LMX-30

## Abordagem técnica

A tarefa deve formalizar e preservar duas operações distintas no catálogo de serviços:

1. **Ativação/inativação lógica** por meio do campo `works.status`, controlado pelo switch já existente no formulário de serviço.
2. **Exclusão física destrutiva** por meio do fluxo atual de `deleteWork`, com confirmação explícita antes da remoção permanente.

A pesquisa indica que o código atual já implementa a maior parte do comportamento esperado. O plano de implementação deve ser incremental e evitar alterar a arquitetura existente sem necessidade.

A implementação recomendada para a próxima fase deve:

- manter o switch de status como mecanismo de ativar/inativar serviço;
- manter a exclusão física como ação destrutiva separada da inativação;
- reforçar textos de UI para deixar claro que excluir é permanente e não equivale a inativar;
- preservar a listagem padrão de serviços ativos;
- preservar o filtro de serviços inativos;
- documentar a restrição futura de orders: novas notas devem selecionar apenas serviços ativos;
- não criar módulo `orders`, schemas de orders ou migrations nesta tarefa, pois não existem consumidores atuais e isso pertence a fase posterior.

## Fluxo de dados

### Catálogo de serviços

1. `WorkListScreen` mantém estado de filtro por status.
2. `useWorks({ status, search })` monta a query com filtros serializáveis.
3. `worksQueryOptions.list(filters)` chama `worksService.findAllWorks(filters)`.
4. `worksService.findAllWorks(filters)` delega consulta ao repository.
5. `worksRepository.findAllWorks(filters)` aplica `eq(works.status, filters.status)` quando o filtro é informado.
6. O catálogo padrão continua usando `statusFilter = 'active'`.
7. O filtro de inativos continua usando `statusFilter = 'inactive'`.

### Ativação/inativação

1. `WorkForm` exibe o switch `Status ativo`.
2. Ao alternar o switch, o formulário envia `status: 'active' | 'inactive'`.
3. `useEditWorkMutation` chama `worksService.updateWork`.
4. `worksService.updateWork` valida, normaliza e chama `worksRepository.updateWork`.
5. A mutation invalida `worksQueryKeys.all`.
6. As listas e contadores são atualizados pela invalidação do React Query.

### Exclusão física

1. Em modo de edição, `WorkForm` exibe ação destrutiva de exclusão.
2. `EditWorkScreen` abre `ConfirmDialog` antes de executar a exclusão.
3. O texto do modal deve explicitar que a exclusão é permanente, remove o serviço do catálogo e não pode ser desfeita.
4. Confirmada a exclusão, `useDeleteWorkMutation` chama `worksService.deleteWork`.
5. `worksService.deleteWork` valida o ID e a existência do serviço.
6. `worksRepository.deleteWork` executa `db.delete(works)`.
7. A mutation invalida `worksQueryKeys.all`.
8. A UI retorna para a listagem após sucesso.

### Orders e snapshots históricos

O módulo `orders` ainda não existe. Portanto, nesta tarefa o fluxo de dados de orders deve ser tratado como contrato futuro:

1. Quando orders forem implementadas, telas de nova nota devem carregar serviços com filtro explícito de ativos.
2. `OrderItem` deve persistir snapshots de nome e preço do serviço no momento da criação do item.
3. O histórico da nota deve depender do snapshot em `OrderItem`, não da existência futura do registro em `works`.
4. Não deve haver cascade delete de `works` para `order_items` quando esses schemas forem criados.

## Arquivos previstos para modificação

Alterações previstas para uma fase de implementação posterior:

- `src/modules/works/screens/EditWorkScreen.tsx`
  - Ajustar o texto do `ConfirmDialog` para reforçar que exclusão é permanente, não pode ser desfeita e é diferente de inativar.

- `src/modules/works/components/WorkForm.tsx`
  - Revisar textos do switch e da ação destrutiva se necessário para diferenciar claramente inativação e exclusão.
  - Manter o botão de exclusão apenas em modo de edição.

- `src/modules/works/repositories/works.repository.ts`
  - Verificar sem alterar desnecessariamente que `deleteWork` continua realizando exclusão física.
  - Verificar sem alterar desnecessariamente que `findAllWorks` continua aceitando filtro de status.

- `src/modules/works/services/works.service.ts`
  - Verificar sem alterar desnecessariamente que `deleteWork` valida existência e delega exclusão física.
  - Verificar sem alterar desnecessariamente que `updateWork` mantém atualização de status.

- `src/modules/works/hooks/mutations/use-delete-work-mutation.ts`
  - Verificar sem alterar desnecessariamente que a mutation invalida `worksQueryKeys.all` após exclusão.

- `src/modules/works/hooks/mutations/use-edit-work-mutation.ts`
  - Verificar sem alterar desnecessariamente que a mutation invalida `worksQueryKeys.all` após ativação/inativação.

## Arquivos previstos para criação

Nenhum arquivo de aplicação precisa ser criado para esta tarefa, salvo se a fase de contratos aprovada posteriormente identificar lacuna objetiva.

Não criar nesta tarefa:

- `src/modules/orders/**/*`;
- `src/database/schemas/orders.schema.ts`;
- `src/database/schemas/order-items.schema.ts`;
- migrations de orders;
- hooks específicos de orders;
- telas de orders.

## Camadas afetadas

### `src/app`

Não há alteração prevista. Rotas devem permanecer finas.

### `src/modules/works`

Camada principal da tarefa. Pode receber ajustes pontuais de copy e validação de comportamento existente.

### `src/database`

Não há alteração estrutural prevista. O schema `works` já possui `status` e a exclusão física já é possível.

### `src/shared`

Não há alteração prevista. `ConfirmDialog`, `Toggle`, `FilterChips` e `Badge` já atendem ao fluxo.

## Riscos

- Confundir inativação com exclusão e remover a ação destrutiva, contrariando LMX-30.
- Aplicar a direção da LMX-28, que propunha substituir exclusão física por inativação lógica, apesar de conflitar com o objetivo atual.
- Criar módulo `orders` prematuramente sem contratos completos da fase de pedidos.
- Prometer tecnicamente preservação histórica por snapshots sem `OrderItem` existir ainda.
- Deixar textos ambíguos, levando o usuário a acreditar que exclusão pode ser revertida.
- Adicionar comandos de teste inexistentes no projeto.

## Premissas

- `works.status` já é a fonte de verdade para ativo/inativo.
- Serviços inativos devem permanecer persistidos e consultáveis via filtro de inativos.
- Exclusão física remove o registro de `works` do catálogo.
- Histórico futuro de notas será preservado por snapshots em `OrderItem`, não por retenção obrigatória de `Work`.
- A seleção de serviços em novas notas será implementada junto do módulo `orders` e deverá filtrar apenas serviços ativos.
- O escopo desta tarefa é alinhar e formalizar o comportamento do catálogo de serviços, não implementar o módulo de pedidos.

## Validações recomendadas

Após implementação futura, executar:

- `bun run typecheck`
- `bun run lint`

Validações manuais recomendadas:

- Criar ou editar um serviço e marcar como inativo.
- Confirmar que o serviço inativo não aparece na listagem padrão de ativos.
- Selecionar o filtro de inativos e confirmar que o serviço aparece.
- Reativar o serviço pelo switch e confirmar que ele volta à listagem de ativos.
- Acionar exclusão e confirmar que o modal exige confirmação explícita.
- Confirmar que o texto do modal comunica exclusão permanente e irreversível.
- Confirmar exclusão e verificar que o serviço desaparece do catálogo.

## Decisões recomendadas para contratos

Quando a fase de contratos for aprovada, os contratos devem explicitar:

- operação de atualização de status como parte de `UpdateWorkInput`;
- operação de exclusão física via `deleteWork(id)`;
- consulta de serviços com filtro de status;
- requisito futuro para orders: seleção de serviços ativos somente;
- requisito futuro para snapshots de `OrderItem` com nome e preço copiados no momento da criação do item.
