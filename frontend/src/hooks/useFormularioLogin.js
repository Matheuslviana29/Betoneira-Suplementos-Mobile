import { useCallback, useState } from 'react';

import { esquemaLogin, obterErrosPorCampo } from '../schemas/esquemasAutenticacao';

export function useFormularioLogin() {
  const [valores, definirValores] = useState({ email: '', senha: '' });
  const [erros, definirErros] = useState({});
  const [senhaVisivel, definirSenhaVisivel] = useState(false);

  const atualizarCampo = useCallback((campo, valor) => {
    definirValores((valoresAtuais) => ({ ...valoresAtuais, [campo]: valor }));
    definirErros((errosAtuais) => ({ ...errosAtuais, [campo]: undefined }));
  }, []);

  const alternarVisibilidadeSenha = useCallback(() => {
    definirSenhaVisivel((visibilidadeAtual) => !visibilidadeAtual);
  }, []);

  const enviar = useCallback(() => {
    const resultado = esquemaLogin.safeParse(valores);

    if (!resultado.success) {
      const novosErros = obterErrosPorCampo(resultado.error);

      definirErros(novosErros);
      return { erros: novosErros, sucesso: false };
    }

    definirErros({});

    // Conecte a chamada da API de autenticação usando resultado.data.
    console.log('Login pronto para envio', { email: resultado.data.email });

    return { dados: resultado.data, sucesso: true };
  }, [valores]);

  return {
    alternarVisibilidadeSenha,
    atualizarCampo,
    enviar,
    erros,
    senhaVisivel,
    valores,
  };
}
