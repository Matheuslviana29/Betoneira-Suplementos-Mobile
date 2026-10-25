import { Platform } from 'react-native';

const DEFAULT_API_URL = Platform.select({
  android: 'http://10.0.2.2:3333/api/v1',
  default: 'http://localhost:3333/api/v1',
});
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

let sessionToken = null;
let unauthorizedHandler = null;

export class ApiError extends Error {
  constructor(message, { code, details, status } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export function setApiSessionToken(token) {
  sessionToken = token;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function apiRequest(path, { body, method = 'GET' } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        ...(body ? { 'content-type': 'application/json' } : {}),
        ...(sessionToken ? { authorization: `Bearer ${sessionToken}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload = response.status === 204 ? null : await response.json();

    if (!response.ok) {
      if (response.status === 401 && sessionToken) unauthorizedHandler?.();
      throw new ApiError(payload?.erro?.mensagem ?? 'Não foi possível concluir a operação.', {
        code: payload?.erro?.codigo,
        details: payload?.erro?.detalhes,
        status: response.status,
      });
    }

    return payload?.dados ?? payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      throw new ApiError('A API demorou para responder. Tente novamente.');
    }
    throw new ApiError('Não foi possível conectar à API. Verifique se o backend está ativo.');
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  auth: {
    cadastrar: (data) => apiRequest('/auth/cadastro', { method: 'POST', body: data }),
    entrar: (data) => apiRequest('/auth/login', { method: 'POST', body: data }),
    sair: () => apiRequest('/auth/logout', { method: 'POST' }),
  },
  catalogo: {
    categorias: () => apiRequest('/categorias'),
    produtos: () => apiRequest('/produtos?limite=100'),
  },
  usuario: {
    perfil: () => apiRequest('/usuarios/me'),
    atualizar: (data) => apiRequest('/usuarios/me', { method: 'PATCH', body: data }),
    alterarSenha: (data) => apiRequest('/usuarios/me/senha', { method: 'PATCH', body: data }),
  },
  enderecos: {
    listar: () => apiRequest('/enderecos'),
    criar: (data) => apiRequest('/enderecos', { method: 'POST', body: data }),
    atualizar: (id, data) => apiRequest(`/enderecos/${id}`, { method: 'PATCH', body: data }),
    remover: (id) => apiRequest(`/enderecos/${id}`, { method: 'DELETE' }),
  },
  pagamentos: {
    listar: () => apiRequest('/formas-pagamento'),
    criar: (data) => apiRequest('/formas-pagamento', { method: 'POST', body: data }),
    remover: (id) => apiRequest(`/formas-pagamento/${id}`, { method: 'DELETE' }),
  },
  favoritos: {
    listar: () => apiRequest('/favoritos'),
    adicionar: (produtoId) =>
      apiRequest('/favoritos', { method: 'POST', body: { produtoId } }),
    remover: (produtoId) => apiRequest(`/favoritos/${produtoId}`, { method: 'DELETE' }),
  },
  carrinho: {
    obter: () => apiRequest('/carrinho'),
    adicionar: (produtoId, quantidade = 1) =>
      apiRequest('/carrinho/itens', { method: 'POST', body: { produtoId, quantidade } }),
    alterar: (produtoId, quantidade) =>
      apiRequest(`/carrinho/itens/${produtoId}`, {
        method: 'PATCH',
        body: { quantidade },
      }),
    remover: (produtoId) => apiRequest(`/carrinho/itens/${produtoId}`, { method: 'DELETE' }),
  },
  pedidos: {
    listar: () => apiRequest('/pedidos'),
    criar: (data) => apiRequest('/pedidos', { method: 'POST', body: data }),
  },
};
