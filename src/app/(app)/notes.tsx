import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioPlayerStatus,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ERROR_MESSAGES } from '@/constants/app-constants';
import { useNotes } from '@/context/notes-context';
import { getErrorMessage } from '@/utils/validation';

type NoteItemProps = {
  title: string;
  text?: string;
  audioUri?: string;
  createdAt: string;
  isDeleteMode: boolean;
  onPlay: () => void;
  onDelete: () => void;
};

const inputClass =
  'min-h-[58px] rounded-xl border-2 border-bat-border bg-bat-panel px-4 text-base text-bat-text';

/**
 * Tela de anotações com suporte a áudio e texto
 */
export default function NotesScreen() {
  const { notes, addNote, deleteNote } = useNotes();
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: 'document',
  });
  const recorderState = useAudioRecorderState(recorder);
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [activeAudioUri, setActiveAudioUri] = useState<string | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<{
    id: string;
    title: string;
    audioUri?: string;
  } | null>(null);

  /**
   * Configura permissões de áudio na inicialização
   */
  useEffect(() => {
    async function configureAudio() {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setMessage(ERROR_MESSAGES.MICROPHONE_DENIED);
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }
    void configureAudio();
  }, []);

  /**
   * Alterna entre gravação e pausa
   */
  async function toggleRecording() {
    setMessage('');
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
        if (recorder.uri) {
          addNote({
            title: title.trim() || 'Nota de voz',
            audioUri: recorder.uri,
          });
          setTitle('');
          setMessage('Nota de voz salva no Batcomputer.');
        }
        return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      setMessage(getErrorMessage(error) || ERROR_MESSAGES.RECORDING_FAILED);
    }
  }

  /**
   * Salva uma anotação textual
   */
  function saveTextNote() {
    if (!title.trim() || !text.trim()) {
      setMessage('Informe um título e o conteúdo da anotação.');
      return;
    }
    addNote({ title: title.trim(), text: text.trim() });
    setTitle('');
    setText('');
    setMessage('Anotação textual salva no Batcomputer.');
  }

  /**
   * Reproduz ou pausa uma nota de áudio
   */
  function playNote(uri: string) {
    if (activeAudioUri === uri && playerStatus.playing) {
      player.pause();
      return;
    }
    if (activeAudioUri !== uri) {
      player.replace(uri);
      setActiveAudioUri(uri);
    }
    player.play();
  }

  /**
   * Remove uma nota e para reprodução se necessário
   */
  function removeNote(id: string, audioUri?: string) {
    if (audioUri && activeAudioUri === audioUri) {
      player.pause();
      setActiveAudioUri(null);
    }
    deleteNote(id);
    if (notes.length === 1) setIsDeleteMode(false);
  }

  /**
   * Confirma a exclusão de uma nota
   */
  function confirmDeleteNote() {
    if (!noteToDelete) return;
    removeNote(noteToDelete.id, noteToDelete.audioUri);
    setNoteToDelete(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-bat-bg">
      <ScrollView contentContainerClassName="flex-grow px-5 pb-24 pt-20 md:pl-[242px] md:pt-12">
        <View className="mx-auto w-full max-w-[900px]">
          <Text className="font-mono text-xs tracking-[3px] text-bat-green">
            BATCOMPUTER  //  MEMÓRIA ORACLE
          </Text>
          <Text className="mt-4 text-3xl font-bold text-bat-text">
            Anotações
          </Text>
          <Text className="mt-2 text-base text-bat-muted">
            Registre uma ideia por voz ou escreva uma nota rápida.
          </Text>

          <View className="mt-8 gap-5 rounded-2xl border-2 border-bat-border bg-bat-panel p-5 md:p-7">
            <Text className="font-mono text-xs tracking-[2px] text-bat-gold">
              NOVA ANOTAÇÃO
            </Text>
            <Field
              label="TÍTULO"
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Pista encontrada no arquivo Wayne"
            />
            <View className="gap-2">
              <Text className="font-mono text-xs tracking-[2px] text-bat-muted">
                TEXTO
              </Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Escreva uma observação..."
                placeholderTextColor="#777981"
                multiline
                className={`${inputClass} min-h-[130px] py-4`}
                textAlignVertical="top"
              />
            </View>
            <View className="gap-3 md:flex-row">
              <Pressable
                onPress={saveTextNote}
                className="flex-1 items-center rounded-lg border border-bat-border px-5 py-4"
              >
                <Text className="font-mono text-xs tracking-[2px] text-bat-muted">
                  SALVAR TEXTO
                </Text>
              </Pressable>
              <Pressable
                onPress={toggleRecording}
                className={`flex-1 items-center rounded-lg px-5 py-4 ${
                  recorderState.isRecording ? 'bg-red-500' : 'bg-bat-gold'
                }`}
              >
                <Text className="font-mono text-xs font-bold tracking-[2px] text-bat-ink">
                  {recorderState.isRecording
                    ? `PARAR GRAVAÇÃO ${Math.round(
                        recorderState.durationMillis / 1000,
                      )}s`
                    : '● GRAVAR VOZ'}
                </Text>
              </Pressable>
            </View>
            {!!message && (
              <Text className="text-center text-sm text-bat-green">{message}</Text>
            )}
          </View>

          <View className="mt-8 gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 font-mono text-xs tracking-[3px] text-bat-muted">
                ARQUIVO DE MEMÓRIA · {notes.length} NOTAS
              </Text>
              {notes.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isDeleteMode }}
                  onPress={() => setIsDeleteMode((current) => !current)}
                  className={`rounded-lg border px-3 py-2 ${
                    isDeleteMode ? 'border-bat-border' : 'border-red-400'
                  }`}
                >
                  <Text
                    className={`font-mono text-[10px] tracking-[1px] ${
                      isDeleteMode ? 'text-bat-muted' : 'text-red-300'
                    }`}
                  >
                    {isDeleteMode ? 'CANCELAR' : 'APAGAR'}
                  </Text>
                </Pressable>
              )}
            </View>
            {notes.length === 0 ? (
              <Text className="rounded-xl border border-dashed border-bat-border p-6 text-center text-sm text-bat-muted">
                Nenhuma anotação registrada.
              </Text>
            ) : (
              notes.map((note) => (
                <NoteItem
                  key={note.id}
                  {...note}
                  isDeleteMode={isDeleteMode}
                  isPlaying={
                    note.audioUri === activeAudioUri && playerStatus.playing
                  }
                  onPlay={() =>
                    note.audioUri && playNote(note.audioUri)
                  }
                  onDelete={() =>
                    setNoteToDelete({
                      id: note.id,
                      title: note.title,
                      audioUri: note.audioUri,
                    })
                  }
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={noteToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteToDelete(null)}
      >
        <View className="flex-1 items-center justify-center bg-black/70 px-5">
          <View className="w-full max-w-[420px] gap-4 rounded-xl border-2 border-bat-border bg-bat-panel p-6">
            <Text className="font-mono text-xs tracking-[2px] text-red-300">
              CONFIRMAR EXCLUSÃO
            </Text>
            <Text className="text-lg font-bold text-bat-text">
              Excluir esta anotação?
            </Text>
            <Text className="text-sm leading-6 text-bat-muted">
              "{noteToDelete?.title}" será removida permanentemente.
            </Text>
            <View className="mt-2 flex-row justify-end gap-3">
              <Pressable
                accessibilityRole="button"
                onPress={() => setNoteToDelete(null)}
                className="rounded-lg border border-bat-border px-4 py-3"
              >
                <Text className="font-mono text-xs tracking-[1px] text-bat-muted">
                  CANCELAR
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={confirmDeleteNote}
                className="rounded-lg bg-red-500 px-4 py-3"
              >
                <Text className="font-mono text-xs font-bold tracking-[1px] text-white">
                  EXCLUIR
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/**
 * Campo de texto genérico para anotações
 */
function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View className="gap-2">
      <Text className="font-mono text-xs tracking-[2px] text-bat-muted">
        {label}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor="#777981"
        className={inputClass}
      />
    </View>
  );
}

/**
 * Item individual de nota
 */
function NoteItem({
  title,
  text,
  audioUri,
  createdAt,
  isDeleteMode,
  isPlaying,
  onPlay,
  onDelete,
}: NoteItemProps & { isPlaying: boolean }) {
  return (
    <View className="rounded-xl border-2 border-bat-border bg-bat-panel p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-base font-bold text-bat-text">
          {title}
        </Text>
        <Text className="font-mono text-[10px] text-bat-muted">
          {createdAt}
        </Text>
      </View>
      {text && (
        <Text className="mt-3 text-sm leading-6 text-[#b2b3b8]">{text}</Text>
      )}
      <View className="mt-3 flex-row items-center justify-between gap-3">
        {audioUri ? (
          <Pressable
            onPress={onPlay}
            className="self-start rounded-lg border border-bat-gold px-3 py-2"
          >
            <Text className="font-mono text-xs text-bat-gold">
              {isPlaying ? '⏸ PAUSAR ÁUDIO' : '▶ REPRODUZIR ÁUDIO'}
            </Text>
          </Pressable>
        ) : (
          <View />
        )}
        {isDeleteMode && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Apagar nota ${title}`}
            onPress={onDelete}
            className="self-start rounded-lg border border-red-400 px-3 py-2"
          >
            <Text className="font-mono text-xs text-red-300">EXCLUIR NOTA</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
