import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api, setApiSessionToken, setUnauthorizedHandler } from '../services/api';
import { deleteSessionToken, readSessionToken, saveSessionToken } from '../services/sessao';

const AutenticacaoContext = createContext(null);

export function AutenticacaoProvider({ children }) {
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const limparSessao = async () => {
    setApiSessionToken(null);
    setUsuario(null);
    await deleteSessionToken();
  };

  useEffect(() => {
    setUnauthorizedHandler(limparSessao);

    async function restaurarSessao() {
      try {
        const token = await readSessionToken();
        if (!token) return;
        setApiSessionToken(token);
        setUsuario(await api.usuario.perfil());
      } catch {
        await limparSessao();
      } finally {
        setCarregando(false);
      }
    }

    restaurarSessao();
    return () => setUnauthorizedHandler(null);
  }, []);

  const autenticar = async (operation, data) => {
    const result = await operation(data);
    setApiSessionToken(result.token);
    await saveSessionToken(result.token);
    setUsuario(result.usuario);
    return result.usuario;
  };

  const value = useMemo(
    () => ({
      autenticado: Boolean(usuario),
      cadastrar: (data) => autenticar(api.auth.cadastrar, data),
      carregando,
      entrar: (data) => autenticar(api.auth.entrar, data),
      sair: async () => {
        try {
          if (usuario) await api.auth.sair();
        } catch {
          // A sessão local deve ser removida mesmo quando a API estiver indisponível.
        } finally {
          await limparSessao();
        }
      },
      atualizarUsuario: setUsuario,
      usuario,
    }),
    [carregando, usuario],
  );

  return <AutenticacaoContext.Provider value={value}>{children}</AutenticacaoContext.Provider>;
}

export function useAutenticacao() {
  const context = useContext(AutenticacaoContext);
  if (!context) throw new Error('useAutenticacao deve ser usado dentro do provider.');
  return context;
}
