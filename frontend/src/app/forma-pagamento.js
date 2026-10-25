import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoAdicionarTracejado } from '../components/BotaoAdicionarTracejado';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoFormaPagamento } from '../components/CartaoFormaPagamento';
import { cores, dimensoes } from '../constants/tema';
import { useConsultaAoFocar } from '../hooks/useConsultaAoFocar';
import { api } from '../services/api';
import { adaptarPagamento } from '../utils/dadosApi';

const carregarPagamentos = async () => (await api.pagamentos.listar()).map(adaptarPagamento);

export default function TelaFormaPagamento() {
  const roteador = useRouter();
  const { dados: cartoes, erro, recarregar } = useConsultaAoFocar(carregarPagamentos, []);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const adicionarCartao = () => roteador.push('/nova-forma-pagamento');

  const abrirOpcoes = (cartao) => {
    Alert.alert(
      `${cartao.bandeira} final ${cartao.ultimosDigitos}`,
      'Deseja remover esta forma de pagamento?',
      [
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.pagamentos.remover(cartao.id);
              await recarregar();
            } catch (error) {
              Toast.error(error.message);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
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
          {cartoes.map((cartao) => (
            <CartaoFormaPagamento
              aoAbrirOpcoes={abrirOpcoes}
              cartao={cartao}
              key={cartao.id}
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
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
