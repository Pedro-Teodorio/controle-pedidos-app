import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWork } from '../hooks/queries/use-works';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { WorkForm } from '../components/WorkForm';
import { useEditWorkMutation } from '../hooks/mutations/use-edit-work-mutation';
import { WorkFormData } from '../schemas/work.form.schema';
import { Alert } from 'react-native';
import { useDeleteWorkMutation } from '../hooks/mutations/use-delete-work-mutation';

export const EditWorkScreen = () => {
  const { id } = useLocalSearchParams<{ id: 'string' }>();
  const router = useRouter();

  const { data: work } = useWork(id);
  const { mutateAsync: editWork, isPending } = useEditWorkMutation();
  const { mutateAsync: deleteWork } = useDeleteWorkMutation();

  const handleSubmit = async (data: WorkFormData) => {
    try {
      if (!work) return;
      await editWork({ id, data });
      router.push('/works');
    } catch {
      Alert.alert('Erro', 'Não foi possível editar o serviço.');
    }
  };

  const handleDelete = async () => {
    try {
      if (!work) return;
      await deleteWork({ id });
      router.push('/works');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir o serviço.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Editar serviço"
        subtitle={work?.name}
        onBack={() => router.back()}
      />
      <WorkForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onDelete={handleDelete}
        isSubmitting={isPending}
        submitLabel="Editar"
        defaultValues={work}
      />
    </ScreenContainer>
  );
};
