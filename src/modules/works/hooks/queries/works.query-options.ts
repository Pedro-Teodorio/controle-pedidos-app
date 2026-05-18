import { queryOptions } from '@tanstack/react-query';
import { FindAllWorksFilters } from '../../types/works.types';
import { worksQueryKeys } from '../works.query-keys';
import { worksService } from '../../services/works.service';

/**
 * Query Options Factory para Works
 *
 *
 * Centraliza: queryKey + queryFn + defaultOptions
 */

export const worksQueryOptions = {
  /**
   * Query para listar todos os works com filtros opcionais
   */

  findAll: (filters: FindAllWorksFilters = {}) =>
    queryOptions({
      queryKey: worksQueryKeys.findAllWithFilters(filters),
      queryFn: () => worksService.findAllWorks(filters),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }),

  /**
   * Query para buscar um work específico
   */
  findById: (id: string) =>
    queryOptions({
      queryKey: worksQueryKeys.findById(id),
      queryFn: () => worksService.findWorkById(id),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      enabled: !!id,
    }),

  /**
   * Query para contar works por status
   */
  countByStatus: () =>
    queryOptions({
      queryKey: worksQueryKeys.countByStatus(),
      queryFn: () => worksService.getStatusSummary(),
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    }),
};
