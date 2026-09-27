import { ActivityIndicator, Pressable, Text } from 'react-native';

export function AuthSubmitButton({ creating, loading, onPress }: { creating: boolean; loading: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={loading} className="mt-1 min-h-[62px] items-center justify-center rounded-xl bg-bat-gold active:opacity-80 md:mt-2 md:min-h-[72px]">
      {loading ? <ActivityIndicator color="#111216" /> : <Text className="font-mono text-sm font-bold tracking-[2px] text-bat-ink md:text-lg md:tracking-[3px]">{creating ? 'CRIAR CONTA' : 'ACESSAR SISTEMA'}</Text>}
    </Pressable>
  );
}
