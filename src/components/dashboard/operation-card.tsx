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
  onDelete?: () => void;
};

export function OperationCard({ title, priority, dueDate, dueTime, status, urgent, onPress, onDelete }: OperationCardProps) {
  const progress = getTaskProgress(status);

  return (
    <View className="w-full rounded-xl border-2 border-bat-border bg-bat-panel p-4 sm:p-5 md:w-[48%] md:flex-none">
      <Pressable accessibilityRole="button" onPress={onPress} className="active:opacity-80">
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
      </Pressable>
      <View className="mt-3 flex-row items-center justify-between gap-3">
        <Text className="text-xs text-bat-muted">{progress}%</Text>
        <View className="flex-row items-center gap-2">
          <Pressable accessibilityRole="button" onPress={onPress} className="rounded-lg border border-bat-gold px-2 py-2">
            <Text className="font-mono text-[10px] tracking-[1px] text-bat-gold">EDITAR</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Excluir operação ${title}`} onPress={onDelete} className="rounded-lg border border-red-400 px-2 py-2">
            <Text className="font-mono text-[10px] tracking-[1px] text-red-300">EXCLUIR</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
