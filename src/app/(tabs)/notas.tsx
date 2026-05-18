import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Text, View } from 'react-native';

const NotasScreen = () => {
  return (
    <ScreenContainer>
      <View className="flex-1">
        <Text className="text-2xl font-bold">Notas</Text>
      </View>
    </ScreenContainer>
  );
};

export default NotasScreen;
