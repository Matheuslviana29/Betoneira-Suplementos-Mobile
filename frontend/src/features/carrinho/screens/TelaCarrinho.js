import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../../../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../../../components/BotaoPrincipal';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { CartaoItemCarrinho } from '../../../components/CartaoItemCarrinho';
import { cores, dimensoes, fontes } from '../../../constants/tema';
import { useConsultaAoFocar } from '../../../hooks/useConsultaAoFocar';
import { api } from '../../../services/api';
import { formatarMoeda } from '../../../utils/carrinho';
import { adaptarCarrinho, adaptarEndereco, formatarCep } from '../../../utils/dadosApi';

const carrinhoVazio = {
  itens: [],
  resumo: { freteCentavos: 0, quantidadeItens: 0, subtotalCentavos: 0, totalCentavos: 0 },
};

async function carregarCarrinho() {
  const [cart, addresses] = await Promise.all([api.carrinho.obter(), api.enderecos.listar()]);
  return {
    ...adaptarCarrinho(cart),
    endereco: addresses[0] ? adaptarEndereco(addresses[0]) : null,
  };
}

export default function TelaCarrinho() {
  const roteador = useRouter();
  const { dados: carrinho, erro, setDados: setCarrinho } =
    useConsultaAoFocar(carregarCarrinho, carrinhoVazio);
  const { itens, resumo } = carrinho;

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/home');
  };

  const alterarQuantidade = async (item, diferenca) => {
    try {
      const quantidade = item.quantidade + diferenca;
      const result = quantidade > 0
        ? await api.carrinho.alterar(item.produtoId, quantidade)
        : await api.carrinho.remover(item.produtoId);
      setCarrinho((current) => ({ ...adaptarCarrinho(result), endereco: current.endereco }));
    } catch (error) {
      Alert.alert('Carrinho', error.message);
    }
  };

  const finalizarCompra = () => roteador.push('/checkout');

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.cabecalho}>
          <View style={estilos.tituloCabecalho}>
            <CabecalhoTela aoVoltar={voltar} titulo="Meu Carrinho" />
          </View>
          <Text style={estilos.totalItens}>
            {resumo.quantidadeItens} {resumo.quantidadeItens === 1 ? 'item' : 'itens'}
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudo}>
          {itens.map((item) => (
            <CartaoItemCarrinho
              aoAdicionar={() => alterarQuantidade(item, 1)}
              aoDiminuir={() => alterarQuantidade(item, -1)}
              item={item}
              key={item.id}
              precoFormatado={formatarMoeda(item.precoUnitario * item.quantidade)}
            />
          ))}

          {itens.length === 0 && (
            <View style={estilos.carrinhoVazio}>
              <Feather color={cores.textoPlaceholder} name="shopping-cart" size={36} />
              <Text style={estilos.tituloVazio}>Seu carrinho está vazio</Text>
              <Text style={estilos.textoVazio}>
                {erro ?? 'Adicione produtos para continuar a compra.'}
              </Text>
            </View>
          )}

          <View style={estilos.linhaEndereco}>
            <View style={estilos.endereco}>
              <Feather color={cores.textoSecundario} name="truck" size={15} />
              <Text numberOfLines={1} style={estilos.textoEndereco}>
                {carrinho.endereco
                  ? `CEP: ${formatarCep(carrinho.endereco.cep)} (${carrinho.endereco.logradouro})`
                  : 'Cadastre um endereço para calcular a entrega'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => roteador.push('/endereco-entrega')}
              style={({ pressed }) => [
                estilos.botaoAlterar,
                pressed && estilos.botaoAlterarPressionado,
              ]}
            >
              <Text style={estilos.textoBotaoAlterar}>Alterar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={estilos.areaResumo}>
        <View style={estilos.resumo}>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Subtotal</Text>
            <Text style={estilos.valorResumo}>
              {formatarMoeda(resumo.subtotalCentavos / 100)}
            </Text>
          </View>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Frete Estimado</Text>
            <Text style={estilos.valorResumo}>
              {formatarMoeda(resumo.freteCentavos / 100)}
            </Text>
          </View>

          <View style={estilos.divisor} />

          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloTotal}>Total</Text>
            <Text style={estilos.valorTotal}>{formatarMoeda(resumo.totalCentavos / 100)}</Text>
          </View>

          <BotaoPrincipal
            desabilitado={itens.length === 0 || !carrinho.endereco}
            aoPressionar={finalizarCompra}
          >
            FINALIZAR COMPRA
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
  cabecalho: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 12,
    width: '100%',
  },
  tituloCabecalho: {
    flex: 1,
  },
  totalItens: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
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
    gap: 10,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 10,
    paddingTop: 12,
    width: '100%',
  },
  carrinhoVazio: {
    alignItems: 'center',
    gap: 5,
    paddingBottom: 28,
    paddingTop: 40,
  },
  tituloVazio: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 14,
    marginTop: 3,
  },
  textoVazio: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
  },
  linhaEndereco: {
    flexDirection: 'row',
    gap: 10,
  },
  endereco: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    height: 46,
    minWidth: 0,
    paddingHorizontal: 10,
  },
  textoEndereco: {
    color: cores.textoSecundario,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 9,
  },
  botaoAlterar: {
    alignItems: 'center',
    backgroundColor: cores.marinho,
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 17,
  },
  botaoAlterarPressionado: {
    opacity: 0.75,
  },
  textoBotaoAlterar: {
    color: '#FFFFFF',
    fontFamily: fontes.seminegrito,
    fontSize: 10,
  },
  areaResumo: {
    backgroundColor: cores.fundo,
    borderTopColor: cores.borda,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  resumo: {
    alignSelf: 'center',
    gap: 7,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingBottom: 12,
    paddingHorizontal: 13,
    paddingTop: 12,
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
