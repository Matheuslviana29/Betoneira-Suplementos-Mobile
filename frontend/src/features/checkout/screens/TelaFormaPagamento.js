import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../../../components/BarraNavegacaoInferior';
import { BotaoAdicionarTracejado } from '../../../components/BotaoAdicionarTracejado';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { CartaoFormaPagamento } from '../../../components/CartaoFormaPagamento';
import { cores, dimensoes } from '../../../constants/tema';
import { useConsultaAoFocar } from '../../../hooks/useConsultaAoFocar';
import { api } from '../../../services/api';
import { adaptarPagamento } from '../../../utils/dadosApi';
import { useCheckoutSelection } from '../CheckoutSelectionContext';
import { ConfirmacaoAcao } from '../components/ConfirmacaoAcao';

const carregarPagamentos = async () => (await api.pagamentos.listar()).map(adaptarPagamento);

export default function TelaFormaPagamento() {
  const roteador = useRouter();
  const { dados: cartoes, erro, recarregar } = useConsultaAoFocar(carregarPagamentos, []);
  const { invalidatePayment, selectPayment, selectedPaymentId } = useCheckoutSelection();
  const [cartaoPendente, setCartaoPendente] = useState(null);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const adicionarCartao = () => roteador.push('/nova-forma-pagamento');

  const removerCartao = async () => {
    const cartao = cartaoPendente;
    setCartaoPendente(null);
    try {
      await api.pagamentos.remover(cartao.id);
      invalidatePayment(cartao.id);
      await recarregar();
    } catch (error) {
      Toast.error(error.message);
    }
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
          {selectedPaymentId === null ? (
            <Text accessibilityLiveRegion="polite" style={estilos.orientacao}>
              Escolha uma forma de pagamento para continuar com o pedido.
            </Text>
          ) : null}
          {cartoes.map((cartao) => (
            <CartaoFormaPagamento
              aoAbrirOpcoes={setCartaoPendente}
              aoSelecionar={(item) => selectPayment(item.id)}
              cartao={cartao}
              key={cartao.id}
              selecionado={selectedPaymentId === cartao.id}
            />
          ))}

          {erro ? <BotaoAdicionarTracejado aoPressionar={recarregar}>{erro}</BotaoAdicionarTracejado> : null}

          <BotaoAdicionarTracejado aoPressionar={adicionarCartao}>
            + Adicionar Novo Cartão
          </BotaoAdicionarTracejado>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={estilos.areaNavegacao}>
        <BarraNavegacaoInferior />
      </SafeAreaView>

      <ConfirmacaoAcao
        aoCancelar={() => setCartaoPendente(null)}
        aoConfirmar={removerCartao}
        descricao="Deseja remover esta forma de pagamento?"
        rotuloConfirmar="Remover"
        titulo={
          cartaoPendente
            ? `${cartaoPendente.bandeira} final ${cartaoPendente.ultimosDigitos}`
            : 'Forma de pagamento'
        }
        visivel={cartaoPendente !== null}
      />
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
  orientacao: {
    color: cores.textoSecundario,
    fontSize: 11,
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
