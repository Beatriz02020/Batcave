/**
 * Constantes da aplicação
 * Centralize strings magic aqui para evitar duplicação e facilitar manutenção
 */

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_COOKIE: 'batcave.auth-cookie',
  TASKS: 'batcave.tasks',
  NOTES: 'batcave.notes',
} as const;

// Task Status
export const TASK_STATUS = {
  NOT_STARTED: 'NÃO INICIADA',
  IN_PROGRESS: 'EM PROGRESSO',
  COMPLETED: 'CONCLUÍDA',
} as const;

// Task Priority
export const TASK_PRIORITY = {
  HIGH: 'ALTA PRIORIDADE',
  MEDIUM: 'PRIORIDADE MÉDIA',
  LOW: 'BAIXA PRIORIDADE',
} as const;

// Status Progress Mapping
export const STATUS_PROGRESS_MAP = {
  [TASK_STATUS.NOT_STARTED]: 0,
  [TASK_STATUS.IN_PROGRESS]: 50,
  [TASK_STATUS.COMPLETED]: 100,
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://login-p26w.onrender.com/fatec/login/v1',
  ENDPOINTS: {
    AUTH: 'auth',
    CREATE_USER: 'create',
  },
  TIMEOUT: 10000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Autenticação necessária. Faça login novamente.',
  INVALID_CREDENTIALS: 'Credenciais inválidas.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  OPERATION_FAILED: 'Não foi possível concluir a operação.',
  REQUIRED_FIELDS: 'Preencha todos os campos obrigatórios.',
  MICROPHONE_DENIED: 'Permissão de microfone negada. Ative-a nas configurações do dispositivo.',
  RECORDING_FAILED: 'Erro ao salvar a gravação.',
} as const;

// Seed Task IDs (tarefas de exemplo removidas após primeira execução)
export const REMOVED_SEED_TASK_IDS = new Set([
  'engineering-project',
  'data-structures',
  'oracle-report',
]);
