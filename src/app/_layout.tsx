import { DarkTheme, DefaultTheme, Redirect, Slot, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <SessionGate />
      </ThemeProvider>
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
