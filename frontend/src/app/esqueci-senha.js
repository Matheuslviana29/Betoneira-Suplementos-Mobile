import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toast } from 'toastify-react-native';

import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CampoFormulario } from '../components/CampoFormulario';
import { TelaAutenticacao } from '../components/TelaAutenticacao';
import { cores, fontes } from '../constants/tema';
import {
  esquemaRecuperacaoSenha,
  obterErrosPorCampo,
} from '../schemas/esquemasAutenticacao';

export default function TelaEsqueciSenha() {
  const roteador = useRouter();
  const [email, definirEmail] = useState('');
  const [erroEmail, definirErroEmail] = useState();

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/login');
  };

  const enviar = () => {
    const resultado = esquemaRecuperacaoSenha.safeParse({ email });

    if (!resultado.success) {
      definirErroEmail(obterErrosPorCampo(resultado.error).email);
      Toast.warn('Revise o e-mail informado.');
      return;
    }

    definirErroEmail(undefined);
    Toast.info('Enviaremos um código se o e-mail estiver cadastrado.');
  };

  return (
    <TelaAutenticacao estiloConteudo={estilos.tela}>
      <CabecalhoTela aoVoltar={voltar} titulo="Esqueci minha senha" />

      <View style={estilos.formulario}>
        <Text style={estilos.descricao}>
          Informe seu e-mail para receber um código de alteração de senha.
        </Text>

        <CampoFormulario
          autoCapitalize="none"
          autoComplete="email"
          erro={erroEmail}
          keyboardType="email-address"
          obrigatorio
          rotulo="E-mail"
          onChangeText={(valor) => {
            definirEmail(valor);
            definirErroEmail(undefined);
          }}
          onSubmitEditing={enviar}
          placeholder="nome@exemplo.com"
          returnKeyType="send"
          value={email}
        />
      </View>

      <View style={estilos.rodape}>
        <BotaoPrincipal aoPressionar={enviar}>ENVIAR</BotaoPrincipal>
      </View>
    </TelaAutenticacao>
  );
}

const estilos = StyleSheet.create({
  tela: {
    paddingBottom: 10,
  },
  formulario: {
    gap: 24,
    paddingTop: 24,
  },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  rodape: {
    marginTop: 'auto',
    paddingTop: 48,
  },
});
