import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OperationCard } from '@/components/dashboard/operation-card';
import { useTasks } from '@/context/task-context';

export default function HomeScreen() {
  const { tasks, activeTasks, completedTasks, progress } = useTasks();

  return (
    <SafeAreaView className="flex-1 bg-bat-bg">
      <View className="absolute right-5 top-10 z-10 h-11 w-11 items-center justify-center rounded-full border border-bat-gold bg-bat-panel">
        <Text className="font-mono text-[10px] text-bat-gold">BW</Text>
      </View>
      <ScrollView contentContainerClassName="flex-grow md:pl-[202px]" className="bg-bat-bg">
        <View className="mx-auto w-full max-w-[1100px] px-5 pb-24 pt-20 sm:px-9 sm:pt-10 md:pb-12">
          <View className="mb-7 flex-row items-start justify-between border-b border-[#202126] pb-6 md:border-0 md:pb-0">
            <View className="min-w-0 flex-1 pr-3">
              <Text className="font-mono text-[10px] tracking-[3px] text-bat-gold">BATCOMPUTER  //  SECURE CHANNEL</Text>
              <Text className="mt-2 text-3xl font-bold text-bat-text sm:text-4xl">Boa noite, Bruce.</Text>
              <Text numberOfLines={1} className="mt-2 font-mono text-[10px] tracking-[1px] text-bat-green sm:text-sm sm:tracking-[2px]">● ORACLE  //  RELATÓRIO DIÁRIO  ·  CONEXÃO SEGURA</Text>
            </View>
          </View>

          <View className="mb-5 rounded-xl border-2 border-bat-border bg-bat-panel p-5 sm:p-6">
            <Text className="text-sm leading-6 text-[#b2b3b8] sm:text-base">”Revisei as operações de hoje. Você está em <Text className="text-bat-gold">{progress}%</Text> de conclusão. {activeTasks.length} operações exigem atenção imediata.”</Text>
          </View>

          <View className="mb-6 rounded-2xl border-2 border-bat-border bg-bat-panel p-5 sm:p-6">
            <Text className="font-mono text-[10px] tracking-[3px] text-bat-muted">STATUS DA OPERAÇÃO</Text>
            <View className="mt-5 flex-row items-end justify-between gap-4">
              <Metric label="ATIVAS" value={String(activeTasks.length).padStart(2, '0')} />
              <Metric label="CONCLUÍDAS" value={String(completedTasks.length).padStart(2, '0')} />
              <Metric label="PROGRESSO" value={`${progress}%`} highlight />
              <Metric label="TOTAL" value={String(tasks.length).padStart(2, '0')} />
            </View>
          </View>

          <Text className="mb-4 font-mono text-xs tracking-[3px] text-bat-muted sm:text-sm">TODAS AS OPERAÇÕES</Text>
          <View className="gap-4 md:flex-row md:flex-wrap">
            {tasks.map((task) => <OperationCard key={task.id} {...task} onPress={() => router.push({ pathname: '/new-operation', params: { taskId: task.id } })} />)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return <View className="flex-1"><Text className="font-mono text-[9px] tracking-[1px] text-bat-muted">{label}</Text><Text className={`mt-2 text-2xl font-bold sm:text-3xl ${highlight ? 'text-bat-gold' : 'text-bat-text'}`}>{value}</Text></View>;
}
