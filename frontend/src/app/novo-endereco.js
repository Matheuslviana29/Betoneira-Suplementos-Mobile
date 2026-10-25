import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BotaoPrincipal } from '../components/BotaoPrincipal';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CampoFormulario } from '../components/CampoFormulario';
import { cores, dimensoes } from '../constants/tema';
import { useAutenticacao } from '../contextos/AutenticacaoContext';
import { api } from '../services/api';
import { formatarCep, somenteDigitos } from '../utils/dadosApi';

export default function TelaNovoEndereco() {
  const roteador = useRouter();
  const { usuario } = useAutenticacao();
  const [enviando, setEnviando] = useState(false);
  const [dados, setDados] = useState({
    apelido: '',
    destinatario: usuario?.nomeCompleto ?? '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const atualizar = (campo, valor) => setDados((current) => ({ ...current, [campo]: valor }));
  const salvar = async () => {
    if (Object.entries(dados).some(([field, value]) => field !== 'complemento' && !value.trim())) {
      Toast.warn('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setEnviando(true);
      await api.enderecos.criar({
        ...dados,
        cep: somenteDigitos(dados.cep),
        complemento: dados.complemento || null,
        referencia: null,
        padrao: true,
      });
      Toast.success('Endereço adicionado.');
      roteador.back();
    } catch (error) {
      Toast.error(error.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <CabecalhoTela aoVoltar={() => roteador.back()} titulo="Novo Endereço" />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={estilos.area}>
        <ScrollView contentContainerStyle={estilos.rolagem} keyboardShouldPersistTaps="handled">
          <View style={estilos.formulario}>
            {[
              ['apelido', 'Apelido', 'Ex.: Casa'],
              ['destinatario', 'Destinatário', 'Nome de quem receberá'],
              ['logradouro', 'Logradouro', 'Rua ou avenida'],
              ['numero', 'Número', '123'],
              ['complemento', 'Complemento', 'Apartamento, bloco...'],
              ['bairro', 'Bairro', 'Seu bairro'],
              ['cidade', 'Cidade', 'Sua cidade'],
            ].map(([campo, rotulo, placeholder]) => (
              <CampoFormulario
                key={campo}
                obrigatorio={campo !== 'complemento'}
                onChangeText={(valor) => atualizar(campo, valor)}
                placeholder={placeholder}
                rotulo={rotulo}
                value={dados[campo]}
              />
            ))}
            <View style={estilos.linha}>
              <CampoFormulario
                estilo={estilos.flex}
                keyboardType="number-pad"
                maxLength={9}
                obrigatorio
                onChangeText={(valor) => atualizar('cep', formatarCep(valor))}
                placeholder="00000-000"
                rotulo="CEP"
                value={dados.cep}
              />
              <CampoFormulario
                autoCapitalize="characters"
                estilo={estilos.uf}
                maxLength={2}
                obrigatorio
                onChangeText={(valor) => atualizar('uf', valor.toUpperCase())}
                placeholder="SP"
                rotulo="UF"
                value={dados.uf}
              />
            </View>
            <BotaoPrincipal carregando={enviando} aoPressionar={salvar}>SALVAR ENDEREÇO</BotaoPrincipal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flex: 1 },
  cabecalho: { alignSelf: 'center', maxWidth: dimensoes.larguraMaximaConteudo, paddingHorizontal: 12, width: '100%' },
  area: { flex: 1 },
  rolagem: { alignItems: 'center', paddingBottom: 28 },
  formulario: { gap: 14, maxWidth: dimensoes.larguraMaximaConteudo, paddingHorizontal: 16, paddingTop: 16, width: '100%' },
  linha: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
  uf: { width: 88 },
});
