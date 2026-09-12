import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

import { BarraNavegacaoInferior } from '../components/BarraNavegacaoInferior';
import { ItemMenuPerfil } from '../components/ItemMenuPerfil';
import { cores, dimensoes, fontes } from '../constants/tema';
import { dadosUsuarioMock } from '../mocks/dadosUsuario';

const itensConta = [
  { destino: '/meus-dados', icone: 'user', id: 'dados', rotulo: 'Meus Dados' },
  { destino: '/pedidos', icone: 'package', id: 'pedidos', rotulo: 'Pedidos' },
  { destino: '/favoritos', icone: 'heart', id: 'favoritos', rotulo: 'Favoritos' },
  {
    destino: '/endereco-entrega',
    icone: 'map-pin',
    id: 'enderecos',
    rotulo: 'Endereços de Entrega',
  },
  {
    destino: '/forma-pagamento',
    icone: 'credit-card',
    id: 'pagamento',
    rotulo: 'Formas de Pagamento',
  },
];

const itensSeguranca = [
  { destino: '/alterar-senha', icone: 'lock', id: 'senha', rotulo: 'Alterar Senha' },
];

export default function TelaPerfil() {
  const roteador = useRouter();
  const versao = Constants.expoConfig?.version ?? '1.0.0';

  const abrirItem = (item) => {
    if (item.destino) {
      roteador.push(item.destino);
      return;
    }

    Alert.alert(item.rotulo, 'Esta área será conectada aqui em uma próxima etapa.');
  };

  const adicionarFoto = () => {
    Alert.alert('Foto de perfil', 'A seleção de uma foto será conectada aqui.');
  };

  const sair = () => {
    Toast.info('Sessão encerrada.');
    roteador.replace('/login');
  };

  const renderizarGrupo = (itens) => (
    <View style={estilos.grupo}>
      {itens.map((item, indice) => (
        <ItemMenuPerfil
          aoPressionar={() => abrirItem(item)}
          icone={item.icone}
          key={item.id}
          rotulo={item.rotulo}
          ultimo={indice === itens.length - 1}
        />
      ))}
    </View>
  );

  return (
    <View style={estilos.tela}>
      <StatusBar backgroundColor={cores.fundoPagina} style="dark" />

      <SafeAreaView edges={['top', 'left', 'right']} style={estilos.areaConteudo}>
        <ScrollView
          bounces={false}
          contentContainerStyle={estilos.conteudoRolagem}
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.conteudo}>
            <View style={estilos.cabecalhoPerfil}>
              <View style={estilos.recipienteAvatar}>
                <View style={estilos.avatar}>
                  <Feather color={cores.textoPlaceholder} name="user" size={48} />
                </View>
                <Pressable
                  accessibilityLabel="Adicionar foto de perfil"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={adicionarFoto}
                  style={({ pressed }) => [
                    estilos.botaoFoto,
                    pressed && estilos.botaoFotoPressionado,
                  ]}
                >
                  <Feather color="#FFFFFF" name="plus" size={13} />
                </Pressable>
              </View>

              <Text style={estilos.nome}>{dadosUsuarioMock.nomeCompleto}</Text>
              <Text style={estilos.email}>{dadosUsuarioMock.email}</Text>
            </View>

            {renderizarGrupo(itensConta)}

            <View style={estilos.secaoSeguranca}>
              <Text style={estilos.tituloSecao}>SEGURANÇA</Text>
              {renderizarGrupo(itensSeguranca)}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={sair}
              style={({ pressed }) => [estilos.botaoSair, pressed && estilos.botaoSairPressionado]}
            >
              <Text style={estilos.textoSair}>SAIR</Text>
            </Pressable>

            <Text style={estilos.versao}>v. {versao}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

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
  areaConteudo: {
    flex: 1,
  },
  conteudoRolagem: {
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: 14,
  },
  conteudo: {
    maxWidth: dimensoes.larguraMaximaConteudo,
    paddingHorizontal: 10,
    width: '100%',
  },
  cabecalhoPerfil: {
    alignItems: 'center',
    paddingBottom: 22,
    paddingTop: 28,
  },
  recipienteAvatar: {
    height: 92,
    position: 'relative',
    width: 92,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E4E7EC',
    borderRadius: 46,
    height: 92,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 92,
  },
  botaoFoto: {
    alignItems: 'center',
    backgroundColor: cores.laranja,
    borderColor: cores.fundoPagina,
    borderRadius: 16,
    borderWidth: 3,
    bottom: -1,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: -1,
    width: 30,
  },
  botaoFotoPressionado: {
    backgroundColor: cores.laranjaPressionado,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 16,
    marginTop: 12,
  },
  email: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
    marginTop: 1,
  },
  grupo: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  secaoSeguranca: {
    marginTop: 18,
  },
  tituloSecao: {
    color: cores.textoSecundario,
    fontFamily: fontes.seminegrito,
    fontSize: 9,
    marginBottom: 7,
    marginLeft: 1,
  },
  botaoSair: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 24,
  },
  botaoSairPressionado: {
    backgroundColor: cores.fundoPagina,
  },
  textoSair: {
    color: cores.texto,
    fontFamily: fontes.negrito,
    fontSize: 11,
  },
  versao: {
    color: cores.textoPlaceholder,
    fontFamily: fontes.regular,
    fontSize: 8,
    marginTop: 7,
    textAlign: 'center',
  },
  areaNavegacao: {
    backgroundColor: cores.fundo,
  },
});
