import { Redirect } from 'expo-router';

import { useAutenticacao } from '../contextos/AutenticacaoContext';

export default function RotaInicial() {
  const { autenticado, carregando } = useAutenticacao();

  if (carregando) return null;
  return <Redirect href={autenticado ? '/home' : '/login'} />;
}
