import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateWorkInput } from '../../types/works.types';
import { worksService } from '../../services/works.service';
import { worksQueryKeys } from '../works.query-keys';

export const useCreateWorkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkInput) => {
      return worksService.createWork(data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: worksQueryKeys.all,
      });
    },
  });
};
