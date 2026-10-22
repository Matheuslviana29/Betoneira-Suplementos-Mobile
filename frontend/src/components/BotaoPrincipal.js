import { Pressable, StyleSheet, Text } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function BotaoPrincipal({ children, desabilitado = false, aoPressionar }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={desabilitado}
      onPress={aoPressionar}
      style={({ pressed }) => [
        estilos.botao,
        pressed && estilos.pressionado,
        desabilitado && estilos.desabilitado,
      ]}
    >
      <Text style={estilos.rotulo}>{children}</Text>
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
