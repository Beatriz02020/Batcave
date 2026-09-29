import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { STORAGE_KEYS } from '@/constants/app-constants';
import { login as loginApi, register } from '@/integration/auth-cookie-integration';
import { getErrorMessage } from '@/utils/validation';

/**
 * Credenciais de usuário para login
 */
type Credentials = {
  username: string;
  password: string;
};

/**
 * Dados de novo usuário para registro
 */
type NewUser = Credentials & {
  email: string;
  cep: string;
};

/**
 * Contexto de autenticação
 */
type AuthContextValue = {
  cookie: string | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  createUser: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Obtém a sessão armazenada (web ou nativa)
 */
async function getStoredSession(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return globalThis.localStorage?.getItem(STORAGE_KEYS.AUTH_COOKIE) ?? null;
    }
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_COOKIE);
  } catch (error) {
    console.warn('Erro ao recuperar sessão:', getErrorMessage(error));
    return null;
  }
}

/**
 * Armazena a sessão (web ou nativa)
 */
async function storeSession(value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(STORAGE_KEYS.AUTH_COOKIE, value);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_COOKIE, value);
  } catch (error) {
    console.warn('Erro ao armazenar sessão:', getErrorMessage(error));
  }
}

/**
 * Remove a sessão armazenada
 */
async function removeStoredSession(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(STORAGE_KEYS.AUTH_COOKIE);
      return;
    }
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_COOKIE);
  } catch (error) {
    console.warn('Erro ao remover sessão:', getErrorMessage(error));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cookie, setCookie] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carrega a sessão do storage na inicialização
   */
  useEffect(() => {
    getStoredSession()
      .then(setCookie)
      .catch(() => {
        console.warn('Falha ao recuperar sessão armazenada');
        setCookie(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Faz login com credenciais
   */
  async function login(credentials: Credentials) {
    try {
      const { cookie: nextCookie } = await loginApi(credentials, cookie);
      const sessionCookie = nextCookie ?? 'managed-session';
      await storeSession(sessionCookie);
      setCookie(sessionCookie);
    } catch (error) {
      setCookie(null);
      throw error;
    }
  }

  /**
   * Cria um novo usuário
   */
  async function createUser(user: NewUser) {
    return register(user);
  }

  /**
   * Faz logout e limpa a sessão
   */
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

/**
 * Hook para usar autenticação
 * @throws Erro se usado fora de AuthProvider
 */
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return value;
}
