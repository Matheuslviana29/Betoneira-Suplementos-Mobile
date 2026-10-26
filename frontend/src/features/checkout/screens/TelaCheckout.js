import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../../../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../../../components/BotaoPrincipal';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { ItemResumoCheckout } from '../../../components/ItemResumoCheckout';
import { SecaoCheckout } from '../../../components/SecaoCheckout';
import { cores, dimensoes, fontes } from '../../../constants/tema';
import { useConsultaAoFocar } from '../../../hooks/useConsultaAoFocar';
import { api } from '../../../services/api';
import { formatarMoeda } from '../../../utils/carrinho';
import { adaptarCarrinho, adaptarEndereco, adaptarPagamento } from '../../../utils/dadosApi';

const estadoInicial = {
  carrinho: {
    itens: [],
    resumo: { freteCentavos: 0, quantidadeItens: 0, subtotalCentavos: 0, totalCentavos: 0 },
  },
  endereco: null,
  pagamento: null,
};

async function carregarCheckout() {
  const [cart, addresses, payments] = await Promise.all([
    api.carrinho.obter(),
    api.enderecos.listar(),
    api.pagamentos.listar(),
  ]);
  return {
    carrinho: adaptarCarrinho(cart),
    endereco: addresses[0] ? adaptarEndereco(addresses[0]) : null,
    pagamento: payments[0] ? adaptarPagamento(payments[0]) : null,
  };
}

export default function TelaCheckout() {
  const roteador = useRouter();
  const { dados, erro } = useConsultaAoFocar(carregarCheckout, estadoInicial);
  const [confirmando, setConfirmando] = useState(false);
  const { carrinho, endereco, pagamento } = dados;
  const { itens, resumo } = carrinho;

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/carrinho');
  };

  const confirmarPedido = async () => {
    try {
      setConfirmando(true);
      await api.pedidos.criar({ enderecoId: endereco.id, formaPagamentoId: pagamento.id });
      Toast.success('Pedido realizado com sucesso.');
      roteador.replace('/pedidos');
    } catch (error) {
      Toast.error(error.message);
    } finally {
      setConfirmando(false);
    }
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
                <Text style={estilos.tituloOpcao}>{endereco?.apelido ?? 'Nenhum endereço'}</Text>
                <Text style={estilos.descricaoOpcao}>
                  {endereco?.enderecoCompleto ?? 'Cadastre um endereço para continuar.'}
                </Text>
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
                  {pagamento
                    ? `${pagamento.bandeira} •••• ${pagamento.ultimosDigitos}`
                    : 'Nenhuma forma de pagamento'}
                </Text>
                <Text style={estilos.descricaoOpcao}>
                  {pagamento
                    ? `Validade: ${pagamento.validade}`
                    : 'Cadastre uma forma de pagamento para continuar.'}
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
          {erro ? <Text style={estilos.instrucao}>{erro}</Text> : null}
        </View>
      </ScrollView>

      <View style={estilos.areaConfirmacao}>
        <View style={estilos.confirmacao}>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Subtotal</Text>
            <Text style={estilos.valorResumo}>
              {formatarMoeda(resumo.subtotalCentavos / 100)}
            </Text>
          </View>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Frete</Text>
            <Text style={estilos.valorResumo}>{formatarMoeda(resumo.freteCentavos / 100)}</Text>
          </View>
          <View style={estilos.divisor} />
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloTotal}>Total</Text>
            <Text style={estilos.valorTotal}>{formatarMoeda(resumo.totalCentavos / 100)}</Text>
          </View>
          <BotaoPrincipal
            carregando={confirmando}
            desabilitado={itens.length === 0 || !endereco || !pagamento}
            aoPressionar={confirmarPedido}
          >
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
