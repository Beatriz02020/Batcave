import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { login as loginApi, register } from '@/integration/auth-cookie-integration';

const COOKIE_KEY = 'batcave.auth-cookie';

type Credentials = {
  username: string;
  password: string;
};

type NewUser = Credentials & {
  email: string;
  cep: string;
};

type AuthContextValue = {
  cookie: string | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  createUser: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function getStoredSession() {
  if (Platform.OS === 'web') return globalThis.localStorage.getItem(COOKIE_KEY);
  return SecureStore.getItemAsync(COOKIE_KEY);
}

async function storeSession(value: string) {
  if (Platform.OS === 'web') {
    globalThis.localStorage.setItem(COOKIE_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(COOKIE_KEY, value);
}

async function removeStoredSession() {
  if (Platform.OS === 'web') {
    globalThis.localStorage.removeItem(COOKIE_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(COOKIE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookie, setCookie] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStoredSession()
      .then(setCookie)
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials: Credentials) {
    const { cookie: nextCookie } = await loginApi(credentials, cookie);

    await storeSession(nextCookie ?? 'managed-session');
    setCookie(nextCookie ?? 'managed-session');
  }

  async function createUser(user: NewUser) {
    await register(user);
  }

  async function logout() {
    await removeStoredSession();
    setCookie(null);
  }

  return (
    <AuthContext.Provider value={{ cookie, isLoading, login, createUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return value;
}
