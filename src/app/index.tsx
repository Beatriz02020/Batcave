import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OperationCard } from '@/components/dashboard/operation-card';
import { StatCard } from '@/components/dashboard/stat-card';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bat-bg">
      <ScrollView contentContainerClassName="flex-grow md:pl-[202px]" className="bg-bat-bg">
        <View className="mx-auto w-full max-w-[1100px] px-5 pb-24 pt-6 sm:px-9 sm:pt-10 md:pb-12">
          <View className="mb-7 flex-row items-start justify-between border-b border-[#202126] pb-6 md:border-0 md:pb-0">
            <View>
              <Text className="font-mono text-[10px] tracking-[3px] text-bat-muted md:hidden">WAYNE ENTERPRISES</Text>
              <Text className="mt-2 text-3xl font-bold text-bat-text sm:text-4xl">Boa noite, Bruce.</Text>
              <Text className="mt-2 font-mono text-xs tracking-[2px] text-bat-green sm:text-sm">● ORACLE  //  RELATÓRIO DIÁRIO  ·  CONEXÃO SEGURA</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full border border-bat-border">
              <Text className="font-mono text-[10px] text-bat-gold">BW</Text>
            </View>
          </View>

          <View className="mb-5 rounded-xl border-2 border-bat-border bg-bat-panel p-5 sm:p-6">
            <Text className="text-sm leading-6 text-[#b2b3b8] sm:text-base">”Revisei as operações de hoje. Você está em <Text className="text-bat-gold">78%</Text> de conclusão. Duas operações exigem atenção imediata.”</Text>
          </View>

          <View className="mb-6 flex-row flex-wrap gap-3 sm:gap-4">
            <StatCard label="Ativas" value="04" />
            <StatCard label="Concluídas" value="07" />
            <StatCard label="Progresso" value="78%" highlight />
            <StatCard label="Sequência" value="5d" highlight hideOnMobile />
          </View>

          <Text className="mb-4 font-mono text-xs tracking-[3px] text-bat-muted sm:text-sm">OPERAÇÕES ATIVAS</Text>
          <View className="gap-4 md:flex-row">
            <OperationCard title="Concluir projeto de Engenharia de Software" priority="ALTA PRIORIDADE" progress={72} due="Prazo hoje" urgent />
            <OperationCard title="Revisar Estruturas de Dados" priority="PRIORIDADE MÉDIA" progress={40} due="Prazo amanhã" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
