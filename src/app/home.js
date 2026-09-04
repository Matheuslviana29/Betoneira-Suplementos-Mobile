import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { CartaoProduto } from '../components/CartaoProduto';
import { LogoMarca } from '../components/LogoMarca';
import { cores, dimensoes, fontes } from '../constants/tema';
import { categoriasMock, produtosMock } from '../mocks/dadosLoja';

export default function TelaHome() {
  const roteador = useRouter();
  const { secao } = useLocalSearchParams();
  const referenciaRolagem = useRef(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState(categoriasMock[0]);
  const [busca, setBusca] = useState('');

  const produtosVisiveis = produtosMock.filter((produto) =>
    `${produto.nome} ${produto.subtitulo}`.toLocaleLowerCase('pt-BR').includes(
      busca.trim().toLocaleLowerCase('pt-BR'),
    ),
  );

  const adicionarProduto = (produto) => {
    Alert.alert('Produto adicionado', produto.nome.replace('\n', ' '));
  };

  const verProdutos = () => {
    referenciaRolagem.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const quadro = requestAnimationFrame(() => {
      if (secao === 'produtos') {
        referenciaRolagem.current?.scrollToEnd({ animated: true });
        return;
      }

      referenciaRolagem.current?.scrollTo({ animated: true, y: 0 });
    });

    return () => cancelAnimationFrame(quadro);
  }, [secao]);

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
        ref={referenciaRolagem}
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudoPrincipal}>
          <View style={estilos.busca}>
            <Feather color={cores.textoPlaceholder} name="search" size={20} />
            <TextInput
              accessibilityLabel="Buscar produtos"
              autoCapitalize="none"
              onChangeText={setBusca}
              placeholder="O que você está procurando?"
              placeholderTextColor={cores.textoPlaceholder}
              returnKeyType="search"
              style={estilos.entradaBusca}
              value={busca}
            />
          </View>

          <ImageBackground
            resizeMode="contain"
            source={require('../images/banner-academia-v2.png')}
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

        <View style={estilos.faixaCategorias}>
          <ScrollView
            contentContainerStyle={estilos.listaCategorias}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categoriasMock.map((categoria) => {
              const ativa = categoria === categoriaAtiva;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: ativa }}
                  key={categoria}
                  onPress={() => setCategoriaAtiva(categoria)}
                  style={({ pressed }) => [
                    estilos.categoria,
                    ativa && estilos.categoriaAtiva,
                    pressed && estilos.pressionado,
                  ]}
                >
                  <Text style={[estilos.textoCategoria, ativa && estilos.textoCategoriaAtiva]}>
                    {categoria}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

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
              <CartaoProduto
                aoAdicionar={adicionarProduto}
                key={produto.id}
                produto={produto}
              />
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
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    height: 46,
    marginTop: 13,
    paddingHorizontal: 13,
  },
  entradaBusca: {
    color: cores.textoPlaceholder,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 12,
    height: '100%',
    paddingVertical: 0,
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
  faixaCategorias: {
    borderBottomColor: cores.laranja,
    borderBottomWidth: 2,
    marginTop: 6,
    paddingBottom: 7,
    paddingTop: 5,
  },
  listaCategorias: {
    gap: 8,
    paddingHorizontal: 6,
  },
  categoria: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 66,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoriaAtiva: {
    backgroundColor: cores.laranja,
    borderColor: cores.laranja,
  },
  textoCategoria: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
    textAlign: 'center',
  },
  textoCategoriaAtiva: {
    color: '#FFFFFF',
    fontFamily: fontes.negrito,
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
    gap: 12,
    marginTop: 10,
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
