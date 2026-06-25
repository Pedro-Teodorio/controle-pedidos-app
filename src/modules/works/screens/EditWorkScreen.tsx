import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWork } from '../hooks/queries/use-works';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { WorkForm } from '../components/WorkForm';
import { useEditWorkMutation } from '../hooks/mutations/use-edit-work-mutation';
import { WorkFormData } from '../schemas/work.form.schema';
import { Alert } from 'react-native';
import { useDeleteWorkMutation } from '../hooks/mutations/use-delete-work-mutation';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useBottomSheet } from '@/shared/hooks/useBottomSheet';

export const EditWorkScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const workId = typeof id === 'string' ? id : undefined;
  const { bottomSheetRef, handleOpenBottomSheet, handleCloseBottomSheet } =
    useBottomSheet();

  const router = useRouter();

  const { data: work } = useWork(workId ?? '');
  const { mutateAsync: editWork, isPending } = useEditWorkMutation();
  const { mutateAsync: deleteWork, isPending: isDeleting } =
    useDeleteWorkMutation();

  const handleSubmit = async (data: WorkFormData) => {
    try {
      if (!work || !workId) {
        Alert.alert('Erro', 'Não foi possível identificar o serviço.');
        return;
      }
      await editWork({ id: workId, data });
      router.push('/works');
    } catch {
      Alert.alert('Erro', 'Não foi possível editar o serviço.');
    }
  };

  const handleDelete = async () => {
    try {
      if (!work || !workId) {
        Alert.alert('Erro', 'Não foi possível identificar o serviço.');
        return;
      }
      await deleteWork({ id: workId });
      router.push('/works');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o serviço.');
    }
  };

  return (
    <>
      <ScreenContainer>
        <ScreenHeader
          title="Editar serviço"
          subtitle={work?.name}
          onBack={() => router.back()}
        />
        <WorkForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          onDelete={handleOpenBottomSheet}
          isSubmitting={isPending}
          submitLabel="Editar"
          defaultValues={work}
        />
      </ScreenContainer>
      <ConfirmDialog
        bottomSheetRef={bottomSheetRef}
        title="Excluir serviço?"
        description="O serviço será removido permanentemente do catálogo."
        confirmText="Excluir"
        cancelText="Voltar"
        onConfirm={handleDelete}
        onCancel={handleCloseBottomSheet}
        isSubmitting={isDeleting}
        destructive
      />
    </>
  );
};
