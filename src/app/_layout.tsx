import '@/global.css';
import { Redirect, Slot, usePathname } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { NotesProvider } from '@/context/notes-context';
import { TaskProvider } from '@/context/task-context';

export default function TabLayout() {
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

function SessionGate() {
  const pathname = usePathname();
  const { cookie, isLoading } = useAuth();
  const isAuthRoute = pathname === '/login' || pathname === '/cadastro';

  if (isLoading) return null;
  if (!cookie && !isAuthRoute) return <Redirect href="/login" />;
  if (cookie && isAuthRoute) return <Redirect href="/" />;

  return isAuthRoute ? <Slot /> : <AppTabs />;
}
