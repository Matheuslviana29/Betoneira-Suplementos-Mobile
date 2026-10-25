import { AppError } from '../errors/app-error.js';
import {
  mapAddress,
  mapOrder,
  mapPaymentMethod,
  mapProduct,
  mapUser,
} from '../utils/mappers.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createSessionToken, hashSessionToken } from '../utils/token.js';

const SHIPPING_IN_CENTS = 1500;

function notFound(resource) {
  return new AppError(`${resource} não encontrado.`, {
    statusCode: 404,
    code: 'RECURSO_NAO_ENCONTRADO',
  });
}

function formatCart(cart, items) {
  const formattedItems = items.map((item) => ({
    id: item.pk_id,
    produtoId: item.fk_produto,
    nome: item.nome,
    slug: item.slug,
    subtitulo: item.subtitulo,
    precoUnitarioCentavos: item.preco_centavos,
    quantidade: item.quantidade,
    estoqueDisponivel: item.estoque,
    imagemUri: item.imagem_uri,
    subtotalCentavos: item.preco_centavos * item.quantidade,
  }));
  const subtotal = formattedItems.reduce((sum, item) => sum + item.subtotalCentavos, 0);
  const shipping = formattedItems.length > 0 ? SHIPPING_IN_CENTS : 0;

  return {
    id: cart.pk_id,
    itens: formattedItems,
    resumo: {
      quantidadeItens: formattedItems.reduce((sum, item) => sum + item.quantidade, 0),
      subtotalCentavos: subtotal,
      freteCentavos: shipping,
      totalCentavos: subtotal + shipping,
    },
  };
}

