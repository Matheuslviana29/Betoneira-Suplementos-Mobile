import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, dimensoes } from '../constants/tema';

export function TelaAutenticacao({ children, estiloConteudo }) {
  const referenciaRolagem = useRef(null);

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={estilos.areaSegura}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.areaTeclado}
      >
        <ScrollView
          ref={referenciaRolagem}
          automaticallyAdjustKeyboardInsets
          bounces={false}
          contentContainerStyle={estilos.conteudoRolagem}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[estilos.conteudo, estiloConteudo]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    backgroundColor: cores.fundo,
    flex: 1,
  },
  areaTeclado: {
    flex: 1,
  },
  conteudoRolagem: {
    alignItems: 'center',
    flexGrow: 1,
  },
  conteudo: {
    flexGrow: 1,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: dimensoes.espacamentoHorizontal,
    width: '100%',
  },
});
