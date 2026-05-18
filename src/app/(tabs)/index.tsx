import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <ScreenContainer>
      <View className="flex-1">
        <Text className="text-2xl font-bold">Inicio</Text>
      </View>
    </ScreenContainer>
  );
};

export default HomeScreen;
