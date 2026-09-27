import { Text, View } from 'react-native';

type StatCardProps = {
  label: string;
  value: string;
  highlight?: boolean;
  hideOnMobile?: boolean;
};

export function StatCard({ label, value, highlight, hideOnMobile }: StatCardProps) {
  return (
    <View className={`min-w-[31%] flex-1 rounded-xl border-2 border-bat-border bg-bat-panel p-4 sm:p-5 ${hideOnMobile ? 'hidden md:flex' : ''}`}>
      <Text className="font-mono text-[10px] uppercase tracking-[2px] text-bat-muted sm:text-xs">{label}</Text>
      <Text className={`mt-4 text-3xl font-bold sm:text-4xl ${highlight ? 'text-bat-gold' : 'text-bat-text'}`}>{value}</Text>
    </View>
  );
}
