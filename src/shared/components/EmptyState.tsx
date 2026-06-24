import { Text, View } from 'react-native';
import { Icon, IconName } from '../ui/Icon';
import { Button } from '../ui/Button';

type EmptyStateProps = {
  iconName?: IconName;
  title: string;
  description?: string;
  action?: string;
  className?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'Inbox',
  title,
  description,
  action,
  onAction,
  className,
}) => {
  return (
    <View
      className={`mt-20 flex flex-1 flex-col items-center justify-center gap-4 text-center ${className ?? ''}`}>
      <View className="flex size-16 items-center justify-center rounded-2xl bg-blue-50">
        <Icon name={iconName} className="size-8  text-blue-600" />
      </View>
      <View className="flex flex-col items-center justify-center gap-1">
        <Text className="text-xl font-bold text-slate-900 ">{title}</Text>
        {description && (
          <Text className="text-center text-lg text-slate-500">
            {description}
          </Text>
        )}
      </View>
      {action && onAction ? <Button onPress={onAction}>{action}</Button> : null}
    </View>
  );
};
