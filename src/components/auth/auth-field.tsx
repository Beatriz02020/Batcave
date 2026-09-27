import type { ComponentProps } from 'react';
import { Text, TextInput, View } from 'react-native';

type AuthFieldProps = Pick<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'> & {
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: ComponentProps<typeof TextInput>['autoCapitalize'];
};

const inputClass =
  'min-h-[60px] rounded-xl border-2 border-bat-border bg-bat-panel px-4 text-base text-bat-text md:min-h-[68px] md:px-6 md:text-lg';

export function AuthField({ label, ...props }: AuthFieldProps) {
  return (
    <View className="gap-2 md:gap-3">
      <Text className="font-mono text-xs tracking-[2px] text-bat-muted md:text-sm md:tracking-[3px]">{label}</Text>
      <TextInput {...props} placeholderTextColor="#777981" className={inputClass} />
    </View>
  );
}
