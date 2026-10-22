import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoProdutoFavorito } from '../components/CartaoProdutoFavorito';
import { cores, dimensoes, fontes } from '../constants/tema';
import { favoritosMock } from '../mocks/dadosFavoritos';

export default function TelaFavoritos() {
  const roteador = useRouter();
  const [favoritos, setFavoritos] = useState(() => [...favoritosMock]);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const adicionarProduto = (produto) => {
    Toast.success(`${produto.nome.replace('\n', ' ')} adicionado ao carrinho.`);
  };

  const removerFavorito = (produto) => {
    setFavoritos((favoritosAtuais) =>
      favoritosAtuais.filter((favorito) => favorito.id !== produto.id),
    );
    Toast.info(`${produto.nome.replace('\n', ' ')} removido dos favoritos.`);
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.conteudoCabecalho}>
          <CabecalhoTela aoVoltar={voltar} titulo="Favoritos" />
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudo}>
          {favoritos.map((produto) => (
            <View key={produto.id} style={estilos.colunaProduto}>
              <CartaoProdutoFavorito
                aoAdicionar={adicionarProduto}
                aoRemoverFavorito={removerFavorito}
                produto={produto}
              />
            </View>
          ))}

          {favoritos.length === 0 && (
            <View style={estilos.estadoVazio}>
              <Feather color={cores.textoPlaceholder} name="heart" size={38} />
              <Text style={estilos.tituloVazio}>Nenhum favorito ainda</Text>
              <Text style={estilos.textoVazio}>
                Os produtos que você favoritar aparecerão aqui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={estilos.areaNavegacao}>
        <BarraNavegacaoInferior />
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    backgroundColor: cores.fundoPagina,
    flex: 1,
  },
  areaCabecalho: {
    backgroundColor: cores.fundo,
    borderBottomColor: cores.borda,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  conteudoCabecalho: {
    alignSelf: 'center',
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 12,
    width: '100%',
  },
  rolagem: {
    backgroundColor: cores.fundoPagina,
    flex: 1,
  },
  conteudoRolagem: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 20,
  },
  conteudo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 10,
    paddingTop: 12,
    width: '100%',
  },
  colunaProduto: {
    width: '48%',
  },
  estadoVazio: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    width: '100%',
  },
  tituloVazio: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 14,
    marginTop: 10,
  },
  textoVazio: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
