import { z } from 'zod';

const somenteDigitos = (valor) => valor.replace(/\D/g, '');

function cpfValido(valor) {
  const cpf = somenteDigitos(valor);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calcularDigito = (tamanho) => {
    const soma = cpf
      .slice(0, tamanho)
      .split('')
      .reduce(
        (total, digito, indice) => total + Number(digito) * (tamanho + 1 - indice),
        0,
      );
    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };

  return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
}

function dataNascimentoValida(valor) {
  const [dia, mes, ano] = valor.split('/').map(Number);

  if (!dia || !mes || !ano) return false;

  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  const anoMinimo = hoje.getFullYear() - 120;

  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia &&
    ano >= anoMinimo &&
    data <= hoje
  );
}

const esquemaEmail = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .email('Informe um e-mail válido.')
  .transform((email) => email.toLowerCase());

export const esquemaLogin = z.object({
  email: esquemaEmail,
  senha: z.string().min(1, 'Informe sua senha.'),
});

export const esquemaCadastro = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.')
    .refine((nome) => nome.split(/\s+/).length >= 2, 'Informe nome e sobrenome.'),
  email: esquemaEmail,
  cpf: z
    .string()
    .min(1, 'Informe seu CPF.')
    .refine(cpfValido, 'Informe um CPF válido.')
    .transform(somenteDigitos),
  dataNascimento: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Informe a data no formato DD/MM/AAAA.')
    .refine(dataNascimentoValida, 'Informe uma data de nascimento válida.'),
  celular: z
    .string()
    .min(1, 'Informe seu celular.')
    .refine((valor) => somenteDigitos(valor).length === 11, 'Informe um celular com DDD.')
    .transform(somenteDigitos),
  telefone: z
    .string()
    .refine(
      (valor) => valor.length === 0 || somenteDigitos(valor).length === 10,
      'Informe um telefone fixo com DDD.',
    )
    .transform((valor) => (valor ? somenteDigitos(valor) : undefined)),
  genero: z.enum(['masculino', 'feminino', 'outro'], {
    error: 'Selecione uma opção de gênero.',
  }),
  senha: z.string().regex(/^\d{6}$/, 'A senha deve conter exatamente 6 dígitos.'),
});

export function obterErrosPorCampo(erroZod) {
  return erroZod.issues.reduce((erros, problema) => {
    const campo = problema.path[0];

    if (typeof campo === 'string' && !erros[campo]) {
      erros[campo] = problema.message;
    }

    return erros;
  }, {});
}
