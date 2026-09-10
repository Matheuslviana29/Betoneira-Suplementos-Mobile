import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoEndereco({ aoAbrirOpcoes, endereco }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.iconeEndereco}>
        <Feather color={cores.laranja} name="map-pin" size={18} />
      </View>

      <View style={estilos.dados}>
        <Text style={estilos.apelido}>{endereco.apelido}</Text>
        <Text numberOfLines={2} style={estilos.endereco}>
          {endereco.enderecoCompleto}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={`Opções do endereço ${endereco.apelido}`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => aoAbrirOpcoes(endereco)}
        style={({ pressed }) => [estilos.botaoOpcoes, pressed && estilos.pressionado]}
      >
        <Feather color={cores.textoSecundario} name="more-vertical" size={18} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 96,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconeEndereco: {
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  dados: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
  },
  apelido: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 12,
  },
  endereco: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 3,
  },
  botaoOpcoes: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pressionado: {
    opacity: 0.5,
  },
});
