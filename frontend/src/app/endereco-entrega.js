import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoAdicionarTracejado } from '../components/BotaoAdicionarTracejado';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoEndereco } from '../components/CartaoEndereco';
import { cores, dimensoes } from '../constants/tema';
import { enderecosMock } from '../mocks/dadosEndereco';

export default function TelaEnderecoEntrega() {
  const roteador = useRouter();

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const adicionarEndereco = () => {
    // Substituir pela abertura do formulário quando ele estiver disponível.
    Alert.alert('Adicionar endereço', 'O cadastro de um novo endereço será conectado aqui.');
  };

  const abrirOpcoes = (endereco) => {
    // As ações poderão consumir a API sem alterar a estrutura visual deste componente.
    Alert.alert(endereco.apelido, 'As opções deste endereço serão conectadas aqui.');
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
          {enderecosMock.map((endereco) => (
            <CartaoEndereco
              aoAbrirOpcoes={abrirOpcoes}
              endereco={endereco}
              key={endereco.id}
            />
          ))}

          <BotaoAdicionarTracejado aoPressionar={adicionarEndereco}>
            + Adicionar Novo Endereço
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
