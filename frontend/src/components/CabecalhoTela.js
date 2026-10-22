import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CabecalhoTela({ aoVoltar, titulo }) {
  return (
    <View style={estilos.recipiente}>
      <Pressable
        accessibilityLabel="Voltar"
        accessibilityRole="button"
        hitSlop={12}
        onPress={aoVoltar}
        style={({ pressed }) => [estilos.botaoVoltar, pressed && estilos.pressionado]}
      >
        <Feather color={cores.texto} name="arrow-left" size={24} />
      </Pressable>
      <Text style={estilos.titulo}>{titulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  recipiente: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 54,
  },
  botaoVoltar: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: -10,
    width: 40,
  },
  pressionado: {
    opacity: 0.55,
  },
  titulo: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 18,
    marginLeft: 2,
  },
});
