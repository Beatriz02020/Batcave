import { router } from 'expo-router';
import { TabList, TabListProps, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

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
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>OPERAÇÕES</TabButton>
          </TabTrigger>
          <TabTrigger name="new-operation" href="/new-operation" asChild>
            <TabButton>NOVA OP</TabButton>
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

  return (
    <View {...props} className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#202126] bg-bat-bg px-4 py-2 md:bottom-auto md:right-auto md:top-0 md:h-full md:w-[202px] md:border-r md:border-t-0 md:px-3 md:py-5">
      <View className="flex-row items-center justify-around md:h-full md:flex-col md:items-stretch md:justify-start md:gap-3">
        <View className="hidden border-b border-[#202126] pb-5 md:flex md:flex-col md:gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-bat-gold">
            <Text className="font-mono text-[10px] text-bat-gold">W</Text>
          </View>
          <Text className="font-mono text-[9px] tracking-[3px] text-bat-muted">WAYNE ENTERPRISES</Text>
          <Text className="font-mono text-[7px] tracking-[2px] text-[#505159]">SISTEMA DE OPERAÇÕES</Text>
        </View>

        <View className="flex-row gap-1 md:flex-col md:gap-2">{props.children}</View>

        <View className="hidden md:mt-auto md:flex md:gap-3">
          <Text className="font-mono text-[9px] tracking-[2px] text-bat-green">● ORACLE ATIVA</Text>
          <Pressable onPress={() => { void logout(); router.replace('/login'); }}>
            <Text className="text-xs text-bat-muted">Sair</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
