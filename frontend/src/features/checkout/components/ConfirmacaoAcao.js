import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../../../constants/tema';

export function ConfirmacaoAcao({
  acaoSecundaria,
  aoCancelar,
  aoConfirmar,
  descricao,
  rotuloConfirmar = 'Excluir',
  rotuloSecundario,
  titulo,
  visivel,
}) {
  return (
    <Modal animationType="fade" onRequestClose={aoCancelar} transparent visible={visivel}>
      <View style={estilos.fundo}>
        <View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={estilos.dialogo}
        >
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.descricao}>{descricao}</Text>
          <View style={estilos.acoes}>
            {acaoSecundaria && rotuloSecundario ? (
              <Pressable
                accessibilityRole="button"
                onPress={acaoSecundaria}
                style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
              >
                <Text style={estilos.rotuloSecundario}>{rotuloSecundario}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={aoCancelar}
              style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
            >
              <Text style={estilos.rotuloCancelar}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={aoConfirmar}
              style={({ pressed }) => [
                estilos.botao,
                estilos.botaoDestrutivo,
                pressed && estilos.pressionado,
              ]}
            >
              <Text style={estilos.rotuloDestrutivo}>{rotuloConfirmar}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  dialogo: {
    backgroundColor: cores.fundo,
    borderRadius: 14,
    maxWidth: 420,
    padding: 20,
    width: '100%',
  },
  titulo: { color: cores.texto, fontFamily: fontes.negrito, fontSize: 16 },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  botao: {
    alignItems: 'center',
    borderColor: cores.borda,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 14,
  },
  botaoDestrutivo: { borderColor: cores.erro },
  rotuloCancelar: { color: cores.texto, fontFamily: fontes.seminegrito, fontSize: 11 },
  rotuloSecundario: { color: cores.laranja, fontFamily: fontes.seminegrito, fontSize: 11 },
  rotuloDestrutivo: { color: cores.erro, fontFamily: fontes.seminegrito, fontSize: 11 },
  pressionado: { opacity: 0.55 },
});
