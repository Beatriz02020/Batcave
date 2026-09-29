import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { TASK_PRIORITY, TASK_STATUS } from '@/constants/app-constants';

export type TaskPriority = typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];
export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

/**
 * Task representa uma operação/tarefa no sistema
 */
export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  urgent?: boolean;
  createdAt?: string;
};

/**
 * TaskInput para criar/atualizar tarefas (sem id gerado)
 */
export type TaskInput = Omit<Task, 'id' | 'createdAt'>;

type TaskContextValue = {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  progress: number;
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, task: TaskInput) => void;
  deleteTask: (id: string) => void;
};

const initialTasks: Task[] = [];

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [hydrated, setHydrated] = useState(false);

  // Carrega tarefas do AsyncStorage na inicialização
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.TASKS)
      .then((stored) => {
        if (stored) {
          const savedTasks = JSON.parse(stored) as Task[];
          // Remove tarefas de seed criadas para demo
          setTasks(savedTasks.filter((task) => !REMOVED_SEED_TASK_IDS.has(task.id)));
        }
      })
      .catch(() => {
        // Log silencioso de erro de storage
        console.warn('Erro ao carregar tarefas do AsyncStorage');
      })
      .finally(() => setHydrated(true));
  }, []);

  // Persiste tarefas sempre que mudam (após hidratação)
  useEffect(() => {
    if (hydrated) {
      void AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
  }, [hydrated, tasks]);

  /**
   * Adiciona uma nova tarefa com ID gerado
   */
  function addTask(task: TaskInput) {
    setTasks((current) => [
      ...current,
      {
        ...task,
        id: generateId('task'),
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  /**
   * Atualiza uma tarefa existente
   */
  function updateTask(id: string, task: TaskInput) {
    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...task, id, createdAt: item.createdAt } : item,
      ),
    );
  }

  /**
   * Deleta uma tarefa por ID
   */
  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  // Calcula tarefas ativas e concluídas
  const activeTasks = tasks.filter((task) => task.status !== TASK_STATUS.COMPLETED);
  const completedTasks = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED);

  // Calcula progresso geral (média ponderada por status)
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          tasks.reduce((total, task) => total + STATUS_PROGRESS_MAP[task.status], 0) /
            tasks.length,
        );

  return (
    <TaskContext.Provider
      value={{ tasks, activeTasks, completedTasks, progress, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Retorna o valor de progresso para um determinado status
 * @param status - Status da tarefa
 * @returns Valor de progresso de 0 a 100
 */
export function getTaskProgress(status: TaskStatus): number {
  return STATUS_PROGRESS_MAP[status];
}

/**
 * Hook para usar o contexto de tarefas
 * @throws Erro se usado fora de TaskProvider
 */
export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) {
    throw new Error('useTasks deve ser usado dentro de TaskProvider.');
  }
  return value;
}
