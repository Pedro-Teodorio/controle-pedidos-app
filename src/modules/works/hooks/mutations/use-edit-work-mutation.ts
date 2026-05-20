import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateWorkInput } from '../../types/works.types';
import { worksService } from '../../services/works.service';
import { worksQueryKeys } from '../works.query-keys';

type UseEditWorkMutationInput = {
  id: string;
  data: UpdateWorkInput;
};

export const useEditWorkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UseEditWorkMutationInput) => {
      return worksService.updateWork(id, data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: worksQueryKeys.all });
    },
  });
};
