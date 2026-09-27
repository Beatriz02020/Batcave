import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import { useAuth } from '@/context/auth-context';

function LoginHeader() {
  return (
    <View className="mb-9 items-center md:mb-10">
      <View className="mb-7 h-20 w-20 items-center justify-center rounded-full border-2 border-bat-gold md:mb-8 md:h-24 md:w-24">
        <Text className="h-[52px] w-[52px] rounded-full border-2 border-[#34363d] text-center font-bold text-xl leading-[48px] text-bat-gold md:h-[62px] md:w-[62px] md:text-[22px] md:leading-[58px]">W</Text>
      </View>
      <Text className="font-mono text-xs tracking-[3px] text-bat-muted md:text-sm md:tracking-[5px]">WAYNE ENTERPRISES</Text>
      <Text className="mt-3 font-mono text-[9px] tracking-[2px] text-[#505159] md:mt-3 md:text-[11px] md:tracking-[3px]">SISTEMA PESSOAL DE OPERAÇÕES</Text>
    </View>
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage('');
    setLoading(true);
    try {
      await login({ username, password });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir a operação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout creating={false} header={<LoginHeader />}>
      <View className="mb-8 rounded-[18px] border-2 border-bat-border bg-bat-panel p-5 md:mb-8 md:p-7">
        <Text className="font-mono text-sm text-[#888a92] md:text-base">&quot;Identifique-se para acessar o sistema.&quot;</Text>
      </View>
      <View className="gap-5 md:gap-6">
        <AuthField label="USUÁRIO" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <AuthField label="SENHA" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
        {!!message && <Text className="text-center text-[15px] leading-6 text-red-300">{message}</Text>}
        <AuthSubmitButton creating={false} loading={loading} onPress={submit} />
        <Pressable>
          <Text className="mt-1 text-center text-sm text-[#55575f] md:text-base">Esqueceu suas credenciais de acesso?</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}
