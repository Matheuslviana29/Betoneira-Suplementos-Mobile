import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function LogoMarca({ clara = false, compacta = false }) {
  return (
    <View
      accessible
      accessibilityLabel="Betoneira, força e performance"
      style={estilos.recipiente}
    >
      <View style={[estilos.caixaIcone, compacta && estilos.caixaIconeCompacta]}>
        <MaterialCommunityIcons
          color="#FFFFFF"
          name="dumbbell"
          size={compacta ? 16 : 22}
        />
      </View>

      <View>
        <Text
          style={[
            estilos.nome,
            clara && estilos.nomeClaro,
            compacta && estilos.nomeCompacto,
          ]}
        >
          BETONEIRA
        </Text>
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
  caixaIconeCompacta: {
    borderRadius: 6,
    height: 26,
    width: 26,
  },
  nome: {
    color: cores.texto,
    fontFamily: fontes.preta,
    fontSize: 21,
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  nomeClaro: {
    color: '#FFFFFF',
  },
  nomeCompacto: {
    fontSize: 19,
    lineHeight: 20,
  },
  slogan: {
    color: cores.laranja,
    fontFamily: fontes.extranegrito,
    fontSize: 7,
    letterSpacing: 0.45,
    lineHeight: 10,
  },
});
