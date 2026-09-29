/**
 * Utilitários para geração de IDs e validação
 * Evita lógica espalhada e garante consistência
 */

/**
 * Gera um ID único usando timestamp + random
 * Mais robusto que apenas Date.now()
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Normaliza strings de entrada (trim + validação básica)
 */
export function normalizeString(value: string, minLength = 1): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length >= minLength ? trimmed : null;
}

/**
 * Valida se a data não é no passado
 */
export function isDateValid(dateString: string): boolean {
  try {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date > new Date();
  } catch {
    return false;
  }
}

/**
 * Valida tempo no formato HH:MM
 */
export function isTimeValid(timeString: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

/**
 * Type guard para Error objects
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Extrai mensagem de erro de forma segura
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as any).message);
  }
  return 'Erro desconhecido';
}
