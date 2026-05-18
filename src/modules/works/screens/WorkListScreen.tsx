import { ListScreenContainer } from '@/shared/components/ListScreenContainer';
import { WorkListHeaderScreen } from '../components/WorkListHeaderScreen';
import { useState } from 'react';
import { StatusFilter, StatusOptions } from '../types/works.types';
import { EmptyState } from '@/shared/components/EmptyState';
import { Text } from 'react-native';
import { useWorks, useWorksCountByStatus } from '../hooks/queries/use-works';
import { Card } from '@/shared/ui/Card';
import { useRouter } from 'expo-router';

export const WorkListScreen: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [searchText, setSearchText] = useState('');

  const { data: works } = useWorks({
    status: statusFilter,
    search: searchText,
  });

  const { data: countByStatus } = useWorksCountByStatus();

  const handleCreate = () => {
    router.push('/works/create');
  };

  const statusOptions: StatusOptions[] = [
    { value: 'active', label: 'Ativo', count: countByStatus?.active ?? 0 },
    {
      value: 'inactive',
      label: 'Inativo',
      count: countByStatus?.inactive ?? 0,
    },
  ];

  return (
    <ListScreenContainer
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
        <EmptyState
          title="Sem serviços ainda"
          description="Crie um novo serviço para começar"
          action="Novo serviço"
          iconName="Tag"
          onAction={handleCreate}
        />
      }
      data={works ?? []}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>{item.status}</Text>
          <Text>{item.price}</Text>
        </Card>
      )}
    />
  );
};
