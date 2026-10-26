import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BotaoPrincipal } from '../../../components/BotaoPrincipal';
import { CabecalhoTela } from '../../../components/CabecalhoTela';
import { CampoFormulario } from '../../../components/CampoFormulario';
import { cores, dimensoes, fontes } from '../../../constants/tema';
import { api } from '../../../services/api';
import { somenteDigitos } from '../../../utils/dadosApi';

export default function TelaNovaFormaPagamento() {
  const roteador = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [dados, setDados] = useState({
    apelido: 'Principal',
    bandeira: 'Visa',
    ultimosDigitos: '',
    mesExpiracao: '',
    anoExpiracao: '',
  });
  const atualizar = (campo, valor) => setDados((current) => ({ ...current, [campo]: valor }));

  const salvar = async () => {
    if (!/^\d{4}$/.test(dados.ultimosDigitos)) {
      Toast.warn('Informe os quatro últimos dígitos.');
      return;
    }

    try {
      setEnviando(true);
      await api.pagamentos.criar({
        ...dados,
        mesExpiracao: Number(dados.mesExpiracao),
        anoExpiracao: Number(dados.anoExpiracao),
        tokenGateway: null,
        padrao: true,
      });
      Toast.success('Forma de pagamento adicionada.');
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
        <CabecalhoTela aoVoltar={() => roteador.back()} titulo="Nova Forma de Pagamento" />
      </View>
      <View style={estilos.formulario}>
        <Text style={estilos.aviso}>
          Cadastro simplificado para testes. Nenhum número completo ou código de segurança é armazenado.
        </Text>
        <CampoFormulario onChangeText={(v) => atualizar('apelido', v)} rotulo="Apelido" value={dados.apelido} />
        <CampoFormulario onChangeText={(v) => atualizar('bandeira', v)} obrigatorio rotulo="Bandeira" value={dados.bandeira} />
        <CampoFormulario
          keyboardType="number-pad"
          maxLength={4}
          obrigatorio
          onChangeText={(v) => atualizar('ultimosDigitos', somenteDigitos(v).slice(0, 4))}
          placeholder="1234"
          rotulo="Últimos quatro dígitos"
          value={dados.ultimosDigitos}
        />
        <View style={estilos.linha}>
          <CampoFormulario
            estilo={estilos.flex}
            keyboardType="number-pad"
            maxLength={2}
            obrigatorio
            onChangeText={(v) => atualizar('mesExpiracao', somenteDigitos(v).slice(0, 2))}
            placeholder="12"
            rotulo="Mês"
            value={dados.mesExpiracao}
          />
          <CampoFormulario
            estilo={estilos.flex}
            keyboardType="number-pad"
            maxLength={4}
            obrigatorio
            onChangeText={(v) => atualizar('anoExpiracao', somenteDigitos(v).slice(0, 4))}
            placeholder="2030"
            rotulo="Ano"
            value={dados.anoExpiracao}
          />
        </View>
        <BotaoPrincipal carregando={enviando} aoPressionar={salvar}>SALVAR FORMA DE PAGAMENTO</BotaoPrincipal>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { backgroundColor: cores.fundo, flex: 1 },
  cabecalho: { alignSelf: 'center', maxWidth: dimensoes.larguraMaximaConteudo, paddingHorizontal: 12, width: '100%' },
  formulario: { alignSelf: 'center', gap: 14, maxWidth: dimensoes.larguraMaximaConteudo, padding: 16, width: '100%' },
  aviso: { color: cores.textoSecundario, fontFamily: fontes.regular, fontSize: 11, lineHeight: 17 },
  linha: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
});
