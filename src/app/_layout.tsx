import '@/global.css';
import { Redirect, Stack, useSegments } from 'expo-router';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { NotesProvider } from '@/context/notes-context';
import { TaskProvider } from '@/context/task-context';

/**
 * Layout raiz com providers e proteção de rotas
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NotesProvider>
          <SessionGate />
        </NotesProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

/**
 * Componente que gerencia redirecionamentos baseado em autenticação
 * Usa route groups: (auth) para login/cadastro, (app) para aplicação
 */
function SessionGate() {
  const segments = useSegments();
  const { cookie, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Verifica se o usuário está tentando acessar rota autenticada sem estar logado
  const isInAuthGroup = segments[0] === '(auth)';
  const isInAppGroup = segments[0] === '(app)';

  if (!cookie && !isInAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (cookie && isInAuthGroup) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ title: 'Auth' }} />
      <Stack.Screen name="(app)" options={{ title: 'App' }} />
    </Stack>
  );
}
}
