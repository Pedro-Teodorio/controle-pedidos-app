import '../styles/global.css';
import 'react-native-get-random-values';
import migrations from '../../drizzle/migrations';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/database/client';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayout = () => {
  const queryClient = new QueryClient();
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="p=4 flex-1 items-center justify-center">
        <Text>Erro ao preparar banco de dados: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View className="p=4 flex-1 items-center justify-center">
        <Text>Preparando banco de dados...</Text>
      </View>
    );
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="works" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </>
  );
};

export default RootLayout;
