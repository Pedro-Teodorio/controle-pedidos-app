import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { Icon, IconName } from '../ui/Icon';

type ErrorStateProps = {
  title: string;
  description?: string;
  iconName?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  iconName = 'TriangleAlert',
  actionLabel,
  onAction,
  className,
}) => {
  const shouldShowAction = Boolean(actionLabel && onAction);

  return (
    <View
      className={`flex-1 items-center justify-center gap-4 px-6 ${className ?? ''}`}>
      <View className="size-16 items-center justify-center rounded-2xl bg-red-50">
        <Icon name={iconName} className="size-8 text-red-600" />
      </View>

      <View className="items-center gap-1">
        <Text className="text-center text-xl font-bold text-slate-900">
          {title}
        </Text>
        {description ? (
          <Text className="text-center text-base text-slate-500">
            {description}
          </Text>
        ) : null}
      </View>

      {shouldShowAction ? (
        <Button onPress={onAction}>{actionLabel}</Button>
      ) : null}
    </View>
  );
};
