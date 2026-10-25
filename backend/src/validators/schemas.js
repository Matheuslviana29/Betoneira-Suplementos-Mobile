import { z } from 'zod';

const digitsOnly = (value) => value.replace(/\D/g, '');
function isValidCpf(value) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length) => {
    const sum = cpf
      .slice(0, length)
      .split('')
      .reduce((total, digit, index) => total + Number(digit) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

function normalizeDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}

function isValidBirthDate(value) {
  const normalized = normalizeDate(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;
  const [year, month, day] = normalized.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    year >= today.getUTCFullYear() - 120 &&
    date <= today
  );
}
const optionalText = (maximum) =>
  z
    .string()
    .trim()
    .max(maximum)
    .nullable()
    .optional()
    .transform((value) => value || null);

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive('O identificador deve ser positivo.'),
});

export const productParamsSchema = z.object({
  identificador: z.string().trim().min(1).max(120),
});

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter ao menos 8 caracteres.')
  .max(72, 'A senha deve ter no máximo 72 caracteres.')
  .regex(/[A-Za-zÀ-ÿ]/, 'A senha deve conter ao menos uma letra.')
  .regex(/\d/, 'A senha deve conter ao menos um número.');

export const registrationSchema = z.object({
  nomeCompleto: z.string().trim().min(3).max(120),
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  cpf: z
    .string()
    .refine(isValidCpf, 'Informe um CPF válido.')
    .transform(digitsOnly),
  dataNascimento: z
    .string()
    .refine(isValidBirthDate, 'Informe uma data de nascimento válida.')
    .transform(normalizeDate),
  celular: z.string().transform(digitsOnly).pipe(z.string().min(10).max(11)),
  telefone: z
    .string()
    .optional()
    .transform((value) => (value ? digitsOnly(value) : null))
    .pipe(z.string().min(10).max(11).nullable()),
  genero: z.enum(['masculino', 'feminino', 'outro']),
  senha: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email().max(254).transform((value) => value.toLowerCase()),
  senha: z.string().min(1).max(72),
});

export const updateUserSchema = registrationSchema
  .omit({ senha: true, cpf: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Informe ao menos um campo.');

export const changePasswordSchema = z
  .object({ senhaAtual: z.string().min(1).max(72), novaSenha: passwordSchema })
  .refine((data) => data.senhaAtual !== data.novaSenha, {
    message: 'A nova senha deve ser diferente da senha atual.',
    path: ['novaSenha'],
  });

export const productQuerySchema = z.object({
  busca: z.string().trim().max(100).optional(),
  categoria: z.string().trim().max(80).optional(),
  destaque: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().min(1).max(100).default(20),
});

export const addressSchema = z.object({
  apelido: z.string().trim().min(1).max(40),
  destinatario: z.string().trim().min(3).max(120),
  cep: z.string().transform(digitsOnly).pipe(z.string().length(8)),
  logradouro: z.string().trim().min(2).max(150),
  numero: z.string().trim().min(1).max(20),
  complemento: optionalText(80),
  bairro: z.string().trim().min(2).max(80),
  cidade: z.string().trim().min(2).max(80),
  uf: z.string().trim().length(2).transform((value) => value.toUpperCase()),
  referencia: optionalText(150),
  padrao: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Informe ao menos um campo.');

export const favoriteSchema = z.object({ produtoId: z.number().int().positive() });
export const cartItemSchema = z.object({
  produtoId: z.number().int().positive(),
  quantidade: z.number().int().min(1).max(99),
});
export const updateCartItemSchema = z.object({ quantidade: z.number().int().min(1).max(99) });
export const productIdParamsSchema = z.object({
  produtoId: z.coerce.number().int().positive(),
});

export const paymentMethodSchema = z.object({
  apelido: optionalText(40),
  bandeira: z.string().trim().min(2).max(30),
  ultimosDigitos: z.string().regex(/^\d{4}$/),
  mesExpiracao: z.number().int().min(1).max(12),
  anoExpiracao: z.number().int().min(new Date().getFullYear()).max(2200),
  tokenGateway: optionalText(255),
  padrao: z.boolean().default(false),
});

export const orderSchema = z.object({
  enderecoId: z.number().int().positive(),
  formaPagamentoId: z.number().int().positive(),
});
