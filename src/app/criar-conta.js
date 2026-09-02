import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CampoFormulario } from '../components/CampoFormulario';
import { SeletorGenero } from '../components/SeletorGenero';
import { TelaAutenticacao } from '../components/TelaAutenticacao';
import { cores, fontes } from '../constants/tema';
import { useFormularioCadastro } from '../hooks/useFormularioCadastro';

export default function TelaCriarConta() {
  const roteador = useRouter();
  const referenciaEmail = useRef(null);
  const {
    alternarVisibilidadeSenha,
    atualizarCampo,
    enviar,
    erros,
    senhaVisivel,
    valores,
  } = useFormularioCadastro();

  const voltar = () => {
    if (roteador.canGoBack()) {
      roteador.back();
      return;
    }

    roteador.replace('/');
  };

  return (
    <TelaAutenticacao estiloConteudo={estilos.tela}>
      <CabecalhoTela aoVoltar={voltar} titulo="Criar Conta" />

      <View style={estilos.formulario}>
        <CampoFormulario
          autoCapitalize="words"
          autoComplete="name"
          erro={erros.nomeCompleto}
          obrigatorio
          rotulo="Nome Completo"
          onChangeText={(valor) => atualizarCampo('nomeCompleto', valor)}
          onSubmitEditing={() => referenciaEmail.current?.focus()}
          placeholder="Nome como no documento"
          returnKeyType="next"
          value={valores.nomeCompleto}
        />

        <CampoFormulario
          ref={referenciaEmail}
          autoCapitalize="none"
          autoComplete="email"
          erro={erros.email}
          keyboardType="email-address"
          obrigatorio
          rotulo="E-mail"
          onChangeText={(valor) => atualizarCampo('email', valor)}
          placeholder="nome@exemplo.com"
          returnKeyType="next"
          value={valores.email}
        />

        <View style={estilos.linha}>
          <CampoFormulario
            erro={erros.cpf}
            estilo={estilos.campoLinha}
            keyboardType="number-pad"
            maxLength={14}
            obrigatorio
            rotulo="CPF"
            onChangeText={(valor) => atualizarCampo('cpf', valor)}
            placeholder="000.000.000-00"
            value={valores.cpf}
          />
          <CampoFormulario
            erro={erros.dataNascimento}
            estilo={estilos.campoLinha}
            keyboardType="number-pad"
            maxLength={10}
            obrigatorio
            rotulo="Nascimento"
            onChangeText={(valor) => atualizarCampo('dataNascimento', valor)}
            placeholder="DD/MM/AAAA"
            value={valores.dataNascimento}
          />
        </View>

        <View style={estilos.linha}>
          <CampoFormulario
            autoComplete="tel"
            erro={erros.celular}
            estilo={estilos.campoLinha}
            keyboardType="phone-pad"
            maxLength={15}
            obrigatorio
            rotulo="Celular"
            onChangeText={(valor) => atualizarCampo('celular', valor)}
            placeholder="(11) 99999-9999"
            value={valores.celular}
          />
          <CampoFormulario
            autoComplete="tel"
            erro={erros.telefone}
            estilo={estilos.campoLinha}
            keyboardType="phone-pad"
            maxLength={14}
            rotulo="Tel. Fixo"
            onChangeText={(valor) => atualizarCampo('telefone', valor)}
            placeholder="(11) 4444-4444"
            value={valores.telefone}
          />
        </View>

        <SeletorGenero
          aoAlterar={(valor) => atualizarCampo('genero', valor)}
          valor={valores.genero}
        />

        <CampoFormulario
          aoAlternarEntradaSegura={alternarVisibilidadeSenha}
          autoCapitalize="none"
          autoComplete="new-password"
          entradaSegura={!senhaVisivel}
          erro={erros.senha}
          keyboardType="number-pad"
          maxLength={6}
          obrigatorio
          rotulo="Criar senha (6 dígitos)"
          onChangeText={(valor) => atualizarCampo('senha', valor.replace(/\D/g, ''))}
          onSubmitEditing={enviar}
          placeholder="••••••"
          returnKeyType="done"
          value={valores.senha}
        />
      </View>

      <View style={estilos.rodape}>
        <BotaoPrincipal aoPressionar={enviar}>CADASTRAR</BotaoPrincipal>
        <Text style={estilos.textoLegal}>
          Ao cadastrar você concorda com nossos{' '}
          <Text accessibilityRole="link" style={estilos.linkLegal}>
            Termos de Uso
          </Text>{' '}
          e{' '}
          <Text accessibilityRole="link" style={estilos.linkLegal}>
            Políticas de Privacidade.
          </Text>
        </Text>
      </View>
    </TelaAutenticacao>
  );
}

const estilos = StyleSheet.create({
  tela: {
    paddingBottom: 10,
  },
  formulario: {
    gap: 16,
    paddingTop: 10,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  campoLinha: {
    flex: 1,
    minWidth: 0,
  },
  rodape: {
    gap: 15,
    marginTop: 'auto',
    paddingTop: 32,
  },
  textoLegal: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
    lineHeight: 15,
    textAlign: 'center',
  },
  linkLegal: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 10,
  },
});
