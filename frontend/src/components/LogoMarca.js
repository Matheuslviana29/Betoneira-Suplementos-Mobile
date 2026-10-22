import { Image, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export function LogoMarca({ ampliada = false, clara = false, compacta = false }) {
  return (
    <View
      accessible
      accessibilityLabel="Betoneira, força e performance"
      style={[estilos.recipiente, ampliada && estilos.recipienteAmpliado]}
    >
      <Image
        resizeMode="contain"
        source={require('../../assets/images/logo-betoneira.png')}
        style={[
          estilos.imagem,
          ampliada && estilos.imagemAmpliada,
          compacta && estilos.imagemCompacta,
        ]}
      />

      <View>
        <Text
          style={[
            estilos.nome,
            clara && estilos.nomeClaro,
            ampliada && estilos.nomeAmpliado,
            compacta && estilos.nomeCompacto,
          ]}
        >
          BETONEIRA
        </Text>
        <Text style={[estilos.slogan, ampliada && estilos.sloganAmpliado]}>
          FORÇA E PERFORMANCE
        </Text>
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
  recipienteAmpliado: {
    gap: 10,
  },
  imagem: {
    aspectRatio: 99 / 95,
    width: 34,
  },
  imagemAmpliada: {
    width: 48,
  },
  imagemCompacta: {
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
  nomeAmpliado: {
    fontSize: 23,
    lineHeight: 24,
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
  sloganAmpliado: {
    fontSize: 8,
    lineHeight: 11,
  },
});
