import { Image, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';
import { formatarMoeda } from '../utils/carrinho';

export function ItemResumoCheckout({ item }) {
  return (
    <View style={estilos.item}>
      <View style={estilos.recipienteImagem}>
        <Image resizeMode="contain" source={item.imagem} style={estilos.imagem} />
      </View>

      <View style={estilos.dados}>
        <Text numberOfLines={2} style={estilos.nome}>
          {item.nome}
        </Text>
        <Text style={estilos.quantidade}>Quantidade: {item.quantidade}</Text>
      </View>

      <Text style={estilos.preco}>
        {formatarMoeda(item.precoUnitario * item.quantidade)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 58,
  },
  recipienteImagem: {
    alignItems: 'center',
    backgroundColor: cores.fundoPagina,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 52,
  },
  imagem: {
    height: 48,
    width: 48,
  },
  dados: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 10,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 10,
    lineHeight: 14,
  },
  quantidade: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 9,
    marginTop: 2,
  },
  preco: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 10,
  },
});
