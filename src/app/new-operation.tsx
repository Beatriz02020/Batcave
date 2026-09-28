import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks, type TaskPriority, type TaskStatus } from '@/context/task-context';

const priorities: TaskPriority[] = ['ALTA PRIORIDADE', 'PRIORIDADE MÉDIA', 'BAIXA PRIORIDADE'];
const statuses: TaskStatus[] = ['NÃO INICIADA', 'EM PROGRESSO', 'CONCLUÍDA'];
const inputClass = 'min-h-[58px] rounded-xl border-2 border-bat-border bg-bat-panel px-4 text-base text-bat-text md:min-h-[66px] md:px-5 md:text-lg';

export default function NewOperationScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { tasks, addTask, updateTask } = useTasks();
  const editingTask = tasks.find((task) => task.id === taskId);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('PRIORIDADE MÉDIA');
  const [status, setStatus] = useState<TaskStatus>('NÃO INICIADA');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!editingTask) return;
    setTitle(editingTask.title);
    setDueDate(editingTask.dueDate);
    setDueTime(editingTask.dueTime);
    setPriority(editingTask.priority);
    setStatus(editingTask.status);
  }, [editingTask]);

  function submit() {
    const normalizedTitle = title.trim();
    if (!normalizedTitle || !dueDate.trim() || !dueTime.trim()) {
      setMessage('Preencha nome, data e hora da operação.');
      return;
    }

    const data = {
      title: normalizedTitle,
      priority,
      dueDate: dueDate.trim(),
      dueTime: dueTime.trim(),
      status,
      urgent: priority === 'ALTA PRIORIDADE',
    };

    if (editingTask) updateTask(editingTask.id, data);
    else addTask(data);
    router.replace('/');
  }

  return (
    <SafeAreaView className="flex-1 bg-bat-bg">
      <ScrollView contentContainerClassName="flex-grow px-5 pb-24 pt-20 md:pl-[242px] md:pt-12">
        <View className="mx-auto w-full max-w-[720px]">
          <Text className="font-mono text-xs tracking-[3px] text-bat-green">BATCOMPUTER  //  {editingTask ? 'EDITAR OPERAÇÃO' : 'NOVA OPERAÇÃO'}</Text>
          <Text className="mt-4 text-3xl font-bold text-bat-text">{editingTask ? 'Editar operação' : 'Criar operação'}</Text>
          <Text className="mt-2 text-base text-bat-muted">{editingTask ? 'Atualize os dados desta missão.' : 'Registre uma nova missão para acompanhar no painel.'}</Text>

          <View className="mt-8 gap-6 rounded-2xl border-2 border-bat-border bg-bat-panel p-5 md:p-7">
            <Field label="NOME DA OPERAÇÃO" value={title} onChangeText={setTitle} placeholder="Ex.: Revisar relatório de segurança" />
            <View className="gap-4 md:flex-row">
              <Field label="DATA DO PRAZO" value={dueDate} onChangeText={setDueDate} placeholder="AAAA-MM-DD" keyboardType="numbers-and-punctuation" containerClass="flex-1" />
              <Field label="HORA DO PRAZO" value={dueTime} onChangeText={setDueTime} placeholder="HH:MM" keyboardType="numbers-and-punctuation" containerClass="flex-1" />
            </View>

            <ChoiceGroup label="PRIORIDADE">
              {priorities.map((item) => <Choice key={item} label={item} selected={priority === item} onPress={() => setPriority(item)} />)}
            </ChoiceGroup>
            <ChoiceGroup label="STATUS DA OPERAÇÃO">
              {statuses.map((item) => <Choice key={item} label={item} selected={status === item} onPress={() => setStatus(item)} checkbox />)}
            </ChoiceGroup>

            {!!message && <Text className="text-center text-sm text-red-300">{message}</Text>}
            <View className="gap-3 md:flex-row md:justify-end">
              <Pressable onPress={() => router.replace('/')} className="items-center rounded-lg border border-bat-border px-5 py-4">
                <Text className="font-mono text-xs tracking-[2px] text-bat-muted">CANCELAR</Text>
              </Pressable>
              <Pressable onPress={submit} className="items-center rounded-lg bg-bat-gold px-6 py-4">
                <Text className="font-mono text-xs font-bold tracking-[2px] text-bat-ink">{editingTask ? 'SALVAR ALTERAÇÕES' : 'REGISTRAR OPERAÇÃO'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChoiceGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <View className="gap-3"><Text className="font-mono text-xs tracking-[2px] text-bat-muted md:text-sm">{label}</Text><View className="gap-2 md:flex-row md:flex-wrap">{children}</View></View>;
}

function Choice({ label, selected, onPress, checkbox }: { label: string; selected: boolean; onPress: () => void; checkbox?: boolean }) {
  return (
    <Pressable accessibilityRole={checkbox ? 'checkbox' : 'button'} accessibilityState={{ checked: selected }} onPress={onPress} className={`flex-1 rounded-lg border px-3 py-3 ${selected ? 'border-bat-gold bg-[#211d12]' : 'border-bat-border'}`}>
      <Text className={`text-center font-mono text-[10px] tracking-[1px] ${selected ? 'text-bat-gold' : 'text-bat-muted'}`}>{checkbox ? selected ? '☑ ' : '☐ ' : ''}{label}</Text>
    </Pressable>
  );
}

function Field({ label, containerClass = '', ...props }: { label: string; containerClass?: string } & ComponentProps<typeof TextInput>) {
  return <View className={`gap-2 ${containerClass}`}><Text className="font-mono text-xs tracking-[2px] text-bat-muted md:text-sm">{label}</Text><TextInput {...props} placeholderTextColor="#777981" className={inputClass} /></View>;
}
