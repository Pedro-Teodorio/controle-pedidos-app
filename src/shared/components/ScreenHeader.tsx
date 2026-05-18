import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { useRouter } from 'expo-router';

type ScreenHeaderProps = {
  title: string;
  subtitle: string;
  onBack?: () => void;
  onCreate?: () => void;
};

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onCreate,
}) => {
  return (
    <View className="flex-1 flex-col">
      <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center gap-4">
          {onBack && !onCreate && (
            <Button
              className="h-12 w-12"
              iconName="ArrowLeft"
              rounded="xl"
              variant="secondary"
              onPress={onBack}
            />
          )}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-slate-950">{title}</Text>
            <Text className="text-base text-slate-500">{subtitle}</Text>
          </View>
        </View>
        {onCreate && !onBack && (
          <Button
            onPress={onCreate}
            className="h-12 w-12"
            iconName="Plus"
            rounded="xl"
          />
        )}
      </View>
    </View>
  );
};
