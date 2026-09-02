import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

const opcoes = [
  { rotulo: 'Masculino', valor: 'masculino' },
  { rotulo: 'Feminino', valor: 'feminino' },
  { rotulo: 'Outro', valor: 'outro' },
];

export function SeletorGenero({ aoAlterar, valor }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>Gênero</Text>
      <View accessibilityRole="radiogroup" style={estilos.opcoes}>
        {opcoes.map((opcao) => {
          const selecionado = valor === opcao.valor;

          return (
            <Pressable
              key={opcao.valor}
              accessibilityRole="radio"
              accessibilityState={{ checked: selecionado }}
              onPress={() => aoAlterar(opcao.valor)}
              style={({ pressed }) => [
                estilos.opcao,
                selecionado && estilos.opcaoSelecionada,
                pressed && estilos.opcaoPressionada,
              ]}
            >
              <View style={[estilos.radio, selecionado && estilos.radioSelecionado]}>
                {selecionado ? <View style={estilos.pontoRadio} /> : null}
              </View>
              <Text style={[estilos.rotuloOpcao, selecionado && estilos.rotuloOpcaoSelecionada]}>
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: {
    gap: 6,
  },
  rotulo: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 13,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  opcao: {
    alignItems: 'center',
    borderColor: cores.borda,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  opcaoSelecionada: {
    backgroundColor: '#FFF7ED',
    borderColor: cores.laranja,
  },
  opcaoPressionada: {
    opacity: 0.7,
  },
  radio: {
    alignItems: 'center',
    borderColor: cores.textoSecundario,
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    justifyContent: 'center',
    width: 12,
  },
  radioSelecionado: {
    borderColor: cores.laranja,
  },
  pontoRadio: {
    backgroundColor: cores.laranja,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  rotuloOpcao: {
    color: cores.texto,
    fontFamily: fontes.media,
    fontSize: 11,
  },
  rotuloOpcaoSelecionada: {
    color: cores.laranja,
    fontFamily: fontes.seminegrito,
  },
});
