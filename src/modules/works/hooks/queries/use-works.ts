import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { worksQueryOptions } from './works.query-options';
import { FindAllWorksFilters, Work } from '../../types/works.types';

export const useWorks = (
  filters: FindAllWorksFilters = {}
): UseQueryResult<Work[], Error> => {
  return useQuery(worksQueryOptions.findAll(filters));
};

export const useWork = (id: string): UseQueryResult<Work, Error> => {
  return useQuery(worksQueryOptions.findById(id));
};

export const useWorksCountByStatus = () => {
  return useQuery(worksQueryOptions.countByStatus());
};
