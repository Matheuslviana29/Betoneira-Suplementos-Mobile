import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraBuscaProdutos } from '../components/BarraBuscaProdutos';
import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { CartaoProduto } from '../components/CartaoProduto';
import { FiltroCategorias } from '../components/FiltroCategorias';
import { LogoMarca } from '../components/LogoMarca';
import { cores, dimensoes, fontes } from '../constants/tema';
import { useFiltroProdutos } from '../hooks/useFiltroProdutos';

export default function TelaHome() {
  const roteador = useRouter();
  const {
    busca,
    categoriaAtiva,
    definirBusca,
    definirCategoriaAtiva,
    produtosFiltrados,
  } = useFiltroProdutos();
  const produtosVisiveis = produtosFiltrados.slice(0, 2);

  const adicionarProduto = (produto) => {
    Toast.success(`${produto.nome.replace('\n', ' ')} adicionado ao carrinho.`);
  };

  const verProdutos = () => {
    roteador.push('/produtos');
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.marinho} style="light" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.cabecalho}>
          <LogoMarca clara compacta />
          <Pressable
            accessibilityLabel="Acompanhar pedidos"
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => roteador.push('/pedidos')}
            style={({ pressed }) => [estilos.botaoNotificacao, pressed && estilos.pressionado]}
          >
            <Feather color="#FFFFFF" name="bell" size={20} />
            <View style={estilos.indicadorNotificacao} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudoPrincipal}>
          <BarraBuscaProdutos
            busca={busca}
            definirBusca={definirBusca}
            estilo={estilos.busca}
          />

          <ImageBackground
            resizeMode="contain"
            source={require('../../assets/images/banner-academia-v2.png')}
            style={estilos.banner}
          >
            <View style={estilos.sombraBanner} />
            <View style={estilos.conteudoBanner}>
              <View style={estilos.seloOferta}>
                <Text style={estilos.textoSelo}>OFERTAS DA SEMANA</Text>
              </View>
              <Text style={estilos.tituloBanner}>CONSTRUA SUA MELHOR{`\n`}VERSÃO</Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={verProdutos}
                style={({ pressed }) => pressed && estilos.pressionado}
              >
                <Text style={estilos.linkBanner}>Ver Ofertas</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>

        <FiltroCategorias
          categoriaAtiva={categoriaAtiva}
          definirCategoriaAtiva={definirCategoriaAtiva}
          estilo={estilos.filtroCategorias}
        />

        <View style={[estilos.conteudoPrincipal, estilos.secaoProdutos]}>
          <View style={estilos.cabecalhoSecao}>
            <Text style={estilos.tituloSecao}>Mais Vendidos</Text>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={verProdutos}
              style={({ pressed }) => pressed && estilos.pressionado}
            >
              <Text style={estilos.verTodos}>Ver todos</Text>
            </Pressable>
          </View>

          <View style={estilos.gradeProdutos}>
            {produtosVisiveis.map((produto) => (
              <View key={produto.id} style={estilos.colunaProduto}>
                <CartaoProduto aoAdicionar={adicionarProduto} produto={produto} />
              </View>
            ))}
          </View>
          {produtosVisiveis.length === 0 && (
            <Text style={estilos.semResultados}>Nenhum produto encontrado.</Text>
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
  botaoNotificacao: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  indicadorNotificacao: {
    backgroundColor: cores.laranja,
    borderColor: cores.marinho,
    borderRadius: 4,
    borderWidth: 1,
    height: 6,
    position: 'absolute',
    right: 9,
    top: 7,
    width: 6,
  },
  rolagem: {
    backgroundColor: cores.fundoPagina,
    flex: 1,
  },
  conteudoRolagem: {
    paddingBottom: 14,
  },
  conteudoPrincipal: {
    alignSelf: 'center',
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 12,
    width: '100%',
  },
  busca: {
    marginTop: 13,
  },
  banner: {
    aspectRatio: 1855 / 848,
    backgroundColor: cores.marinho,
    borderRadius: 13,
    marginTop: 14,
    overflow: 'hidden',
    width: '100%',
  },
  sombraBanner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  conteudoBanner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 17,
  },
  seloOferta: {
    alignSelf: 'flex-start',
    backgroundColor: cores.laranja,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  textoSelo: {
    color: '#FFFFFF',
    fontFamily: fontes.negrito,
    fontSize: 8,
  },
  tituloBanner: {
    color: '#FFFFFF',
    fontFamily: fontes.extranegrito,
    fontSize: 18,
    lineHeight: 20,
    marginTop: 8,
  },
  linkBanner: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 11,
    marginTop: 6,
  },
  filtroCategorias: {
    marginTop: 6,
  },
  secaoProdutos: {
    paddingTop: 13,
  },
  cabecalhoSecao: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tituloSecao: {
    color: cores.texto,
    fontFamily: fontes.extranegrito,
    fontSize: 15,
  },
  verTodos: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 11,
  },
  gradeProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  colunaProduto: {
    width: '48%',
  },
  semResultados: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 12,
    paddingVertical: 28,
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.6,
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
