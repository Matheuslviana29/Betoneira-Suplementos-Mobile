import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function BotaoPrincipal({ children, carregando = false, desabilitado = false, aoPressionar }) {
  const indisponivel = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: carregando, disabled: indisponivel }}
      disabled={indisponivel}
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.botao,
        pressed && estilos.pressionado,
        indisponivel && estilos.desabilitado,
      ]}
    >
      {carregando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={estilos.rotulo}>{children}</Text>}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    alignItems: 'center',
    backgroundColor: cores.laranja,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    width: '100%',
  },
  pressionado: {
    backgroundColor: cores.laranjaPressionado,
  },
  desabilitado: {
    opacity: 0.55,
  },
  rotulo: {
    color: '#FFFFFF',
    fontFamily: fontes.extranegrito,
    fontSize: 14,
  },
});
