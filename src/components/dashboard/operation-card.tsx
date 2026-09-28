import { getTaskProgress, type TaskPriority, type TaskStatus } from '@/context/task-context';
import { Pressable, Text, View } from 'react-native';

type OperationCardProps = {
  title: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  urgent?: boolean;
  onPress?: () => void;
};

export function OperationCard({ title, priority, dueDate, dueTime, status, urgent, onPress }: OperationCardProps) {
  const progress = getTaskProgress(status);

  return (
    <Pressable onPress={onPress} className="flex-1 rounded-xl border-2 border-bat-border bg-bat-panel p-4 active:opacity-80 sm:p-5">
      <View className="flex-row items-center justify-between gap-3">
        <Text className={`rounded border px-2 py-1 font-mono text-[10px] tracking-[1px] ${urgent ? 'border-red-400 text-red-400' : 'border-bat-gold text-bat-gold'}`}>
          {priority}
        </Text>
        <Text className="text-right text-xs text-bat-muted">{dueDate} · {dueTime}</Text>
      </View>
      <Text className="mt-3 text-base font-bold text-bat-text sm:text-lg">{title}</Text>
      <Text className="mt-2 font-mono text-[10px] tracking-[1px] text-bat-green">{status}</Text>
      <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#25272c]">
        <View className="h-full bg-bat-gold" style={{ width: `${progress}%` }} />
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-xs text-bat-muted">{progress}%</Text>
        <Text className="font-mono text-[10px] tracking-[1px] text-bat-gold">EDITAR OPERAÇÃO →</Text>
      </View>
    </Pressable>
  );
}
