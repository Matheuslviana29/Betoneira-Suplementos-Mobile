import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../../../components/BarraNavegacaoInferior';
import { BotaoAdicionarTracejado } from '../../../components/BotaoAdicionarTracejado';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { CartaoEndereco } from '../../../components/CartaoEndereco';
import { cores, dimensoes } from '../../../constants/tema';
import { useConsultaAoFocar } from '../../../hooks/useConsultaAoFocar';
import { api } from '../../../services/api';
import { adaptarEndereco } from '../../../utils/dadosApi';
import { useCheckoutSelection } from '../CheckoutSelectionContext';
import { ConfirmacaoAcao } from '../components/ConfirmacaoAcao';

const carregarEnderecos = async () => (await api.enderecos.listar()).map(adaptarEndereco);

export default function TelaEnderecoEntrega() {
  const roteador = useRouter();
  const { dados: enderecos, erro, recarregar } = useConsultaAoFocar(carregarEnderecos, []);
  const { invalidateAddress, selectAddress, selectedAddressId } = useCheckoutSelection();
  const [enderecoPendente, setEnderecoPendente] = useState(null);

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const adicionarEndereco = () => roteador.push('/novo-endereco');

  const tornarPrincipal = async () => {
    const endereco = enderecoPendente;
    setEnderecoPendente(null);
    try {
      await api.enderecos.atualizar(endereco.id, { padrao: true });
      await recarregar();
    } catch (error) {
      Toast.error(error.message);
    }
  };

  const removerEndereco = async () => {
    const endereco = enderecoPendente;
    setEnderecoPendente(null);
    try {
      await api.enderecos.remover(endereco.id);
      invalidateAddress(endereco.id);
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
          <CabecalhoTela aoVoltar={voltar} titulo="Endereços de Entrega" />
        </View>
      </SafeAreaView>

      <ScrollView
        bounces={false}
        contentContainerStyle={estilos.conteudoRolagem}
        showsVerticalScrollIndicator={false}
        style={estilos.rolagem}
      >
        <View style={estilos.conteudo}>
          {selectedAddressId === null ? (
            <Text accessibilityLiveRegion="polite" style={estilos.orientacao}>
              Escolha um endereço para continuar com o pedido.
            </Text>
          ) : null}
          {enderecos.map((endereco) => (
            <CartaoEndereco
              aoAbrirOpcoes={setEnderecoPendente}
              aoSelecionar={(item) => selectAddress(item.id)}
              endereco={endereco}
              key={endereco.id}
              selecionado={selectedAddressId === endereco.id}
            />
          ))}

          {erro ? <BotaoAdicionarTracejado aoPressionar={recarregar}>{erro}</BotaoAdicionarTracejado> : null}

          <BotaoAdicionarTracejado aoPressionar={adicionarEndereco}>
            + Adicionar Novo Endereço
          </BotaoAdicionarTracejado>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom', 'left', 'right']} style={estilos.areaNavegacao}>
        <BarraNavegacaoInferior />
      </SafeAreaView>

      <ConfirmacaoAcao
        acaoSecundaria={tornarPrincipal}
        aoCancelar={() => setEnderecoPendente(null)}
        aoConfirmar={removerEndereco}
        descricao={enderecoPendente?.enderecoCompleto ?? ''}
        rotuloSecundario="Tornar principal"
        titulo={enderecoPendente?.apelido ?? 'Endereço'}
        visivel={enderecoPendente !== null}
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
