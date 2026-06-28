import { FindAllWorksFilters } from '../types/works.types';

export const worksQueryKeys = {
  all: ['works'] as const,
  findAll: () => ['works', 'findAll'] as const,
  findAllWithFilters: (filters: FindAllWorksFilters) =>
    ['works', 'findAll', filters] as const,
  findById: (id: string) => ['works', 'detail', id] as const,
  countByStatus: () => ['works', 'summary', 'countByStatus'] as const,
};
