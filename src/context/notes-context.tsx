import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Note = {
  id: string;
  title: string;
  text?: string;
  audioUri?: string;
  createdAt: string;
};

type NotesContextValue = {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);
const NOTES_STORAGE_KEY = 'batcave.notes';

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTES_STORAGE_KEY)
      .then((stored) => {
        if (stored) setNotes(JSON.parse(stored) as Note[]);
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [hydrated, notes]);

  function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
    setNotes((current) => [
      {
        ...note,
        id: `${Date.now()}-${note.title}`,
        createdAt: new Date().toLocaleString('pt-BR'),
      },
      ...current,
    ]);
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  return <NotesContext.Provider value={{ notes, addNote, deleteNote }}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const value = useContext(NotesContext);
  if (!value) throw new Error('useNotes deve ser usado dentro de NotesProvider.');
  return value;
}
