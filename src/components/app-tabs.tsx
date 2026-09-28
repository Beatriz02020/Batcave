import { router, Slot } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';

export default function AppTabs() {
  return (
    <View className="flex-1">
      <Slot />
      <MobileNavigation />
    </View>
  );
}

function MobileNavigation() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(path: '/' | '/new-operation' | '/notes') {
    setMenuOpen(false);
    router.replace(path);
  }

  return (
    <>
      <SafeAreaView className="absolute left-3 top-0 z-50">
        <Pressable
          accessibilityLabel="Abrir menu"
          onPress={() => setMenuOpen(true)}
          className="h-11 w-11 items-center justify-center rounded-lg border border-bat-gold bg-bat-panel">
          <View className="gap-1">
            <View className="h-0.5 w-5 bg-bat-gold" />
            <View className="h-0.5 w-5 bg-bat-gold" />
            <View className="h-0.5 w-5 bg-bat-gold" />
          </View>
        </Pressable>
      </SafeAreaView>

      <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
        <View className="flex-1 flex-row bg-black/70">
          <SafeAreaView className="w-72 border-r border-bat-gold bg-bat-bg px-6 py-5">
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <Text className="font-mono text-[10px] tracking-[3px] text-bat-gold">BATCOMPUTER</Text>
                <Text className="mt-1 font-mono text-[8px] tracking-[2px] text-bat-green">MISSION CONTROL</Text>
              </View>
              <Pressable accessibilityLabel="Fechar menu" onPress={() => setMenuOpen(false)}>
                <Text className="text-3xl text-bat-muted">×</Text>
              </Pressable>
            </View>

            <View className="gap-3">
              <MenuItem label="PAINEL" onPress={() => navigate('/')} />
              <MenuItem label="NOVA OP" onPress={() => navigate('/new-operation')} />
              <MenuItem label="ANOTAÇÕES" onPress={() => navigate('/notes')} />
            </View>

            <View className="mt-auto gap-4">
              <Text className="font-mono text-[10px] tracking-[2px] text-bat-green">● ORACLE ATIVA</Text>
              <Pressable onPress={() => { void logout(); router.replace('/login'); }}>
                <Text className="text-sm text-bat-muted">Sair</Text>
              </Pressable>
            </View>
          </SafeAreaView>
          <Pressable accessibilityLabel="Fechar menu" onPress={() => setMenuOpen(false)} className="flex-1" />
        </View>
      </Modal>
    </>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded-lg bg-bat-panel px-4 py-4">
      <Text className="font-mono text-xs tracking-[2px] text-bat-gold">{label}</Text>
    </Pressable>
  );
}
