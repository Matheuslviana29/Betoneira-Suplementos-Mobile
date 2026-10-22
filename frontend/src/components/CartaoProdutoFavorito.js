import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function CartaoProdutoFavorito({ aoAdicionar, aoRemoverFavorito, produto }) {
  const nomeAcessivel = produto.nome.replace('\n', ' ');

  return (
    <View style={estilos.cartao}>
      <View style={estilos.recipienteImagem}>
        <Image
          accessibilityLabel={`Imagem de ${nomeAcessivel}`}
          resizeMode="cover"
          source={produto.imagem}
          style={estilos.imagem}
        />

        <Pressable
          accessibilityLabel={`Remover ${nomeAcessivel} dos favoritos`}
          accessibilityRole="button"
          accessibilityState={{ selected: true }}
          hitSlop={8}
          onPress={() => aoRemoverFavorito(produto)}
          style={({ pressed }) => [
            estilos.botaoFavorito,
            pressed && estilos.botaoFavoritoPressionado,
          ]}
        >
          <Feather color={cores.laranja} name="heart" size={16} />
        </Pressable>
      </View>

      <View style={estilos.conteudo}>
        <Text numberOfLines={2} style={estilos.nome}>
          {produto.nome}
        </Text>
        <Text style={estilos.preco}>{produto.preco}</Text>

        <Pressable
          accessibilityLabel={`Adicionar ${nomeAcessivel} ao carrinho`}
          accessibilityRole="button"
          onPress={() => aoAdicionar(produto)}
          style={({ pressed }) => [estilos.botaoAdicionar, pressed && estilos.botaoPressionado]}
        >
          <Feather color="#FFFFFF" name="plus" size={15} />
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
    borderRadius: 13,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    padding: 8,
  },
  recipienteImagem: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    height: 110,
    overflow: 'hidden',
    position: 'relative',
  },
  imagem: {
    height: '100%',
    width: '100%',
  },
  botaoFavorito: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderRadius: 15,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 7,
    top: 7,
    width: 28,
  },
  botaoFavoritoPressionado: {
    opacity: 0.65,
  },
  conteudo: {
    flex: 1,
    paddingTop: 9,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
  },
  preco: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 13,
    marginTop: 4,
  },
  botaoAdicionar: {
    alignItems: 'center',
    backgroundColor: cores.laranja,
    borderRadius: 7,
    flexDirection: 'row',
    gap: 3,
    height: 34,
    justifyContent: 'center',
    marginTop: 9,
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
