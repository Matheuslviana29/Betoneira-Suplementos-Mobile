import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraBuscaProdutos } from '../components/BarraBuscaProdutos';
import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { CartaoProduto } from '../components/CartaoProduto';
import { FiltroCategorias } from '../components/FiltroCategorias';
import { LogoMarca } from '../components/LogoMarca';
import { cores, dimensoes, fontes } from '../constants/tema';
import { useFiltroProdutos } from '../hooks/useFiltroProdutos';

export default function TelaProdutos() {
  const roteador = useRouter();
  const {
    busca,
    categoriaAtiva,
    definirBusca,
    definirCategoriaAtiva,
    produtosFiltrados,
  } = useFiltroProdutos();

  const adicionarProduto = (produto) => {
    Toast.success(`${produto.nome.replace('\n', ' ')} adicionado ao carrinho.`);
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.marinho} style="light" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.cabecalho}>
          <LogoMarca clara compacta />
          <Pressable
            accessibilityLabel="Abrir carrinho"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => roteador.push('/carrinho')}
            style={({ pressed }) => [estilos.botaoCarrinho, pressed && estilos.pressionado]}
          >
            <Feather color="#FFFFFF" name="shopping-bag" size={19} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={estilos.areaFiltros}>
        <View style={estilos.conteudoLimitado}>
          <BarraBuscaProdutos busca={busca} definirBusca={definirBusca} />
        </View>
        <FiltroCategorias
          categoriaAtiva={categoriaAtiva}
          definirCategoriaAtiva={definirCategoriaAtiva}
        />
      </View>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={[estilos.conteudoLimitado, estilos.grade]}>
          {produtosFiltrados.map((produto) => (
            <View key={produto.id} style={estilos.colunaProduto}>
              <CartaoProduto aoAdicionar={adicionarProduto} produto={produto} />
            </View>
          ))}
        </View>

        {produtosFiltrados.length === 0 && (
          <Text style={estilos.semResultados}>Nenhum produto encontrado.</Text>
        )}
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
    backgroundColor: cores.marinho,
  },
  cabecalho: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: dimensoes.larguraMaximaConteudo,
    minHeight: 48,
    paddingHorizontal: 14,
    width: '100%',
  },
  botaoCarrinho: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  areaFiltros: {
    backgroundColor: cores.fundo,
    paddingTop: 12,
  },
  conteudoLimitado: {
    alignSelf: 'center',
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 12,
    width: '100%',
  },
  rolagem: {
    flex: 1,
  },
  conteudoRolagem: {
    paddingBottom: 14,
    paddingTop: 10,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colunaProduto: {
    width: '48%',
  },
  semResultados: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 12,
    paddingVertical: 36,
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.6,
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
