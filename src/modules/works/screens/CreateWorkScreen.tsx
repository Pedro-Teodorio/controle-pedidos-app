import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { WorkForm } from '../components/WorkForm';
import { useCreateWorkMutation } from '../hooks/mutations/use-create-work-mutation';
import { WorkFormData } from '../schemas/work.form.schema';

export const CreateWorkScreen: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: createWork, isPending } = useCreateWorkMutation();

  const handleSubmit = async (data: WorkFormData) => {
    try {
      await createWork(data);
      router.push('/works');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o serviço. Tente novamente.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Novo serviço"
        subtitle="Cadastro de item do catálogo"
        onBack={() => router.back()}
      />
      <WorkForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={isPending}
        submitLabel="Salvar"
      />
    </ScreenContainer>
  );
};
