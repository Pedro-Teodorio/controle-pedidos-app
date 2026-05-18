import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { worksQueryOptions } from './works.query-options';
import { FindAllWorksFilters, Work } from '../../types/works.types';

/**
 * Hook para buscar todos os works
 *
 *
 * Exemplo:
 * const { data, isLoading, error } = useWorks({ search: 'João' });
 */
export const useWorks = (
  filters: FindAllWorksFilters = {}
): UseQueryResult<Work[], Error> => {
  return useQuery(worksQueryOptions.findAll(filters));
};

/**
 * Hook para buscar um work específico por ID
 *
 * Exemplo:
 * const { data: work, isLoading, error } = useWork('123');
 */
export const useWork = (id: string): UseQueryResult<Work | null, Error> => {
  return useQuery(worksQueryOptions.findById(id));
};

/**
 * Hook para contar works por status
 *
 * Exemplo:
 * const { data: summary } = useWorksCountByStatus();
 * // summary => { all: 10, active: 7, inactive: 3 }
 */
export const useWorksCountByStatus = () => {
  return useQuery(worksQueryOptions.countByStatus());
};
