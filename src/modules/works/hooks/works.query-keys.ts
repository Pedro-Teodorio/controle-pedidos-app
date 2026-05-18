import { FindAllWorksFilters } from '../types/works.types';

/**
 * Query Keys Factory para Works
 *
 * Baseado em: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
 *
 * Princípios:
 * - Query keys devem ser um array no topo nível
 * - Devem ser serializáveis com JSON.stringify
 * - Únicos para cada query distinta
 * - Incluir todas as variáveis que mudam na query
 *
 * Exemplo de uso:
 * useQuery({
 *   queryKey: worksQueryKeys.findAllWithFilters({ search: 'João', active: true }),
 *   queryFn: () => worksService.findAllWorks({ search: 'João', active: true })
 * })
 *
 * Invalidação:
 * queryClient.invalidateQueries({ queryKey: worksQueryKeys.all })
 * queryClient.invalidateQueries({ queryKey: worksQueryKeys.findById('123') })
 */
export const worksQueryKeys = {
  // Root key - invalida todas as queries de works
  all: ['works'] as const,

  // findAllWorks - sem filtros
  findAll: () => ['works', 'findAll'] as const,

  // findAllWorks - com filtros específicos
  // Inclui search e active pois são variáveis que mudam
  findAllWithFilters: (filters: FindAllWorksFilters) =>
    ['works', 'findAll', filters] as const,

  // findWorkById - com ID específico
  // ID é incluído pois é a variável que diferencia cada query
  findById: (id: string) => ['works', 'detail', id] as const,

  // countWorksByStatusSummary - sem parâmetros
  countByStatus: () => ['works', 'summary', 'countByStatus'] as const,
};
