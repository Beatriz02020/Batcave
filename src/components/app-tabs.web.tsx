import { router } from 'expo-router';
import { TabList, TabListProps, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>PAINEL</TabButton>
          </TabTrigger>
          <TabTrigger name="new-operation" href="/new-operation" asChild>
            <TabButton>NOVA OP</TabButton>
          </TabTrigger>
          <TabTrigger name="notes" href="/notes" asChild>
            <TabButton>ANOTAÇÕES</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className={`px-3 py-3 md:w-full md:rounded ${isFocused ? 'bg-bat-panel' : ''}`}>
      <Text className={`font-mono text-xs tracking-[2px] ${isFocused ? 'text-bat-gold' : 'text-bat-muted'}`}>{children}</Text>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(path: '/' | '/new-operation' | '/notes') {
    setMenuOpen(false);
    router.replace(path);
  }

  return (
    <View {...props} className="absolute left-3 top-0 z-20 w-11 md:bottom-auto md:right-auto md:top-0 md:h-full md:w-[202px] md:border-r md:border-t-0 md:px-3 md:py-5">
      <View className="flex-row items-center justify-around md:h-full md:flex-col md:items-stretch md:justify-start md:gap-3">
        <View className="hidden border-b border-[#202126] pb-5 md:flex md:flex-col md:gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-bat-gold">
            <Text className="font-mono text-[10px] text-bat-gold">W</Text>
          </View>
          <Text className="font-mono text-[9px] tracking-[3px] text-bat-muted">WAYNE ENTERPRISES</Text>
          <Text className="font-mono text-[7px] tracking-[2px] text-[#505159]">SISTEMA DE OPERAÇÕES</Text>
        </View>

        <View className="hidden flex-row gap-1 md:flex md:flex-col md:gap-2">{props.children}</View>

        <View className="hidden md:mt-auto md:flex md:gap-3">
          <Text className="font-mono text-[9px] tracking-[2px] text-bat-green">● ORACLE ATIVA</Text>
          <Pressable onPress={() => { void logout(); router.replace('/login'); }}>
            <Text className="text-xs text-bat-muted">Sair</Text>
          </Pressable>
        </View>

        <Pressable accessibilityLabel="Abrir menu" onPress={() => setMenuOpen(true)} className="h-11 w-11 items-center justify-center rounded-lg border border-bat-gold bg-bat-panel md:hidden">
          <View className="gap-1">
            <View className="h-0.5 w-5 bg-bat-gold" />
            <View className="h-0.5 w-5 bg-bat-gold" />
            <View className="h-0.5 w-5 bg-bat-gold" />
          </View>
        </Pressable>
      </View>

      <Modal visible={menuOpen} transparent animationType="slide" onRequestClose={() => setMenuOpen(false)}>
        <View className="flex-1 flex-row bg-black/70">
          <SafeAreaView className="w-72 border-r border-bat-gold bg-bat-bg px-6 py-5">
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <Text className="font-mono text-[10px] tracking-[3px] text-bat-gold">BATCOMPUTER</Text>
                <Text className="mt-1 font-mono text-[8px] tracking-[2px] text-bat-green">MISSION CONTROL</Text>
              </View>
              <Pressable accessibilityLabel="Fechar menu" onPress={() => setMenuOpen(false)}><Text className="text-2xl text-bat-muted">×</Text></Pressable>
            </View>
            <View className="gap-3">
              <MenuItem label="PAINEL" onPress={() => navigate('/')} />
              <MenuItem label="NOVA OP" onPress={() => navigate('/new-operation')} />
              <MenuItem label="ANOTAÇÕES" onPress={() => navigate('/notes')} />
            </View>
            <View className="mt-auto gap-4">
              <Text className="font-mono text-[10px] tracking-[2px] text-bat-green">● ORACLE ATIVA</Text>
              <Pressable onPress={() => { void logout(); router.replace('/login'); }}><Text className="text-sm text-bat-muted">Sair</Text></Pressable>
            </View>
          </SafeAreaView>
          <Pressable accessibilityLabel="Fechar menu" onPress={() => setMenuOpen(false)} className="flex-1" />
        </View>
      </Modal>
    </View>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} className="rounded bg-bat-panel px-4 py-4"><Text className="font-mono text-xs tracking-[2px] text-bat-gold">{label}</Text></Pressable>;
}
