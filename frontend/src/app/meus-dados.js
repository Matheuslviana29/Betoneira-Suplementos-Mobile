import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CampoFormulario } from '../components/CampoFormulario';
import { cores, dimensoes } from '../constants/tema';
import { useAutenticacao } from '../contextos/AutenticacaoContext';
import { api } from '../services/api';
import {
  formatarCpf,
  formatarDataApi,
  formatarTelefone,
  somenteDigitos,
} from '../utils/dadosApi';

const dadosFormulario = (usuario) => ({
  celular: formatarTelefone(usuario?.celular),
  cpf: formatarCpf(usuario?.cpf),
  dataNascimento: formatarDataApi(usuario?.dataNascimento),
  email: usuario?.email ?? '',
  nomeCompleto: usuario?.nomeCompleto ?? '',
  telefone: formatarTelefone(usuario?.telefone),
});

export default function TelaMeusDados() {
  const roteador = useRouter();
  const { atualizarUsuario, usuario } = useAutenticacao();
  const [dados, setDados] = useState(() => dadosFormulario(usuario));
  const [salvando, setSalvando] = useState(false);

  useEffect(() => setDados(dadosFormulario(usuario)), [usuario]);

  const atualizarCampo = (campo, valor) => {
    setDados((dadosAtuais) => ({ ...dadosAtuais, [campo]: valor }));
  };

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/perfil');
  };

  const salvar = async () => {
    try {
      setSalvando(true);
      const updatedUser = await api.usuario.atualizar({
        celular: somenteDigitos(dados.celular),
        dataNascimento: dados.dataNascimento,
        email: dados.email,
        nomeCompleto: dados.nomeCompleto,
        telefone: dados.telefone ? somenteDigitos(dados.telefone) : undefined,
      });
      atualizarUsuario(updatedUser);
      Toast.success('Dados salvos com sucesso.');
    } catch (error) {
      Toast.error(error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={estilos.areaSegura}>
      <View style={estilos.bordaCabecalho}>
        <View style={estilos.conteudoCabecalho}>
          <CabecalhoTela aoVoltar={voltar} titulo="Meus Dados" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={estilos.areaTeclado}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets
          bounces={false}
          contentContainerStyle={estilos.conteudoRolagem}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.formulario}>
            <CampoFormulario
              autoCapitalize="words"
              autoComplete="name"
              estiloRecipienteEntrada={estilos.entradaCinza}
              rotulo="Nome Completo"
              onChangeText={(valor) => atualizarCampo('nomeCompleto', valor)}
              returnKeyType="next"
              value={dados.nomeCompleto}
            />

            <CampoFormulario
              autoCapitalize="none"
              autoComplete="email"
              estiloRecipienteEntrada={estilos.entradaCinza}
              keyboardType="email-address"
              rotulo="E-mail"
              onChangeText={(valor) => atualizarCampo('email', valor)}
              returnKeyType="next"
              value={dados.email}
            />

            <CampoFormulario
              autoComplete="tel"
              estiloRecipienteEntrada={estilos.entradaCinza}
              keyboardType="phone-pad"
              maxLength={15}
              rotulo="Celular"
              onChangeText={(valor) => atualizarCampo('celular', formatarTelefone(valor))}
              returnKeyType="next"
              value={dados.celular}
            />

            <CampoFormulario
              autoComplete="tel"
              estiloRecipienteEntrada={estilos.entradaCinza}
              keyboardType="phone-pad"
              maxLength={15}
              rotulo="Telefone fixo"
              onChangeText={(valor) => atualizarCampo('telefone', formatarTelefone(valor))}
              returnKeyType="next"
              value={dados.telefone}
            />

            <CampoFormulario
              estiloRecipienteEntrada={estilos.entradaCinza}
              editable={false}
              keyboardType="number-pad"
              maxLength={14}
              rotulo="CPF"
              value={dados.cpf}
            />

            <CampoFormulario
              estiloRecipienteEntrada={estilos.entradaCinza}
              keyboardType="number-pad"
              maxLength={10}
              rotulo="Data de Nascimento"
              onChangeText={(valor) => atualizarCampo('dataNascimento', valor)}
              onSubmitEditing={salvar}
              returnKeyType="done"
              value={dados.dataNascimento}
            />

            <View style={estilos.recipienteBotao}>
              <BotaoPrincipal carregando={salvando} aoPressionar={salvar}>SALVAR</BotaoPrincipal>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BarraNavegacaoInferior />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    backgroundColor: cores.fundo,
    flex: 1,
  },
  bordaCabecalho: {
    borderBottomColor: cores.borda,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  conteudoCabecalho: {
    alignSelf: 'center',
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: dimensoes.espacamentoHorizontal,
    width: '100%',
  },
  areaTeclado: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  conteudoRolagem: {
    alignItems: 'center',
    flexGrow: 1,
  },
  formulario: {
    gap: 14,
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingBottom: 28,
    paddingHorizontal: dimensoes.espacamentoHorizontal,
    paddingTop: 20,
    width: '100%',
  },
  entradaCinza: {
    backgroundColor: '#F5F6F8',
  },
  recipienteBotao: {
    marginTop: 2,
  },
});
