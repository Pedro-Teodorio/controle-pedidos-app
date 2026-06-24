import { ActivityIndicator, Text, View } from 'react-native';

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <View
      className={`flex-1 items-center justify-center gap-3 px-6 ${className ?? ''}`}>
      <View className="size-16 items-center justify-center rounded-2xl bg-blue-50">
        <ActivityIndicator size="small" color="#2563EB" />
      </View>

      {title ? (
        <Text className="text-center text-xl font-bold text-slate-900">
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text className="text-center text-base text-slate-500">
          {description}
        </Text>
      ) : null}
    </View>
  );
};
