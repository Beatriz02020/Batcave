import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AuthStatus } from './auth-status';

type AuthLayoutProps = {
  creating: boolean;
  header: ReactNode;
  children: ReactNode;
};

export function AuthLayout({ creating, header, children }: AuthLayoutProps) {
  function toggleMode() {
    router.replace(creating ? '/login' : '/cadastro');
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-bat-bg" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName={`mx-auto w-full max-w-2xl flex-grow px-4 pb-7 md:px-10 md:pb-10 ${creating ? 'pt-12 md:pt-16' : 'pt-14 md:pt-20'}`}>
        {header}
        <View className="mb-8 border-t-2 border-[#22242a] md:mb-10" />
        <AuthStatus creating={creating} />
        {children}
        <Pressable onPress={toggleMode} className={`mt-auto items-center border-[#22242a] pt-6 md:pt-8 ${creating ? 'border-0 pt-12 md:pt-16' : 'border-t-2'}`}>
          <Text className="text-center text-sm text-[#96989f] md:text-base">
            {creating ? 'Já possui autorização? ' : 'Ainda sem autorização? '}
            <Text className="text-bat-gold">{creating ? 'Acessar sistema' : 'Solicitar acesso'}</Text>
          </Text>
        </Pressable>
        {!creating && <Text className="mt-8 text-center font-mono text-xs tracking-[2px] text-[#3f4148]">CONEXÃO CRIPTOGRAFADA  ·  WAYNE ENTERPRISES</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
