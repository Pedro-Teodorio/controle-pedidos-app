import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Index: React.FC = () => {
  return (
    <SafeAreaProvider>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-green-500">Hello World</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default Index;
