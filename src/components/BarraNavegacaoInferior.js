import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

const itens = [
  { icone: 'home', id: 'inicio', rotulo: 'Início' },
  { icone: 'grid', id: 'produtos', rotulo: 'Produtos' },
  { icone: 'shopping-cart', id: 'carrinho', rotulo: 'Carrinho' },
  { icone: 'user', id: 'perfil', rotulo: 'Perfil' },
];

export function BarraNavegacaoInferior({ ativo = 'inicio', aoSelecionar }) {
  return (
    <View accessibilityRole="tablist" style={estilos.barra}>
      {itens.map((item) => {
        const estaAtivo = item.id === ativo;
        const cor = estaAtivo ? cores.laranja : cores.texto;

        return (
          <Pressable
            accessibilityLabel={item.rotulo}
            accessibilityRole="tab"
            accessibilityState={{ selected: estaAtivo }}
            key={item.id}
            onPress={() => aoSelecionar?.(item.id)}
            style={({ pressed }) => [estilos.item, pressed && estilos.itemPressionado]}
          >
            <Feather color={cor} name={item.icone} size={20} />
            <Text style={[estilos.rotulo, { color: cor }, estaAtivo && estilos.rotuloAtivo]}>
              {item.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    backgroundColor: cores.fundo,
    borderTopColor: cores.borda,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 68,
    paddingBottom: 4,
    paddingTop: 8,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  itemPressionado: {
    opacity: 0.55,
  },
  rotulo: {
    fontFamily: fontes.media,
    fontSize: 9,
  },
  rotuloAtivo: {
    fontFamily: fontes.seminegrito,
  },
});
