import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type TaskPriority = 'ALTA PRIORIDADE' | 'PRIORIDADE MÉDIA' | 'BAIXA PRIORIDADE';
export type TaskStatus = 'NÃO INICIADA' | 'EM PROGRESSO' | 'CONCLUÍDA';

export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  status: TaskStatus;
  urgent?: boolean;
};

export type TaskInput = Omit<Task, 'id'>;

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
const removedSeedTaskIds = new Set(['engineering-project', 'data-structures', 'oracle-report']);

const statusProgress: Record<TaskStatus, number> = {
  'NÃO INICIADA': 0,
  'EM PROGRESSO': 50,
  'CONCLUÍDA': 100,
};

const TaskContext = createContext<TaskContextValue | null>(null);
const TASKS_STORAGE_KEY = 'batcave.tasks';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(TASKS_STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const savedTasks = JSON.parse(stored) as Task[];
          setTasks(savedTasks.filter((task) => !removedSeedTaskIds.has(task.id)));
        }
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [hydrated, tasks]);

  function addTask(task: TaskInput) {
    setTasks((current) => [...current, { ...task, id: `${Date.now()}-${task.title}` }]);
  }

  function updateTask(id: string, task: TaskInput) {
    setTasks((current) => current.map((item) => (item.id === id ? { ...task, id } : item)));
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const activeTasks = tasks.filter((task) => task.status !== 'CONCLUÍDA');
  const completedTasks = tasks.filter((task) => task.status === 'CONCLUÍDA');
  const progress = tasks.length === 0 ? 0 : Math.round(tasks.reduce((total, task) => total + statusProgress[task.status], 0) / tasks.length);

  return <TaskContext.Provider value={{ tasks, activeTasks, completedTasks, progress, addTask, updateTask, deleteTask }}>{children}</TaskContext.Provider>;
}

export function getTaskProgress(status: TaskStatus) {
  return statusProgress[status];
}

export function useTasks() {
  const value = useContext(TaskContext);
  if (!value) throw new Error('useTasks deve ser usado dentro de TaskProvider.');
  return value;
}
