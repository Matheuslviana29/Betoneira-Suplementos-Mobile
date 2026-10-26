import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../../../components/BarraNavegacaoInferior';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { CartaoPedido } from '../../../components/CartaoPedido';
import { cores, dimensoes, fontes } from '../../../constants/tema';
import { useConsultaAoFocar } from '../../../hooks/useConsultaAoFocar';
import { api } from '../../../services/api';
import { adaptarPedido } from '../../../utils/dadosApi';

const carregarPedidos = async () => (await api.pedidos.listar()).map(adaptarPedido);

export function TelaPedidos() {
  const roteador = useRouter();
  const { dados: pedidos, erro } = useConsultaAoFocar(carregarPedidos, []);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.conteudoCabecalho}>
          <CabecalhoTela aoVoltar={voltar} titulo="Pedidos" />
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.lista}>
          {pedidos.map((pedido) => (
            <CartaoPedido key={pedido.id} pedido={pedido} />
          ))}
          {pedidos.length === 0 ? (
            <Text style={estilos.vazio}>{erro ?? 'Você ainda não possui pedidos.'}</Text>
          ) : null}
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
    paddingBottom: 20,
  },
  lista: {
    gap: 10,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 9,
    paddingTop: 12,
    width: '100%',
  },
  vazio: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 11,
    paddingTop: 48,
    textAlign: 'center',
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
