import { postCookie } from './http-client-cookie';

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  cep: string;
};

export type AuthRequest = {
  username: string;
  password: string;
};

export function register(data: RegisterRequest) {
  return postCookie('create', data);
}

export function login(data: AuthRequest, cookie?: string | null) {
  return postCookie('auth', data, cookie);
}
