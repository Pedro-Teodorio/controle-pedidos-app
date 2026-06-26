# Especificação - LMX-30 - Alinhamento do catálogo de serviços

## Objetivo

Formalizar o comportamento do catálogo de serviços para suportar duas operações distintas:

- ativação/inativação lógica do serviço via status;
- exclusão física permanente como ação destrutiva confirmada.

A especificação também registra o contrato futuro de que novas notas devem usar apenas serviços ativos e que o histórico de notas deve ser preservado por snapshots em `OrderItem`.

## Requisitos funcionais

### RF-01 - Ativar e inativar serviço

WHEN o usuário editar um serviço existente  
THEN a tela SHALL exibir um controle de status para marcar o serviço como ativo ou inativo.

WHEN o usuário salvar um serviço com status ativo  
THEN o sistema SHALL persistir o serviço com `status = 'active'`.

WHEN o usuário salvar um serviço com status inativo  
THEN o sistema SHALL persistir o serviço com `status = 'inactive'`.

WHEN o status de um serviço for alterado  
THEN o sistema SHALL invalidar as queries relacionadas ao catálogo de serviços.

### RF-02 - Listagem padrão do catálogo

WHEN o usuário acessar a listagem do catálogo de serviços  
THEN o sistema SHALL exibir por padrão apenas serviços ativos.

WHEN um serviço estiver com `status = 'inactive'`  
THEN o sistema SHALL omitir esse serviço da listagem padrão de ativos.

WHEN a busca textual estiver ativa na listagem padrão  
THEN o sistema SHALL aplicar a busca mantendo o filtro de serviços ativos.

### RF-03 - Filtro de serviços inativos

WHEN o usuário selecionar o filtro de serviços inativos  
THEN o sistema SHALL exibir serviços com `status = 'inactive'`.

WHEN houver serviços inativos cadastrados  
THEN o filtro de inativos SHALL permitir encontrá-los no catálogo.

WHEN a busca textual estiver ativa no filtro de inativos  
THEN o sistema SHALL aplicar a busca mantendo o filtro de serviços inativos.

### RF-04 - Exclusão física como operação destrutiva

WHEN o usuário estiver editando um serviço existente  
THEN o sistema SHALL disponibilizar uma ação de exclusão física separada do controle de status.

WHEN o usuário acionar a exclusão física  
THEN o sistema SHALL exigir confirmação antes de remover o serviço.

WHEN o diálogo de confirmação de exclusão for exibido  
THEN o texto SHALL comunicar que a exclusão é permanente, remove o serviço do catálogo e não pode ser desfeita.

WHEN o usuário cancelar a confirmação de exclusão  
THEN o sistema SHALL preservar o serviço sem alteração.

WHEN o usuário confirmar a exclusão  
THEN o sistema SHALL remover fisicamente o registro do serviço da tabela `works`.

WHEN um serviço for excluído fisicamente  
THEN o sistema SHALL invalidar as queries relacionadas ao catálogo de serviços.

WHEN um serviço for excluído fisicamente  
THEN o serviço SHALL deixar de aparecer no catálogo, inclusive nos filtros de ativos e inativos.

### RF-05 - Diferença entre inativação e exclusão

WHEN o usuário visualizar os textos relacionados ao status do serviço  
THEN o sistema SHALL comunicar que serviço ativo fica disponível para novas notas.

WHEN o usuário visualizar os textos relacionados à exclusão  
THEN o sistema SHALL comunicar que exclusão é uma ação permanente e destrutiva.

WHEN o usuário apenas inativar um serviço  
THEN o sistema SHALL manter o registro persistido para consulta no filtro de inativos.

WHEN o usuário excluir fisicamente um serviço  
THEN o sistema SHALL remover o registro do catálogo em vez de apenas alterar seu status.

### RF-06 - Novas notas devem usar somente serviços ativos

WHEN o módulo de novas notas/orders for implementado  
THEN a seleção de serviços para uma nova nota SHALL consultar somente serviços ativos.

WHEN um serviço estiver inativo  
THEN o serviço SHALL NOT estar disponível para seleção em novas notas.

WHEN um serviço estiver ativo  
THEN o serviço SHALL estar elegível para seleção em novas notas, respeitando demais regras futuras do módulo de orders.

