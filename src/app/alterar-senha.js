import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CampoFormulario } from '../components/CampoFormulario';
import { cores, dimensoes, fontes } from '../constants/tema';

const valoresIniciais = {
    senhaAtual: 'senha123',
    novaSenha: '',
    confirmacaoSenha: '',
};

export default function TelaAlterarSenha() {
    const roteador = useRouter();
    const referenciaNovaSenha = useRef(null);
    const referenciaConfirmacao = useRef(null);
    const [valores, setValores] = useState(valoresIniciais);
    const [visibilidade, setVisibilidade] = useState({});
    const [erros, setErros] = useState({});

    const atualizarCampo = (campo, valor) => {
        setValores((valoresAtuais) => ({ ...valoresAtuais, [campo]: valor }));
        setErros((errosAtuais) => ({ ...errosAtuais, [campo]: undefined }));
    };

    const alternarVisibilidade = (campo) => {
        setVisibilidade((estadoAtual) => ({
            ...estadoAtual,
            [campo]: !estadoAtual[campo],
        }));
    };

    const voltar = () => {
        if (roteador.canGoBack()) {
            roteador.back();
            return;
        }

        roteador.replace('/');
    };

    const alterarSenha = () => {
        const novosErros = {};

        if (!valores.senhaAtual) {
            novosErros.senhaAtual = 'Informe sua senha atual.';
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(valores.novaSenha)) {
            novosErros.novaSenha = 'Use ao menos 8 caracteres, com letras e números.';
        }

        if (valores.confirmacaoSenha !== valores.novaSenha) {
            novosErros.confirmacaoSenha = 'As senhas não coincidem.';
        }

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros);
            return;
        }

        // Substituir pelo envio à API quando a integração estiver disponível.
        Alert.alert('Senha alterada', 'Sua senha foi alterada com sucesso.');
        setValores((valoresAtuais) => ({
            ...valoresAtuais,
            novaSenha: '',
            confirmacaoSenha: '',
        }));
    };

    return (
        <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={estilos.areaSegura}>
            <View style={estilos.bordaCabecalho}>
                <View style={estilos.conteudoCabecalho}>
                    <CabecalhoTela aoVoltar={voltar} titulo="Alterar Senha" />
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
                    <View style={estilos.conteudo}>
                        <View style={estilos.cartao}>
                            <CampoFormulario
                                aoAlternarEntradaSegura={() => alternarVisibilidade('senhaAtual')}
                                autoCapitalize="none"
                                autoComplete="current-password"
                                entradaSegura={!visibilidade.senhaAtual}
                                erro={erros.senhaAtual}
                                estiloRecipienteEntrada={estilos.entradaCinza}
                                rotulo="Senha Atual"
                                onChangeText={(valor) => atualizarCampo('senhaAtual', valor)}
                                onSubmitEditing={() => referenciaNovaSenha.current?.focus()}
                                returnKeyType="next"
                                value={valores.senhaAtual}
                            />

                            <CampoFormulario
                                ref={referenciaNovaSenha}
                                aoAlternarEntradaSegura={() => alternarVisibilidade('novaSenha')}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                entradaSegura={!visibilidade.novaSenha}
                                erro={erros.novaSenha}
                                estiloRecipienteEntrada={estilos.entradaCinza}
                                rotulo="Nova Senha"
                                onChangeText={(valor) => atualizarCampo('novaSenha', valor)}
                                onSubmitEditing={() => referenciaConfirmacao.current?.focus()}
                                placeholder="Digite a nova senha"
                                returnKeyType="next"
                                value={valores.novaSenha}
                            />

                            <CampoFormulario
                                ref={referenciaConfirmacao}
                                aoAlternarEntradaSegura={() => alternarVisibilidade('confirmacaoSenha')}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                entradaSegura={!visibilidade.confirmacaoSenha}
                                erro={erros.confirmacaoSenha}
                                estiloRecipienteEntrada={estilos.entradaCinza}
                                rotulo="Confirmar Nova Senha"
                                onChangeText={(valor) => atualizarCampo('confirmacaoSenha', valor)}
                                onSubmitEditing={alterarSenha}
                                placeholder="Confirme a nova senha"
                                returnKeyType="done"
                                value={valores.confirmacaoSenha}
                            />

                            <Text style={estilos.ajuda}>
                                A senha deve conter no mínimo 8 caracteres, incluindo letras e números.
                            </Text>
                        </View>

                        <BotaoPrincipal aoPressionar={alterarSenha}>ALTERAR SENHA</BotaoPrincipal>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <BarraNavegacaoInferior ativo="perfil" />
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
    conteudo: {
        gap: 16,
        maxWidth: dimensoes.larguraMaximaConteudo,
        paddingBottom: 28,
        paddingHorizontal: dimensoes.espacamentoHorizontal,
        paddingTop: 16,
        width: '100%',
    },
    cartao: {
        backgroundColor: cores.fundo,
        borderRadius: 12,
        gap: 14,
        padding: 16,
    },
    entradaCinza: {
        backgroundColor: '#F5F6F8',
    },
    ajuda: {
        color: cores.textoSecundario,
        fontFamily: fontes.regular,
        fontSize: 10,
        lineHeight: 15,
    },
});
