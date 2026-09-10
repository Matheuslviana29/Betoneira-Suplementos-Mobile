import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoItemCarrinho } from '../components/CartaoItemCarrinho';
import { cores, dimensoes, fontes } from '../constants/tema';
import { carrinhoMock } from '../mocks/dadosCarrinho';

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
});

const formatarMoeda = (valor) => formatadorMoeda.format(valor);

export default function TelaCarrinho() {
  const roteador = useRouter();
  const [itens, setItens] = useState(() => carrinhoMock.itens.map((item) => ({ ...item })));

  const quantidadeItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = itens.reduce(
    (total, item) => total + item.precoUnitario * item.quantidade,
    0,
  );
  const frete = itens.length > 0 ? carrinhoMock.frete : 0;
  const total = subtotal + frete;

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/home');
  };

  const alterarQuantidade = (id, diferenca) => {
    setItens((itensAtuais) =>
      itensAtuais
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade + diferenca } : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  };

  const alterarCep = () => {
    // Substituir pela seleção de endereço quando a integração estiver disponível.
    Alert.alert('Alterar CEP', 'A edição do endereço será conectada à próxima etapa.');
  };

  const finalizarCompra = () => {
    roteador.push('/forma-pagamento');
  };

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundo} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaCabecalho}>
        <View style={estilos.cabecalho}>
          <View style={estilos.tituloCabecalho}>
            <CabecalhoTela aoVoltar={voltar} titulo="Meu Carrinho" />
          </View>
          <Text style={estilos.totalItens}>
            {quantidadeItens} {quantidadeItens === 1 ? 'item' : 'itens'}
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
              aoAdicionar={() => alterarQuantidade(item.id, 1)}
              aoDiminuir={() => alterarQuantidade(item.id, -1)}
              item={item}
              key={item.id}
              precoFormatado={formatarMoeda(item.precoUnitario * item.quantidade)}
            />
          ))}

          {itens.length === 0 && (
            <View style={estilos.carrinhoVazio}>
              <Feather color={cores.textoPlaceholder} name="shopping-cart" size={36} />
              <Text style={estilos.tituloVazio}>Seu carrinho está vazio</Text>
              <Text style={estilos.textoVazio}>Adicione produtos para continuar a compra.</Text>
            </View>
          )}

          <View style={estilos.linhaEndereco}>
            <View style={estilos.endereco}>
              <Feather color={cores.textoSecundario} name="truck" size={15} />
              <Text numberOfLines={1} style={estilos.textoEndereco}>
                CEP: {carrinhoMock.cep} ({carrinhoMock.endereco})
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={alterarCep}
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
            <Text style={estilos.valorResumo}>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloResumo}>Frete Estimado</Text>
            <Text style={estilos.valorResumo}>{formatarMoeda(frete)}</Text>
          </View>

          <View style={estilos.divisor} />

          <View style={estilos.linhaResumo}>
            <Text style={estilos.rotuloTotal}>Total</Text>
            <Text style={estilos.valorTotal}>{formatarMoeda(total)}</Text>
          </View>

          <BotaoPrincipal desabilitado={itens.length === 0} aoPressionar={finalizarCompra}>
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
