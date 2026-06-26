# Tasks - LMX-30 - Alinhamento do catálogo de serviços

## T1 - Revisar copy de status no formulário

Status: completed
Depends on: none
Can run in parallel: true

Files:

- src/modules/works/components/WorkForm.tsx

Scope:

- Garantir que o switch de status continue sendo o mecanismo de ativação/inativação.
- Manter o switch enviando `active` quando ligado e `inactive` quando desligado.
- Revisar somente textos necessários para comunicar que serviço ativo fica disponível para novas notas.
- Manter a ação de exclusão separada do controle de status e disponível apenas em edição.

Acceptance Criteria:

- O formulário mantém controle de status ativo/inativo.
- O texto do status comunica disponibilidade para novas notas.
- A ação de exclusão não é substituída por inativação.
- O botão de exclusão não aparece no fluxo de criação.

Validation:

- `bun run typecheck`
- `bun run lint`

## T2 - Reforçar confirmação de exclusão permanente

Status: completed
Depends on: none
Can run in parallel: true

Files:

- src/modules/works/screens/EditWorkScreen.tsx

Scope:

- Ajustar o `ConfirmDialog` de exclusão para deixar claro que a ação é permanente.
- Comunicar que a exclusão remove o serviço do catálogo e não pode ser desfeita.
- Preservar o cancelamento sem executar `deleteWork`.
- Preservar o retorno para `/works` após exclusão confirmada com sucesso.

Acceptance Criteria:

- A exclusão exige confirmação antes de remover o serviço.
- O texto do modal informa permanência, remoção do catálogo e irreversibilidade.
- Cancelar a confirmação preserva o serviço sem alteração.
- Confirmar a exclusão continua acionando a mutation de exclusão física.

Validation:

- `bun run typecheck`
- `bun run lint`

## T3 - Confirmar filtro de catálogo por status

Status: completed
Depends on: none
Can run in parallel: true

Files:

- src/modules/works/repositories/works.repository.ts
- src/modules/works/types/works.types.ts

Scope:

- Verificar que `FindAllWorksFilters` aceita `status?: 'active' | 'inactive'`.
- Verificar que `findAllWorks` aplica `eq(works.status, filters.status)` quando o filtro é informado.
- Verificar que a busca textual preserva o filtro de status quando ambos são usados.
- Fazer alteração mínima somente se algum desses contratos estiver divergente.

Acceptance Criteria:

- A listagem padrão pode consultar serviços ativos via filtro `active`.
- O filtro de inativos pode consultar serviços inativos via filtro `inactive`.
- Busca textual e status podem ser combinados na mesma consulta.
- Nenhuma mudança cria soft delete, `deletedAt` ou comportamento de lixeira.

Validation:

- `bun run typecheck`
- `bun run lint`

## T4 - Confirmar regras de service para status e exclusão física

Status: completed
Depends on: T3
Can run in parallel: false

Files:

- src/modules/works/services/works.service.ts

Scope:

- Verificar que `updateWork` aceita atualização de `status` por meio de `UpdateWorkInput`.
- Verificar que `deleteWork(id)` valida ID e existência do serviço antes de delegar ao repository.
- Garantir que `deleteWork(id)` continue delegando exclusão física e não transforme exclusão em inativação.
- Fazer alteração mínima somente se algum desses contratos estiver divergente.

Acceptance Criteria:

- Alterar status para `inactive` mantém o registro persistido.
- Alterar status para `active` permite reativação do serviço.
- Excluir fisicamente chama o fluxo de remoção do repository.
- Serviço inexistente é tratado como erro compreensível sem corromper o catálogo.

Validation:

- `bun run typecheck`
- `bun run lint`

## T5 - Confirmar invalidação das mutations de works

Status: completed
Depends on: T4
Can run in parallel: false

Files:

- src/modules/works/hooks/mutations/use-edit-work-mutation.ts
- src/modules/works/hooks/mutations/use-delete-work-mutation.ts
- src/modules/works/hooks/works.query-keys.ts

Scope:

- Verificar que a mutation de edição invalida `worksQueryKeys.all` ou query equivalente do domínio.
- Verificar que a mutation de exclusão invalida `worksQueryKeys.all` ou query equivalente do domínio.
- Preservar query keys serializáveis e alinhadas à fábrica existente.
- Fazer alteração mínima somente se algum desses contratos estiver divergente.

Acceptance Criteria:

- Após editar status, listagens e contadores do catálogo são invalidados.
- Após excluir serviço, listagens e contadores do catálogo são invalidados.
- A fábrica `worksQueryKeys` continua sendo a fonte central das query keys do domínio.
- Mutations continuam chamando services, não repositories.

Validation:

- `bun run typecheck`
- `bun run lint`

## T6 - Validar comportamento manual do catálogo

Status: completed
Depends on: T1, T2, T5
Can run in parallel: false

Files:

- src/modules/works/screens/WorkListScreen.tsx
- src/modules/works/components/WorkForm.tsx
- src/modules/works/screens/EditWorkScreen.tsx

Scope:

- Validar manualmente que a listagem padrão mostra serviços ativos.
- Validar manualmente que serviços inativos aparecem no filtro de inativos.
- Validar manualmente que reativar um serviço o devolve à listagem padrão.
- Validar manualmente que excluir um serviço o remove do catálogo, inclusive dos filtros.
- Não criar módulo, schema, migration ou tela de orders nesta task.

Acceptance Criteria:

- Serviço inativado sai da listagem padrão de ativos.
- Serviço inativado aparece no filtro de inativos.
- Serviço reativado volta à listagem padrão de ativos.
- Serviço excluído fisicamente deixa de aparecer em ativos e inativos.
- Não existem alterações em `src/modules/orders`, schemas de orders ou migrations de orders.

Validation:

- `bun run typecheck`
- `bun run lint`

## T7 - Registrar contratos futuros de orders sem implementar orders

Status: completed
Depends on: T6
Can run in parallel: false

Files:

- .specs/tasks/LMX-30-fase-2-1-alinhamento-do-catalogo-de-servicos/contracts.ts
- .specs/tasks/LMX-30-fase-2-1-alinhamento-do-catalogo-de-servicos/tasks.md

Scope:

- Usar os contratos já gerados para orientar a implementação futura de orders.
- Confirmar que nenhum arquivo produtivo de orders foi criado nesta task.
- Confirmar que o contrato registra seleção futura apenas de serviços ativos em novas notas.
- Confirmar que o contrato registra snapshot futuro de nome e preço em `OrderItem`.

Acceptance Criteria:

- O escopo de LMX-30 permanece restrito ao catálogo de serviços.
- A restrição futura de orders selecionar somente serviços ativos está registrada em contrato.
- A preservação histórica futura por snapshots de `OrderItem` está registrada em contrato.
- Nenhuma implementação de orders, schema de orders ou migration de orders é adicionada.

Validation:

- `bun run typecheck`
- `bun run lint`
