import { StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoPedido({ pedido }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.numero}>#{pedido.id}</Text>
          <Text style={estilos.data}>Realizado em {pedido.data}</Text>
        </View>

        <View style={[estilos.status, { backgroundColor: `${pedido.corStatus}18` }]}>
          <Text style={[estilos.textoStatus, { color: pedido.corTextoStatus }]}>
            {pedido.status}
          </Text>
        </View>
      </View>

      <View style={estilos.divisor} />

      <View style={estilos.rodape}>
        <Text numberOfLines={1} style={estilos.itens}>
          {pedido.itens}
        </Text>
        <Text style={estilos.valor}>{pedido.valor}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  cabecalho: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numero: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 14,
  },
  data: {
    color: cores.textoPlaceholder,
    fontFamily: fontes.regular,
    fontSize: 8,
    marginTop: 1,
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  textoStatus: {
    fontFamily: fontes.media,
    fontSize: 8,
  },
  divisor: {
    backgroundColor: cores.borda,
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  rodape: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  itens: {
    color: cores.textoSecundario,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 9,
  },
  valor: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 11,
  },
});
