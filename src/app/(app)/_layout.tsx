import { Slot } from 'expo-router';
import { View } from 'react-native';

import AppTabs from '@/components/app-tabs';

/**
 * Layout para rotas de aplicação autenticada
 * Inclui navegação via AppTabs (menu hambúrguer + conteúdo)
 */
export default function AppLayout() {
  return (
    <View className="flex-1">
      <Slot />
      <AppTabs />
    </View>
  );
}
