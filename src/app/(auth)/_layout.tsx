import { Stack } from 'expo-router';

/**
 * Layout para rotas de autenticação
 * Sem header, com transição simples
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
    </Stack>
  );
}
