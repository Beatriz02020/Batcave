import { Text, View } from 'react-native';

export function AuthStatus({ creating }: { creating: boolean }) {
  return (
    <View className="mb-7 flex-row items-center gap-2 md:mb-8 md:gap-3">
      <View className={`h-2.5 w-2.5 rounded-full ${creating ? 'bg-bat-gold' : 'bg-bat-green'} md:h-3 md:w-3`} />
      <Text className={`font-mono text-xs tracking-[2px] md:text-sm md:tracking-[3px] ${creating ? 'text-bat-gold' : 'text-bat-green'}`}>
        ORACLE  //  {creating ? 'NOVA IDENTIDADE' : 'CONEXÃO SEGURA'}
      </Text>
    </View>
  );
}
