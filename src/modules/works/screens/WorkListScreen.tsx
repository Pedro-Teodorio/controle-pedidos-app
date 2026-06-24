import { ErrorState } from '@/shared/components/ErrorState';
import { ListScreenContainer } from '@/shared/components/ListScreenContainer';
import { LoadingState } from '@/shared/components/LoadingState';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { WorkCard } from '../components/WorkCard';
import { WorkEmptyState } from '../components/WorkEmptyState';
import { WorkListHeaderScreen } from '../components/WorkListHeaderScreen';
import { useWorks, useWorksCountByStatus } from '../hooks/queries/use-works';
import { StatusFilter, StatusOptions } from '../types/works.types';

export const WorkListScreen: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [searchText, setSearchText] = useState('');

  const {
    data: works,
    isLoading: worksLoading,
    isError: worksIsError,
    refetch,
  } = useWorks({
    status: statusFilter,
    search: searchText,
  });

  const { data: countByStatus } = useWorksCountByStatus();

  const handleCreate = () => {
    router.push('/works/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/works/${id}`);
  };

  const statusOptions: StatusOptions[] = [
    { value: 'active', label: 'Ativo', count: countByStatus?.active ?? 0 },
    {
      value: 'inactive',
      label: 'Inativo',
      count: countByStatus?.inactive ?? 0,
    },
  ];

  const normalizedSearchText = searchText.trim();
  const hasWorks = Array.isArray(works) && works.length > 0;

  const emptyStateVariant =
    !hasWorks && statusFilter === 'active' && !normalizedSearchText
      ? 'empty'
      : 'search';

  if (worksLoading && !hasWorks) {
    return (
      <LoadingState
        title="Carregando serviços"
        description="Aguarde enquanto buscamos os dados"
      />
    );
  }

  if (worksIsError) {
    return (
      <ErrorState
        title="Erro ao carregar serviços"
        description="Não foi possível carregar os serviços. Tente novamente."
        actionLabel="Tentar novamente"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <ListScreenContainer
      data={works ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WorkCard item={item} onEdit={() => handleEdit(item.id)} />
      )}
      header={
        <WorkListHeaderScreen
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchText={searchText}
          setSearchText={setSearchText}
          onCreate={handleCreate}
        />
      }
      empty={
        <WorkEmptyState variant={emptyStateVariant} onAction={handleCreate} />
      }
    />
  );
};
