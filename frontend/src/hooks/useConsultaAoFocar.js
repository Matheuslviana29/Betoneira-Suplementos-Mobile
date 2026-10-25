import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useConsultaAoFocar(consultar, valorInicial) {
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState(valorInicial);
  const [erro, setErro] = useState();

  const recarregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(undefined);
      const result = await consultar();
      setDados(result);
      return result;
    } catch (error) {
      setErro(error.message);
      return null;
    } finally {
      setCarregando(false);
    }
  }, [consultar]);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar]),
  );

  return { carregando, dados, erro, recarregar, setDados };
}
