import { Link } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CampoFormulario } from '../components/CampoFormulario';
import { LogoMarca } from '../components/LogoMarca';
import { TelaAutenticacao } from '../components/TelaAutenticacao';
import { cores, fontes } from '../constants/tema';
import { useFormularioLogin } from '../hooks/useFormularioLogin';

export default function TelaLogin() {
  const referenciaSenha = useRef(null);
  const {
    alternarVisibilidadeSenha,
    atualizarCampo,
    enviar,
    erros,
    senhaVisivel,
    valores,
  } = useFormularioLogin();

  return (
    <TelaAutenticacao estiloConteudo={estilos.tela}>
      <View style={estilos.recipienteLogo}>
        <LogoMarca />
      </View>

      <View style={estilos.formulario}>
        <CampoFormulario
          autoCapitalize="none"
          autoComplete="email"
          erro={erros.email}
          keyboardType="email-address"
          rotulo="E-mail"
          onChangeText={(valor) => atualizarCampo('email', valor)}
          onSubmitEditing={() => referenciaSenha.current?.focus()}
          placeholder="atleta@betoneira.com"
          returnKeyType="next"
          value={valores.email}
        />

        <CampoFormulario
          ref={referenciaSenha}
          aoAlternarEntradaSegura={alternarVisibilidadeSenha}
          autoCapitalize="none"
          autoComplete="current-password"
          entradaSegura={!senhaVisivel}
          erro={erros.senha}
          rotulo="Senha"
          onChangeText={(valor) => atualizarCampo('senha', valor)}
          onSubmitEditing={enviar}
          placeholder="••••••••"
          returnKeyType="done"
          value={valores.senha}
        />

        <Pressable accessibilityRole="button" hitSlop={8} style={estilos.botaoEsqueciSenha}>
          <Text style={estilos.linkLaranja}>Esqueci minha senha</Text>
        </Pressable>
      </View>

      <View style={estilos.rodape}>
        <BotaoPrincipal aoPressionar={enviar}>ENTRAR</BotaoPrincipal>
        <View style={estilos.linhaConta}>
          <Text style={estilos.textoSecundario}>Ainda não tem conta? </Text>
          <Link href="/criar-conta" asChild>
            <Pressable hitSlop={8}>
              <Text style={estilos.linkLaranja}>Cadastre-se</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </TelaAutenticacao>
  );
}

const estilos = StyleSheet.create({
  tela: {
    paddingBottom: 10,
  },
  recipienteLogo: {
    alignItems: 'center',
    marginTop: 72,
  },
  formulario: {
    gap: 18,
    marginTop: 64,
  },
  botaoEsqueciSenha: {
    alignSelf: 'flex-end',
    marginTop: -6,
  },
  linkLaranja: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
    fontSize: 12,
  },
  rodape: {
    gap: 22,
    marginTop: 'auto',
    paddingTop: 48,
  },
  linhaConta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textoSecundario: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 12,
  },
});
