import { FilterChips } from '@/shared/components/FilterChips';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { SearchInput } from '@/shared/ui/SearchInput';
import { View } from 'react-native';
import { StatusFilter } from '../types/works.types';

type WorkStatusOption = {
  value: StatusFilter;
  label: string;
  count: number;
};

type WorkHeaderScreenProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  statusOptions: WorkStatusOption[];
  onCreate: () => void;
};

export const WorkListHeaderScreen: React.FC<WorkHeaderScreenProps> = ({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  statusOptions,
  onCreate,
}) => {
  return (
    <View className="flex-1">
      <ScreenHeader
        title="Serviços"
        subtitle="Catálogo de serviços"
        onCreate={onCreate}
      />
      <View className=" gap-4">
        <SearchInput
          placeholder="Buscar serviço"
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText('')}
        />

        <FilterChips
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </View>
    </View>
  );
};