export function createServices({ database, repositories, sessionDurationDays }) {
  const auth = {
    async register(data) {
      if (repositories.users.findByEmail(data.email)) {
        throw new AppError('Já existe uma conta com este e-mail.', {
          statusCode: 409,
          code: 'EMAIL_JA_CADASTRADO',
        });
      }

      if (repositories.users.findByCpf(data.cpf)) {
        throw new AppError('Já existe uma conta com este CPF.', {
          statusCode: 409,
          code: 'CPF_JA_CADASTRADO',
        });
      }

      const passwordHash = await hashPassword(data.senha);
      const user = repositories.users.create({ ...data, senhaHash: passwordHash });
      const session = this.createSession(user.pk_id);

      return { usuario: mapUser(user), ...session };
    },

    async login({ email, senha }) {
      const user = repositories.users.findByEmail(email);

      if (!user || !user.ativo || !(await verifyPassword(senha, user.senha_hash))) {
        throw new AppError('E-mail ou senha inválidos.', {
          statusCode: 401,
          code: 'CREDENCIAIS_INVALIDAS',
        });
      }

      return { usuario: mapUser(user), ...this.createSession(user.pk_id) };
    },

    createSession(userId) {
      const token = createSessionToken();
      const tokenHash = hashSessionToken(token);
      const expiresAt = new Date(
        Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000,
      ).toISOString();

      repositories.sessions.create({ userId, tokenHash, expiresAt });
      return { token, expiraEm: expiresAt };
    },

    authenticate(token) {
      const session = repositories.sessions.findActiveByTokenHash(hashSessionToken(token));

      if (!session) {
        throw new AppError('Sessão inválida ou expirada.', {
          statusCode: 401,
          code: 'SESSAO_INVALIDA',
        });
      }

      repositories.sessions.touch(session.sessao_id);
      return {
        sessionId: session.sessao_id,
        userId: session.fk_usuario,
        user: mapUser(session),
        token,
      };
    },

    logout(token) {
      repositories.sessions.deleteByTokenHash(hashSessionToken(token));
    },
  };

  const catalog = {
    listCategories() {
      return repositories.catalog.listCategories().map((row) => ({
        id: row.pk_id,
        nome: row.nome,
        slug: row.slug,
        ordemExibicao: row.ordem_exibicao,
      }));
    },

    listProducts(query) {
      const result = repositories.catalog.listProducts({
        search: query.busca,
        category: query.categoria,
        featured: query.destaque,
        page: query.pagina,
        limit: query.limite,
      });

      return {
        dados: result.items.map(mapProduct),
        paginacao: {
          pagina: query.pagina,
          limite: query.limite,
          totalItens: result.total,
          totalPaginas: Math.ceil(result.total / query.limite),
        },
      };
    },

    getProduct(identifier) {
      const product = repositories.catalog.findProduct(identifier);
      if (!product) throw notFound('Produto');
      return mapProduct(product);
    },
  };

  const users = {
    getProfile(userId) {
      const user = repositories.users.findById(userId);
      if (!user) throw notFound('Usuário');
      return mapUser(user);
    },

    updateProfile(userId, data) {
      if (data.email) {
        const owner = repositories.users.findByEmail(data.email);
        if (owner && owner.pk_id !== userId) {
          throw new AppError('Este e-mail já está em uso.', {
            statusCode: 409,
            code: 'EMAIL_JA_CADASTRADO',
          });
        }
      }

      return mapUser(repositories.users.update(userId, data));
    },

    async changePassword(userId, { senhaAtual, novaSenha }) {
      const user = repositories.users.findById(userId);

      if (!user || !(await verifyPassword(senhaAtual, user.senha_hash))) {
        throw new AppError('A senha atual está incorreta.', {
          statusCode: 422,
          code: 'SENHA_ATUAL_INCORRETA',
        });
      }

      repositories.users.updatePassword(userId, await hashPassword(novaSenha));
      repositories.sessions.deleteAllByUserId(userId);
    },
  };

  const addresses = {
    list(userId) {
      return repositories.customers.listAddresses(userId).map(mapAddress);
    },
    create(userId, data) {
      return mapAddress(repositories.customers.createAddress(userId, data));
    },
    update(userId, id, data) {
      if (!repositories.customers.findAddress(userId, id)) throw notFound('Endereço');
      return mapAddress(repositories.customers.updateAddress(userId, id, data));
    },
    delete(userId, id) {
      const result = repositories.customers.deleteAddress(userId, id);
      if (result.changes === 0) throw notFound('Endereço');
    },
  };

  const payments = {
    list(userId) {
      return repositories.customers.listPaymentMethods(userId).map(mapPaymentMethod);
    },
    create(userId, data) {
      const now = new Date();
      const isExpired =
        data.anoExpiracao < now.getFullYear() ||
        (data.anoExpiracao === now.getFullYear() && data.mesExpiracao < now.getMonth() + 1);

      if (isExpired) {
        throw new AppError('A forma de pagamento está vencida.', {
          statusCode: 422,
          code: 'FORMA_PAGAMENTO_VENCIDA',
        });
      }

      return mapPaymentMethod(repositories.customers.createPaymentMethod(userId, data));
    },
    delete(userId, id) {
      const result = repositories.customers.deletePaymentMethod(userId, id);
      if (result.changes === 0) throw notFound('Forma de pagamento');
    },
  };

  const favorites = {
    list(userId) {
      return repositories.customers.listFavorites(userId).map(mapProduct);
    },
    add(userId, productId) {
      const product = repositories.catalog.findProductById(productId);
      if (!product) throw notFound('Produto');
      repositories.customers.addFavorite(userId, productId);
      return mapProduct(product);
    },
    delete(userId, productId) {
      const result = repositories.customers.deleteFavorite(userId, productId);
      if (result.changes === 0) throw notFound('Favorito');
    },
  };

  const carts = {
    get(userId) {
      const cart = repositories.carts.getOrCreateActiveCart(userId);
      return formatCart(cart, repositories.carts.listItems(cart.pk_id));
    },
    addItem(userId, { produtoId, quantidade }) {
      const product = repositories.catalog.findProductById(produtoId);
      if (!product) throw notFound('Produto');
      const cart = repositories.carts.getOrCreateActiveCart(userId);
      const currentItem = repositories.carts.findItem(cart.pk_id, produtoId);
      const finalQuantity = (currentItem?.quantidade ?? 0) + quantidade;

      if (finalQuantity > product.estoque) {
        throw new AppError('Quantidade maior que o estoque disponível.', {
          statusCode: 422,
          code: 'ESTOQUE_INSUFICIENTE',
        });
      }

      repositories.carts.addItem(cart.pk_id, produtoId, quantidade);
      return this.get(userId);
    },
    updateItem(userId, productId, quantity) {
      const product = repositories.catalog.findProductById(productId);
      if (!product) throw notFound('Produto');
      if (quantity > product.estoque) {
        throw new AppError('Quantidade maior que o estoque disponível.', {
          statusCode: 422,
          code: 'ESTOQUE_INSUFICIENTE',
        });
      }
      const cart = repositories.carts.getOrCreateActiveCart(userId);
      const result = repositories.carts.updateItem(cart.pk_id, productId, quantity);
      if (result.changes === 0) throw notFound('Item do carrinho');
      return this.get(userId);
    },
    deleteItem(userId, productId) {
      const cart = repositories.carts.getOrCreateActiveCart(userId);
      const result = repositories.carts.deleteItem(cart.pk_id, productId);
      if (result.changes === 0) throw notFound('Item do carrinho');
      return this.get(userId);
    },
  };

  const createOrderTransaction = database.transaction((userId, data) => {
    const address = repositories.customers.findAddress(userId, data.enderecoId);
    if (!address) throw notFound('Endereço');
    const paymentMethod = repositories.customers.findPaymentMethod(
      userId,
      data.formaPagamentoId,
    );
    if (!paymentMethod) throw notFound('Forma de pagamento');

    const cart = repositories.carts.getActiveCart(userId);
    const items = cart ? repositories.carts.listItems(cart.pk_id) : [];
    if (items.length === 0) {
      throw new AppError('O carrinho está vazio.', {
        statusCode: 422,
        code: 'CARRINHO_VAZIO',
      });
    }

    for (const item of items) {
      const result = repositories.orders.decrementStock(item.fk_produto, item.quantidade);
      if (result.changes === 0) {
        throw new AppError(`Estoque insuficiente para ${item.nome}.`, {
          statusCode: 409,
          code: 'ESTOQUE_ALTERADO',
        });
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.preco_centavos * item.quantidade,
      0,
    );
    const order = repositories.orders.insertOrder({
      userId,
      addressId: address.pk_id,
      paymentMethodId: paymentMethod.pk_id,
      subtotal,
      shipping: SHIPPING_IN_CENTS,
      total: subtotal + SHIPPING_IN_CENTS,
      destinatario: address.destinatario,
      cep: address.cep,
      logradouro: address.logradouro,
      numero: address.numero,
      complemento: address.complemento,
      bairro: address.bairro,
      cidade: address.cidade,
      uf: address.uf,
      paymentDescription: `${paymentMethod.bandeira} final ${paymentMethod.ultimos_digitos}`,
    });

    for (const item of items) repositories.orders.insertItem(order.pk_id, item);
    repositories.orders.markCartAsConverted(cart.pk_id);
    return mapOrder(order, repositories.orders.listItems(order.pk_id));
  });

  const cancelOrderTransaction = database.transaction((userId, orderId) => {
    const order = repositories.orders.find(userId, orderId);
    if (!order) throw notFound('Pedido');
    if (!['aguardando_pagamento', 'pago', 'em_separacao'].includes(order.status)) {
      throw new AppError('Este pedido não pode mais ser cancelado.', {
        statusCode: 409,
        code: 'PEDIDO_NAO_CANCELAVEL',
      });
    }

    const items = repositories.orders.listItems(orderId);
    const result = repositories.orders.cancel(userId, orderId);
    if (result.changes === 0) throw new AppError('Não foi possível cancelar o pedido.');
    for (const item of items) {
      if (item.fk_produto) repositories.orders.restoreStock(item.fk_produto, item.quantidade);
    }
    return mapOrder(repositories.orders.find(userId, orderId), items);
  });

  const orders = {
    list(userId) {
      return repositories.orders
        .list(userId)
        .map((order) => mapOrder(order, repositories.orders.listItems(order.pk_id)));
    },
    get(userId, orderId) {
      const order = repositories.orders.find(userId, orderId);
      if (!order) throw notFound('Pedido');
      return mapOrder(order, repositories.orders.listItems(orderId));
    },
    create(userId, data) {
      return createOrderTransaction(userId, data);
    },
    cancel(userId, orderId) {
      return cancelOrderTransaction(userId, orderId);
    },
  };

  return { addresses, auth, carts, catalog, favorites, orders, payments, users };
}
