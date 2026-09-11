import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function BarraBuscaProdutos({ busca, definirBusca, estilo }) {
  const [emFoco, setEmFoco] = useState(false);

  return (
    <View style={[estilos.recipiente, emFoco && estilos.recipienteEmFoco, estilo]}>
      <Feather color={cores.textoPlaceholder} name="search" size={20} />
      <TextInput
        accessibilityLabel="Buscar produtos"
        autoCapitalize="none"
        onBlur={() => setEmFoco(false)}
        onChangeText={definirBusca}
        onFocus={() => setEmFoco(true)}
        placeholder="O que você está procurando?"
        placeholderTextColor={cores.textoPlaceholder}
        returnKeyType="search"
        style={estilos.entrada}
        value={busca}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  recipiente: {
    alignItems: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    height: 46,
    paddingHorizontal: 13,
  },
  recipienteEmFoco: {
    borderColor: cores.laranja,
    borderWidth: 2,
  },
  entrada: {
    color: cores.texto,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 12,
    height: '100%',
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});
