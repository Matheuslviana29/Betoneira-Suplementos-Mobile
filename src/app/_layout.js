import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Poppins_800ExtraBold } from '@expo-google-fonts/poppins/800ExtraBold';
import { Poppins_900Black } from '@expo-google-fonts/poppins/900Black';
import { useFonts } from '@expo-google-fonts/poppins/useFonts';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { cores } from '../constants/tema';

export default function LayoutRaiz() {
  const [fontesCarregadas, erroFontes] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  if (erroFontes) {
    throw erroFontes;
  }

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <>
      <StatusBar backgroundColor={cores.fundo} style="dark" />
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: cores.fundo },
          headerShown: false,
        }}
      />
    </>
  );
}
