import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoItemCarrinho({
  aoAdicionar,
  aoDiminuir,
  item,
  precoFormatado,
}) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.recipienteImagem}>
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          source={item.imagem}
          style={[estilos.imagem, { transform: [{ scale: item.escalaImagem }] }]}
        />
      </View>

      <View style={estilos.conteudo}>
        <Text numberOfLines={2} style={estilos.nome}>
          {item.nome}
        </Text>
        <Text numberOfLines={1} style={estilos.subtitulo}>
          {item.subtitulo}
        </Text>

        <View style={estilos.rodape}>
          <View style={estilos.controleQuantidade}>
            <Pressable
              accessibilityLabel={`Diminuir quantidade de ${item.nome}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={aoDiminuir}
              style={({ pressed }) => [estilos.botaoQuantidade, pressed && estilos.pressionado]}
            >
              <Feather color={cores.texto} name="minus" size={14} />
            </Pressable>

            <Text accessibilityLiveRegion="polite" style={estilos.quantidade}>
              {item.quantidade}
            </Text>

            <Pressable
              accessibilityLabel={`Aumentar quantidade de ${item.nome}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={aoAdicionar}
              style={({ pressed }) => [estilos.botaoQuantidade, pressed && estilos.pressionado]}
            >
              <Feather color={cores.texto} name="plus" size={14} />
            </Pressable>
          </View>

          <Text style={estilos.preco}>{precoFormatado}</Text>
        </View>
      </View>
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
    padding: 9,
  },
  recipienteImagem: {
    alignItems: 'center',
    backgroundColor: cores.fundoPagina,
    borderRadius: 8,
    height: 76,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 76,
  },
  imagem: {
    height: '100%',
    width: '100%',
  },
  conteudo: {
    alignSelf: 'stretch',
    flex: 1,
    minWidth: 0,
    paddingLeft: 12,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 11,
    lineHeight: 15,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 8,
    marginTop: 2,
  },
  rodape: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  controleQuantidade: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  botaoQuantidade: {
    alignItems: 'center',
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  quantidade: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 10,
    minWidth: 19,
    textAlign: 'center',
  },
  preco: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 11,
  },
  pressionado: {
    opacity: 0.5,
  },
});
