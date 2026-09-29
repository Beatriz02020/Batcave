import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { STORAGE_KEYS } from '@/constants/app-constants';
import { generateId } from '@/utils/validation';

/**
 * Nota com áudio e texto
 */
type Note = {
  id: string;
  title: string;
  text?: string;
  audioUri?: string;
  createdAt: string;
};

/**
 * Contexto de notas
 */
type NotesContextValue = {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /**
   * Carrega notas do AsyncStorage na inicialização
   */
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.NOTES)
      .then((stored) => {
        if (stored) {
          setNotes(JSON.parse(stored) as Note[]);
        }
      })
      .catch(() => {
        console.warn('Erro ao carregar notas do AsyncStorage');
      })
      .finally(() => setHydrated(true));
  }, []);

  /**
   * Persiste notas sempre que mudam (após hidratação)
   */
  useEffect(() => {
    if (hydrated) {
      void AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
  }, [hydrated, notes]);

  /**
   * Adiciona uma nova nota com ID gerado
   */
  function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
    setNotes((current) => [
      {
        ...note,
        id: generateId('note'),
        createdAt: new Date().toLocaleString('pt-BR'),
      },
      ...current,
    ]);
  }

  /**
   * Deleta uma nota por ID
   */
  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  return <NotesContext.Provider value={{ notes, addNote, deleteNote }}>{children}</NotesContext.Provider>;
}

/**
 * Hook para usar o contexto de notas
 * @throws Erro se usado fora de NotesProvider
 */
export function useNotes() {
  const value = useContext(NotesContext);
  if (!value) {
    throw new Error('useNotes deve ser usado dentro de NotesProvider.');
  }
  return value;
}
