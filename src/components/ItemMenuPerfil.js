import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function ItemMenuPerfil({ aoPressionar, icone, ultimo = false, rotulo }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={aoPressionar}
      style={({ pressed }) => [estilos.item, pressed && estilos.pressionado]}
    >
      <Feather color={cores.textoSecundario} name={icone} size={17} />
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Feather color={cores.textoPlaceholder} name="chevron-right" size={16} />
      {!ultimo && <View style={estilos.divisor} />}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 51,
    paddingHorizontal: 15,
    position: 'relative',
  },
  rotulo: {
    color: cores.texto,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 11,
  },
  divisor: {
    backgroundColor: cores.borda,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    left: 44,
    position: 'absolute',
    right: 0,
  },
  pressionado: {
    backgroundColor: cores.fundoPagina,
  },
});
