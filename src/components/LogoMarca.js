import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function LogoMarca() {
  return (
    <View
      accessible
      accessibilityLabel="Betoneira, força e performance"
      style={estilos.recipiente}
    >
      <View style={estilos.caixaIcone}>
        <MaterialCommunityIcons color="#FFFFFF" name="dumbbell" size={22} />
      </View>

      <View>
        <Text style={estilos.nome}>BETONEIRA</Text>
        <Text style={estilos.slogan}>FORÇA E PERFORMANCE</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  recipiente: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  caixaIcone: {
    alignItems: 'center',
    backgroundColor: cores.laranja,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.preta,
    fontSize: 21,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  slogan: {
    color: cores.laranja,
    fontFamily: fontes.extranegrito,
    fontSize: 7,
    letterSpacing: 0.45,
    lineHeight: 10,
  },
});
