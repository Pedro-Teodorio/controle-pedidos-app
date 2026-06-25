import { useMutation, useQueryClient } from '@tanstack/react-query';
import { worksService } from '../../services/works.service';
import { worksQueryKeys } from '../works.query-keys';

export const useDeleteWorkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return worksService.deleteWork(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: worksQueryKeys.all });
    },
  });
};
