import { Pressable, StyleSheet, Text } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function BotaoAdicionarTracejado({ aoPressionar, children }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
    >
      <Text style={estilos.rotulo}>{children}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.laranja,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 52,
    justifyContent: 'center',
  },
  pressionado: {
    backgroundColor: '#FFF8F2',
  },
  rotulo: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 11,
  },
});
