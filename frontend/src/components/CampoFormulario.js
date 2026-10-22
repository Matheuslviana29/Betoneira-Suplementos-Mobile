import { Feather } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { cores, fontes } from '../constants/tema';

export const CampoFormulario = forwardRef(function CampoFormulario(
  {
    aoAlternarEntradaSegura,
    entradaSegura = false,
    erro,
    estilo,
    estiloEntrada,
    estiloRecipienteEntrada,
    obrigatorio = false,
    onBlur,
    onFocus,
    rotulo,
    ...propriedadesEntrada
  },
  referencia,
) {
  const [emFoco, setEmFoco] = useState(false);

  const aoFocar = (evento) => {
    setEmFoco(true);
    onFocus?.(evento);
  };

  const aoDesfocar = (evento) => {
    setEmFoco(false);
    onBlur?.(evento);
  };

  return (
    <View style={[estilos.campo, estilo]}>
      <Text style={estilos.rotulo}>
        {rotulo} {obrigatorio ? <Text style={estilos.obrigatorio}>*</Text> : null}
      </Text>

      <View
        style={[
          estilos.recipienteEntrada,
          estiloRecipienteEntrada,
          emFoco && !erro && estilos.entradaEmFoco,
          erro && estilos.entradaComErro,
        ]}
      >
        <TextInput
          ref={referencia}
          dataSet={
            Platform.OS === 'web' && aoAlternarEntradaSegura
              ? { controleSenha: 'personalizado' }
              : undefined
          }
          onBlur={aoDesfocar}
          onFocus={aoFocar}
          placeholderTextColor={cores.textoPlaceholder}
          secureTextEntry={entradaSegura}
          selectionColor={cores.laranja}
          style={[estilos.entrada, estiloEntrada]}
          {...propriedadesEntrada}
        />

        {aoAlternarEntradaSegura ? (
          <Pressable
            accessibilityLabel={entradaSegura ? 'Mostrar senha' : 'Ocultar senha'}
            accessibilityRole="button"
            hitSlop={10}
            onPress={aoAlternarEntradaSegura}
            style={estilos.botaoOlho}
          >
            <Feather
              color={cores.textoSecundario}
              name={entradaSegura ? 'eye' : 'eye-off'}
              size={18}
            />
          </Pressable>
        ) : null}
      </View>

      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
});

const estilos = StyleSheet.create({
  campo: {
    gap: 6,
  },
  rotulo: {
    color: cores.texto,
    fontFamily: fontes.seminegrito,
    fontSize: 13,
  },
  obrigatorio: {
    color: cores.laranja,
  },
  recipienteEntrada: {
    alignItems: 'center',
    backgroundColor: cores.fundoEntrada,
    borderColor: cores.borda,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
  },
  entradaComErro: {
    borderColor: cores.erro,
  },
  entradaEmFoco: {
    borderColor: cores.laranja,
    borderWidth: 2,
  },
  entrada: {
    color: cores.texto,
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  botaoOlho: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    paddingRight: 14,
    width: 42,
  },
  erro: {
    color: cores.erro,
    fontFamily: fontes.regular,
    fontSize: 11,
  },
});
