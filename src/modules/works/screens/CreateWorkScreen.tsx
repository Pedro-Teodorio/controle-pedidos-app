import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { useRouter } from 'expo-router';
import { WorkForm } from '../components/WorkForm';

export const CreateWorkScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Novo serviço"
        subtitle="Cadastro de item do catálogo"
        onBack={() => router.back()}
      />
      <WorkForm onSubmit={() => {}} />
    </ScreenContainer>
  );
};
