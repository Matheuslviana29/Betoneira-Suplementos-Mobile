import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function SecaoCheckout({ aoAlterar, children, titulo }) {
  return (
    <View style={estilos.secao}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>{titulo}</Text>
        {aoAlterar ? (
          <Pressable
            accessibilityLabel={`Alterar ${titulo.toLocaleLowerCase('pt-BR')}`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={aoAlterar}
            style={({ pressed }) => pressed && estilos.pressionado}
          >
            <Text style={estilos.alterar}>Alterar</Text>
          </Pressable>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  secao: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  cabecalho: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titulo: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 13,
  },
  alterar: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 10,
  },
  pressionado: {
    opacity: 0.55,
  },
});
