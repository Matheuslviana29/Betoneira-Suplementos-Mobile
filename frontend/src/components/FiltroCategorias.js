import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';
import { categoriasMock } from '../mocks/dadosLoja';

export function FiltroCategorias({ categoriaAtiva, definirCategoriaAtiva, estilo }) {
  return (
    <View style={[estilos.faixa, estilo]}>
      <ScrollView
        contentContainerStyle={estilos.lista}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categoriasMock.map((categoria) => {
          const ativa = categoria === categoriaAtiva;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
              key={categoria}
              onPress={() => definirCategoriaAtiva(categoria)}
              style={({ pressed }) => [
                estilos.categoria,
                ativa && estilos.categoriaAtiva,
                pressed && estilos.pressionado,
              ]}
            >
              <Text style={[estilos.texto, ativa && estilos.textoAtivo]}>{categoria}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    borderBottomColor: cores.laranja,
    borderBottomWidth: 2,
    paddingBottom: 7,
    paddingTop: 5,
  },
  lista: {
    gap: 8,
    paddingHorizontal: 6,
  },
  categoria: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 66,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoriaAtiva: {
    backgroundColor: cores.laranja,
    borderColor: cores.laranja,
  },
  texto: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 10,
    textAlign: 'center',
  },
  textoAtivo: {
    color: '#FFFFFF',
    fontFamily: fontes.negrito,
  },
  pressionado: {
    opacity: 0.6,
  },
});
