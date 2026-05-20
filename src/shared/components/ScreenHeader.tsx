import { Text, View } from 'react-native';
import { Button } from '../ui/Button';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
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
    <View className="mb-4 flex-col">
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
          <View>
            <Text className="text-3xl font-bold text-slate-950">{title}</Text>
            {subtitle && (
              <Text className="text-base text-slate-500">{subtitle}</Text>
            )}
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
