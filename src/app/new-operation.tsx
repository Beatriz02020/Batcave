import { Text, View } from 'react-native';

export default function NewOperationScreen() {
  return (
    <View className="flex-1 bg-bat-bg px-5 pb-24 pt-8 md:pl-[242px] md:pt-12">
      <View className="mx-auto w-full max-w-[900px]">
        <Text className="font-mono text-xs tracking-[3px] text-bat-green">ORACLE  //  NOVA OPERAÇÃO</Text>
        <Text className="mt-4 text-3xl font-bold text-bat-text">Criar operação</Text>
        <Text className="mt-2 text-base text-bat-muted">Defina uma nova operação para acompanhar no painel.</Text>
      </View>
    </View>
  );
}
