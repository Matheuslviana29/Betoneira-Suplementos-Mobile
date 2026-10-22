import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoFormaPagamento({ aoAbrirOpcoes, cartao }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.iconeCartao}>
        <Feather color={cores.laranja} name="credit-card" size={18} />
      </View>

      <View style={estilos.dados}>
        <Text style={estilos.identificacao}>
          {cartao.bandeira} •••• {cartao.ultimosDigitos}
        </Text>
        <Text style={estilos.validade}>Validade: {cartao.validade}</Text>
      </View>

      <Pressable
        accessibilityLabel={`Opções do cartão ${cartao.bandeira} final ${cartao.ultimosDigitos}`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => aoAbrirOpcoes(cartao)}
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
    minHeight: 78,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconeCartao: {
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
  identificacao: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 12,
  },
  validade: {
    color: cores.textoPlaceholder,
    fontFamily: fontes.regular,
    fontSize: 9,
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
