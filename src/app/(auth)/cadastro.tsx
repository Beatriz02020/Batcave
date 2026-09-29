import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthField } from '@/components/auth/auth-field';
import { AuthLayout } from '@/components/auth/auth-layout';
import { AuthSubmitButton } from '@/components/auth/auth-submit-button';
import { ERROR_MESSAGES } from '@/constants/app-constants';
import { useAuth } from '@/context/auth-context';
import { getErrorMessage } from '@/utils/validation';

/**
 * Header do cadastro
 */
function SignupHeader() {
  return (
    <View className="mb-8 md:mb-9">
      <Text className="font-mono text-xs tracking-[3px] text-bat-muted md:text-sm md:tracking-[5px]">
        WAYNE ENTERPRISES
      </Text>
      <Text className="mt-5 text-3xl font-bold text-bat-text md:mt-6 md:text-4xl">
        Solicitar Autorização
      </Text>
      <Text className="mt-2 text-base leading-6 text-bat-muted md:mt-3 md:text-lg md:leading-7">
        Crie uma conta pessoal para acessar o Sistema de Operações.
      </Text>
    </View>
  );
}

/**
 * Tela de cadastro
 */
export default function CadastroScreen() {
  const { createUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Valida e cria novo usuário
   */
  async function submit() {
    setMessage('');

    // Validação básica
    if (!username.trim() || !password.trim() || !email.trim() || !cep.trim()) {
      setMessage(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setLoading(true);
    try {
      await createUser({
        username: username.trim(),
        password,
        email: email.trim(),
        cep: cep.trim(),
      });
      setMessage('Conta criada. Acesse o sistema pelo botão abaixo.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout creating header={<SignupHeader />}>
      <View className="gap-5 md:gap-6">
        <AuthField
          label="USUÁRIO"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <AuthField
          label="E-MAIL"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AuthField
          label="SENHA"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <AuthField
          label="CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />
        {!!message && (
          <Text className="text-center text-[15px] leading-6 text-green-300">{message}</Text>
        )}
        <AuthSubmitButton creating loading={loading} onPress={submit} />
      </View>
    </AuthLayout>
  );
}
