import { useCallback, useState } from 'react';

import { esquemaCadastro, obterErrosPorCampo } from '../schemas/esquemasAutenticacao';

const somenteDigitos = (valor) => valor.replace(/\D/g, '');

const formatarCpf = (valor) =>
  somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const formatarData = (valor) =>
  somenteDigitos(valor)
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');

const formatarTelefone = (valor) => {
  const digitos = somenteDigitos(valor).slice(0, 11);
  const comCodigoArea = digitos.replace(/^(\d{2})(\d)/, '($1) $2');

  return digitos.length > 10
    ? comCodigoArea.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    : comCodigoArea.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
};

const formatadores = {
  celular: formatarTelefone,
  cpf: formatarCpf,
  dataNascimento: formatarData,
  telefone: formatarTelefone,
};

const valoresIniciais = {
  celular: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  genero: 'masculino',
  nomeCompleto: '',
  senha: '',
  telefone: '',
};

export function useFormularioCadastro() {
  const [valores, definirValores] = useState(valoresIniciais);
  const [erros, definirErros] = useState({});
  const [senhaVisivel, definirSenhaVisivel] = useState(false);

  const atualizarCampo = useCallback((campo, valorBruto) => {
    const valor = formatadores[campo] ? formatadores[campo](valorBruto) : valorBruto;

    definirValores((valoresAtuais) => ({ ...valoresAtuais, [campo]: valor }));
    definirErros((errosAtuais) => ({ ...errosAtuais, [campo]: undefined }));
  }, []);

  const alternarVisibilidadeSenha = useCallback(() => {
    definirSenhaVisivel((visibilidadeAtual) => !visibilidadeAtual);
  }, []);

  const enviar = useCallback(() => {
    const resultado = esquemaCadastro.safeParse(valores);

    if (!resultado.success) {
      const novosErros = obterErrosPorCampo(resultado.error);

      definirErros(novosErros);
      return { erros: novosErros, sucesso: false };
    }

    definirErros({});

    // Conecte a chamada da API de cadastro usando resultado.data.
    console.log('Cadastro pronto para envio', {
      ...resultado.data,
      senha: '[oculta]',
    });

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
