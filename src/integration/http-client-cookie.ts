import { Platform } from 'react-native';

import { API_CONFIG, ERROR_MESSAGES } from '@/constants/app-constants';
import { getErrorMessage } from '@/utils/validation';

/**
 * Resposta da API com cookie extraído
 */
export type ApiResponse = {
  response: Response;
  cookie: string | null;
};

/**
 * Extrai o cookie da resposta HTTP
 */
function getCookie(response: Response): string | null {
  const setCookie = response.headers.get('set-cookie');
  return setCookie?.match(/^([^=;]+=[^;]+)/)?.[1] ?? null;
}

/**
 * Extrai mensagem de erro da resposta
 */
async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.text();
    if (!body) return `${ERROR_MESSAGES.OPERATION_FAILED} (${response.status}).`;

    try {
      const parsed = JSON.parse(body) as { message?: string; error?: string };
      return parsed.message ?? parsed.error ?? body;
    } catch {
      return body;
    }
  } catch {
    return ERROR_MESSAGES.OPERATION_FAILED;
  }
}

/**
 * Faz requisição POST com cookie (cross-platform)
 * @param path - Endpoint da API
 * @param payload - Dados a enviar
 * @param cookie - Cookie da sessão anterior
 */
export async function postCookie(
  path: string,
  payload?: object,
  cookie?: string | null,
): Promise<ApiResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Em nativo, adiciona o cookie manualmente (fetch não suporta automaticamente)
  if (Platform.OS !== 'web' && cookie) {
    headers.Cookie = cookie;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${path}`, {
      method: 'POST',
      headers,
      credentials: 'include', // Web envia cookies automaticamente
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const errorMsg = await getErrorMessage(response);
      throw new Error(errorMsg);
    }

    return {
      response,
      cookie: getCookie(response),
    };
  } catch (error) {
    // Detecta erro de rede vs erro da API
    if (error instanceof TypeError && error.message.includes('Network')) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
}
