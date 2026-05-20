import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Icon } from '@/shared/ui/Icon';
import { MoneyText } from '@/shared/ui/MoneyText';
import { Text, View } from 'react-native';
import { Work } from '../types/works.types';

type WorkCardProps = {
  item: Work;
  onEdit: () => void;
};

export const WorkCard: React.FC<WorkCardProps> = ({ item, onEdit }) => {
  return (
    <Card onPress={onEdit}>
      <View className="flex-row justify-between ">
        <Text className="truncate text-lg font-semibold text-slate-900">
          {item.name}
        </Text>
        <Badge status={item.status} />
      </View>
      <Text className="mb-4 truncate border-b border-slate-100 pb-4   text-slate-500">
        {item.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <MoneyText size="xl" amount={item.price} />
        <View className="flex flex-row items-center  gap-1">
          <Text className="text-lg font-bold text-blue-600">Editar</Text>
          <Icon name="ChevronRight" className="font-bold text-blue-600" />
        </View>
      </View>
    </Card>
  );
};
