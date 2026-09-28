import { Platform } from 'react-native';

const API_URL = 'https://login-p26w.onrender.com/fatec/login/v1';

type ApiError = {
  message?: string;
  error?: string;
};

export type ApiResponse = {
  response: Response;
  cookie: string | null;
};

function getCookie(response: Response) {
  const setCookie = response.headers.get('set-cookie');
  return setCookie?.match(/^([^=;]+=[^;]+)/)?.[1] ?? null;
}

async function getErrorMessage(response: Response) {
  const body = await response.text();
  if (!body) return `Não foi possível concluir a operação (${response.status}).`;

  try {
    const parsed = JSON.parse(body) as ApiError;
    return parsed.message ?? parsed.error ?? body;
  } catch {
    return body;
  }
}

export async function postCookie(path: string, payload?: object, cookie?: string | null): Promise<ApiResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (Platform.OS !== 'web' && cookie) headers.Cookie = cookie;

  const response = await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
  return { response, cookie: getCookie(response) };
}
