import { API_CONFIG } from '@/constants/app-constants';
import { postCookie } from './http-client-cookie';

/**
 * Payload para registro de novo usuário
 */
export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  cep: string;
};

/**
 * Payload para login
 */
export type AuthRequest = {
  username: string;
  password: string;
};

/**
 * Registra um novo usuário
 */
export function register(data: RegisterRequest) {
  return postCookie(API_CONFIG.ENDPOINTS.CREATE_USER, data);
}

/**
 * Faz login do usuário
 */
export function login(data: AuthRequest, cookie?: string | null) {
  return postCookie(API_CONFIG.ENDPOINTS.AUTH, data, cookie);
}
