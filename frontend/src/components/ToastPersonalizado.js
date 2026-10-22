import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

const aparencias = {
  default: { cor: cores.laranja, icone: 'bell' },
  error: { cor: cores.erro, icone: 'alert-circle' },
  info: { cor: '#1570EF', icone: 'info' },
  success: { cor: cores.sucesso, icone: 'check-circle' },
  warn: { cor: '#F79009', icone: 'alert-triangle' },
};

export function ToastPersonalizado({
  barWidth,
  showProgressBar,
  text1,
  text2,
  type = 'default',
}) {
  const progressoEntrada = useRef(new Animated.Value(0)).current;
  const aparencia = aparencias[type] ?? aparencias.default;

  useEffect(() => {
    progressoEntrada.setValue(0);

    const animacao = Animated.spring(progressoEntrada, {
      damping: 17,
      mass: 0.75,
      stiffness: 220,
      toValue: 1,
      useNativeDriver: true,
    });

    animacao.start();

    return () => animacao.stop();
  }, [progressoEntrada, text1, type]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        estilos.toast,
        {
          opacity: progressoEntrada,
          transform: [
            {
              translateY: progressoEntrada.interpolate({
                inputRange: [0, 1],
                outputRange: [-18, 0],
              }),
            },
            {
              scale: progressoEntrada.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[estilos.recipienteIcone, { backgroundColor: `${aparencia.cor}18` }]}>
        <Feather color={aparencia.cor} name={aparencia.icone} size={17} />
      </View>

      <View style={estilos.conteudo}>
        <Text numberOfLines={2} style={estilos.titulo}>
          {text1}
        </Text>
        {text2 ? (
          <Text numberOfLines={2} style={estilos.descricao}>
            {text2}
          </Text>
        ) : null}
      </View>

      {showProgressBar && barWidth ? (
        <View style={estilos.trilhoProgresso}>
          <Animated.View
            style={[
              estilos.progresso,
              {
                backgroundColor: aparencia.cor,
                width: barWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      ) : null}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  toast: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5,
    flexDirection: 'row',
    gap: 9,
    maxWidth: 360,
    minHeight: 48,
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    width: '84%',
  },
  recipienteIcone: {
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  conteudo: {
    flex: 1,
    paddingRight: 2,
  },
  titulo: {
    color: cores.texto,
    fontFamily: fontes.media,
    fontSize: 11,
    lineHeight: 15,
  },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: fontes.regular,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 1,
  },
  trilhoProgresso: {
    backgroundColor: '#F2F4F7',
    bottom: 0,
    height: 2,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
  },
  progresso: {
    height: '100%',
  },
});
