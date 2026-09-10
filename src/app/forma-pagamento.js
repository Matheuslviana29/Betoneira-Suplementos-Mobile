import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoFormaPagamento } from '../components/CartaoFormaPagamento';
import { cores, dimensoes, fontes } from '../constants/tema';
import { cartoesMock } from '../mocks/dadosPagamento';

export default function TelaFormaPagamento() {
  const roteador = useRouter();

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/meus-dados');
  };

  const adicionarCartao = () => {
    // Substituir pela abertura do formulário de cartão quando ele estiver disponível.
    Alert.alert('Adicionar cartão', 'O cadastro de um novo cartão será conectado aqui.');
  };

  const abrirOpcoes = (cartao) => {
    // As ações poderão consumir a API sem alterar a estrutura visual deste componente.
    Alert.alert(
      `${cartao.bandeira} final ${cartao.ultimosDigitos}`,
      'As opções deste cartão serão conectadas aqui.',
    );
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.conteudoCabecalho}>
          <CabecalhoTela aoVoltar={voltar} titulo="Formas de Pagamento" />
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudo}>
          {cartoesMock.map((cartao) => (
            <CartaoFormaPagamento
              aoAbrirOpcoes={abrirOpcoes}
              cartao={cartao}
              key={cartao.id}
            />
          ))}

          <Pressable
            accessibilityRole="button"
            onPress={adicionarCartao}
            style={({ pressed }) => [
              estilos.botaoAdicionar,
              pressed && estilos.botaoAdicionarPressionado,
            ]}
          >
            <Text style={estilos.textoAdicionar}>+ Adicionar Novo Cartão</Text>
          </Pressable>
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
    paddingBottom: 24,
  },
  conteudo: {
    gap: 12,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 10,
    paddingTop: 18,
    width: '100%',
  },
  botaoAdicionar: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.laranja,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 52,
    justifyContent: 'center',
  },
  botaoAdicionarPressionado: {
    backgroundColor: '#FFF8F2',
  },
  textoAdicionar: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 11,
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
