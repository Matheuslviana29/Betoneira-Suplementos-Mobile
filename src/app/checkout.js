import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { ItemResumoCheckout } from '../components/ItemResumoCheckout';
import { SecaoCheckout } from '../components/SecaoCheckout';
import { cores, dimensoes, fontes } from '../constants/tema';
import { carrinhoMock } from '../mocks/dadosCarrinho';
import { enderecosMock } from '../mocks/dadosEndereco';
import { cartoesMock } from '../mocks/dadosPagamento';
import {
  calcularResumoCarrinho,
  formatarMoeda,
  reconstruirItensCheckout,
} from '../utils/carrinho';

const enderecoPadrao =
  enderecosMock.find((endereco) => endereco.id === 'endereco-trabalho') ?? enderecosMock[0];
const cartaoPadrao =
  cartoesMock.find((cartao) => cartao.id === 'cartao-visa-4321') ?? cartoesMock[0];

export default function TelaCheckout() {
  const roteador = useRouter();
  const { itens: parametroItens } = useLocalSearchParams();
  const itensSerializados = Array.isArray(parametroItens) ? parametroItens[0] : parametroItens;
  const itens = useMemo(
    () => reconstruirItensCheckout(carrinhoMock.itens, itensSerializados),
    [itensSerializados],
  );
  const resumo = calcularResumoCarrinho(itens, carrinhoMock.frete);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/carrinho');
  };

  const confirmarPedido = () => {
    Toast.success('Pedido realizado com sucesso.');
    roteador.replace('/pedidos');
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.conteudoCabecalho}>
          <CabecalhoTela aoVoltar={voltar} titulo="Checkout" />
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudo}>
          <Text style={estilos.instrucao}>Revise os dados antes de confirmar o pedido.</Text>

          <SecaoCheckout
            aoAlterar={() => roteador.push('/endereco-entrega')}
            titulo="Endereço de entrega"
          >
            <View style={estilos.opcaoSelecionada}>
              <View style={estilos.iconeOpcao}>
                <Feather color={cores.laranja} name="map-pin" size={18} />
              </View>
              <View style={estilos.dadosOpcao}>
                <Text style={estilos.tituloOpcao}>{enderecoPadrao.apelido}</Text>
                <Text style={estilos.descricaoOpcao}>{enderecoPadrao.enderecoCompleto}</Text>
              </View>
            </View>
          </SecaoCheckout>

          <SecaoCheckout
            aoAlterar={() => roteador.push('/forma-pagamento')}
            titulo="Forma de pagamento"
          >
            <View style={estilos.opcaoSelecionada}>
              <View style={estilos.iconeOpcao}>
                <Feather color={cores.laranja} name="credit-card" size={18} />
              </View>
              <View style={estilos.dadosOpcao}>
                <Text style={estilos.tituloOpcao}>
                  {cartaoPadrao.bandeira} •••• {cartaoPadrao.ultimosDigitos}
                </Text>
                <Text style={estilos.descricaoOpcao}>
                  Validade: {cartaoPadrao.validade}
                </Text>
              </View>
            </View>
          </SecaoCheckout>

          <SecaoCheckout titulo={`Resumo do pedido (${resumo.quantidadeItens})`}>
            {itens.map((item, indice) => (
              <View key={item.id}>
                <ItemResumoCheckout item={item} />
                {indice < itens.length - 1 ? <View style={estilos.divisorItem} /> : null}
              </View>
            ))}
          </SecaoCheckout>
        </View>
      </ScrollView>

      <View style={estilos.areaConfirmacao}>
        <View style={estilos.confirmacao}>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Subtotal</Text>
            <Text style={estilos.valorResumo}>{formatarMoeda(resumo.subtotal)}</Text>
          </View>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Frete</Text>
            <Text style={estilos.valorResumo}>{formatarMoeda(resumo.frete)}</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloTotal}>Total</Text>
            <Text style={estilos.valorTotal}>{formatarMoeda(resumo.total)}</Text>
          </View>
          <BotaoPrincipal desabilitado={itens.length === 0} aoPressionar={confirmarPedido}>
            CONFIRMAR PEDIDO
          </BotaoPrincipal>
        </View>
      </View>

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
    flex: 1,
  },
  conteudoRolagem: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  conteudo: {
    gap: 12,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 10,
    paddingTop: 14,
    width: '100%',
  },
  instrucao: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
  },
  opcaoSelecionada: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconeOpcao: {
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  dadosOpcao: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 11,
  },
  tituloOpcao: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 11,
  },
  descricaoOpcao: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 2,
  },
  divisorItem: {
    backgroundColor: cores.borda,
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  areaConfirmacao: {
    backgroundColor: cores.fundo,
    borderTopColor: cores.borda,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  confirmacao: {
    alignSelf: 'center',
    gap: 7,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingBottom: 12,
    paddingHorizontal: 13,
    paddingTop: 10,
    width: '100%',
  },
  linhaResumo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rotuloResumo: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
  },
  valorResumo: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 10,
  },
  divisor: {
    backgroundColor: cores.borda,
    height: StyleSheet.hairlineWidth,
  },
  rotuloTotal: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 14,
  },
  valorTotal: {
    color: cores.laranja,
    fontFamily: fontes.negrito,
    fontSize: 15,
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
