import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoProduto({ aoAdicionar, produto }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.recipienteImagem}>
        <Image
          resizeMode="contain"
          source={produto.imagem}
          style={[estilos.imagem, { transform: [{ scale: produto.escalaImagem }] }]}
        />
      </View>

      <View style={estilos.conteudo}>
        <Text numberOfLines={2} style={estilos.nome}>
          {produto.nome}
        </Text>
        <Text numberOfLines={1} style={estilos.subtitulo}>
          {produto.subtitulo}
        </Text>
        <Text style={estilos.preco}>{produto.preco}</Text>

        <Pressable
          accessibilityLabel={`Adicionar ${produto.nome.replace('\n', ' ')} ao carrinho`}
          accessibilityRole="button"
          onPress={() => aoAdicionar(produto)}
          style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressionado]}
        >
          <Feather color="#FFFFFF" name="plus" size={18} />
          <Text style={estilos.rotuloBotao}>Adicionar</Text>
        </Pressable>
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
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  recipienteImagem: {
    alignItems: 'center',
    height: 106,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  imagem: {
    height: '100%',
    width: '100%',
  },
  conteudo: {
    flex: 1,
    paddingBottom: 9,
    paddingHorizontal: 9,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 8,
    marginTop: 3,
  },
  preco: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 13,
    marginTop: 7,
  },
  botao: {
    alignItems: 'center',
    backgroundColor: cores.laranja,
    borderRadius: 7,
    flexDirection: 'row',
    gap: 4,
    height: 34,
    justifyContent: 'center',
    marginTop: 6,
  },
  botaoPressionado: {
    backgroundColor: cores.laranjaPressionado,
  },
  rotuloBotao: {
    color: '#FFFFFF',
    fontFamily: fontes.seminegrito,
    fontSize: 11,
  },
});