### RF-07 - Preservação histórica por snapshots em OrderItem

WHEN o módulo de orders/order items for implementado  
THEN cada `OrderItem` SHALL armazenar snapshot dos dados necessários do serviço no momento da criação do item.

WHEN um item de nota for criado a partir de um serviço  
THEN o `OrderItem` SHALL preservar pelo menos o nome do serviço e o preço unitário usados naquele momento.

WHEN um serviço for alterado, inativado ou excluído após a criação de uma nota  
THEN o histórico da nota SHALL continuar exibindo os valores preservados no snapshot do `OrderItem`.

WHEN schemas de orders e order items forem criados  
THEN a modelagem SHALL NOT depender da existência futura do registro em `works` para exibir histórico da nota.

## Edge cases

- WHEN o usuário cancelar a confirmação de exclusão THEN nenhum dado SHALL ser alterado.
- WHEN o serviço já tiver sido excluído antes da confirmação ser processada THEN o sistema SHALL tratar o serviço como inexistente sem corromper o catálogo.
- WHEN a listagem de ativos não tiver resultados THEN o sistema SHALL exibir estado vazio compatível com o padrão visual existente.
- WHEN a listagem de inativos não tiver resultados THEN o sistema SHALL exibir estado vazio compatível com o padrão visual existente.
- WHEN houver busca textual combinada com filtro de status THEN o sistema SHALL respeitar ambos os filtros.
- WHEN um serviço inativo for reativado THEN ele SHALL voltar a aparecer na listagem padrão de ativos.
- WHEN um serviço ativo for inativado THEN ele SHALL sair da listagem padrão de ativos e aparecer no filtro de inativos.
- WHEN a exclusão física for confirmada THEN a operação SHALL remover o registro, não alterar `status` para `inactive`.
- WHEN orders ainda não existirem no código THEN a implementação SHALL NOT criar módulo de orders apenas para satisfazer esta task.

## Fora de escopo

- Criar o módulo `orders`.
- Criar telas de nova nota/pedido.
- Criar schemas `orders` ou `order_items`.
- Gerar migrations de orders/order items.
- Implementar snapshots de `OrderItem` nesta fase, pois `OrderItem` ainda não existe.
- Criar infraestrutura de testes automatizados.
- Substituir exclusão física por inativação lógica.
- Adicionar soft delete, `deletedAt` ou lixeira de serviços.
- Alterar rotas do Expo Router.
- Alterar componentes compartilhados sem necessidade objetiva.

## Critérios de aceite verificáveis

- [ ] A edição de serviço mantém controle de status ativo/inativo.
- [ ] Um serviço inativado deixa de aparecer na listagem padrão de ativos.
- [ ] Um serviço inativado aparece no filtro de inativos.
- [ ] Um serviço reativado volta a aparecer na listagem padrão de ativos.
- [ ] A ação de exclusão física continua separada do switch de status.
- [ ] A exclusão física exige confirmação antes de remover o serviço.
- [ ] O texto de confirmação informa que a exclusão é permanente e não pode ser desfeita.
- [ ] Ao cancelar a confirmação, o serviço permanece no catálogo.
- [ ] Ao confirmar a exclusão, o serviço é removido fisicamente e sai do catálogo.
- [ ] As mutations de edição e exclusão invalidam `worksQueryKeys.all` ou query equivalente do domínio.
- [ ] Não são criados módulo, schema, migration ou telas de orders nesta task.
- [ ] A documentação/contrato da task registra que novas orders devem selecionar apenas serviços ativos.
- [ ] A documentação/contrato da task registra que histórico futuro deve ser preservado por snapshots em `OrderItem`.
- [ ] `bun run typecheck` passa após a implementação futura.
- [ ] `bun run lint` passa após a implementação futura.

## Observações para implementação futura

- O comportamento atual encontrado na pesquisa já atende grande parte dos requisitos.
- A implementação futura deve priorizar ajustes pontuais de copy e confirmação, evitando refatorações amplas.
- A direção da LMX-28 de substituir exclusão física por inativação não deve ser aplicada nesta task, pois a LMX-30 exige manter as duas operações.
