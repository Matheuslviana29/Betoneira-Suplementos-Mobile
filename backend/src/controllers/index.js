export function createControllers(services) {
  return {
    auth: {
      register: async (request, response) => {
        const result = await services.auth.register(request.validated.body);
        response.status(201).json({ dados: result });
      },
      login: async (request, response) => {
        const result = await services.auth.login(request.validated.body);
        response.json({ dados: result });
      },
      logout: (request, response) => {
        services.auth.logout(request.auth.token);
        response.status(204).end();
      },
    },

    catalog: {
      listCategories: (request, response) => {
        response.json({ dados: services.catalog.listCategories() });
      },
      listProducts: (request, response) => {
        response.json(services.catalog.listProducts(request.validated.query));
      },
      getProduct: (request, response) => {
        response.json({
          dados: services.catalog.getProduct(request.validated.params.identificador),
        });
      },
    },

    users: {
      getProfile: (request, response) => {
        response.json({ dados: services.users.getProfile(request.auth.userId) });
      },
      updateProfile: (request, response) => {
        response.json({
          dados: services.users.updateProfile(request.auth.userId, request.validated.body),
        });
      },
      changePassword: async (request, response) => {
        await services.users.changePassword(request.auth.userId, request.validated.body);
        response.status(204).end();
      },
    },

    addresses: {
      list: (request, response) => {
        response.json({ dados: services.addresses.list(request.auth.userId) });
      },
      create: (request, response) => {
        response.status(201).json({
          dados: services.addresses.create(request.auth.userId, request.validated.body),
        });
      },
      update: (request, response) => {
        response.json({
          dados: services.addresses.update(
            request.auth.userId,
            request.validated.params.id,
            request.validated.body,
          ),
        });
      },
      delete: (request, response) => {
        services.addresses.delete(request.auth.userId, request.validated.params.id);
        response.status(204).end();
      },
    },

    payments: {
      list: (request, response) => {
        response.json({ dados: services.payments.list(request.auth.userId) });
      },
      create: (request, response) => {
        response.status(201).json({
          dados: services.payments.create(request.auth.userId, request.validated.body),
        });
      },
      delete: (request, response) => {
        services.payments.delete(request.auth.userId, request.validated.params.id);
        response.status(204).end();
      },
    },

    favorites: {
      list: (request, response) => {
        response.json({ dados: services.favorites.list(request.auth.userId) });
      },
      add: (request, response) => {
        response.status(201).json({
          dados: services.favorites.add(
            request.auth.userId,
            request.validated.body.produtoId,
          ),
        });
      },
      delete: (request, response) => {
        services.favorites.delete(
          request.auth.userId,
          request.validated.params.produtoId,
        );
        response.status(204).end();
      },
    },

    carts: {
      get: (request, response) => {
        response.json({ dados: services.carts.get(request.auth.userId) });
      },
      addItem: (request, response) => {
        response.status(201).json({
          dados: services.carts.addItem(request.auth.userId, request.validated.body),
        });
      },
      updateItem: (request, response) => {
        response.json({
          dados: services.carts.updateItem(
            request.auth.userId,
            request.validated.params.produtoId,
            request.validated.body.quantidade,
          ),
        });
      },
      deleteItem: (request, response) => {
        response.json({
          dados: services.carts.deleteItem(
            request.auth.userId,
            request.validated.params.produtoId,
          ),
        });
      },
    },

    orders: {
      list: (request, response) => {
        response.json({ dados: services.orders.list(request.auth.userId) });
      },
      get: (request, response) => {
        response.json({
          dados: services.orders.get(request.auth.userId, request.validated.params.id),
        });
      },
      create: (request, response) => {
        response.status(201).json({
          dados: services.orders.create(request.auth.userId, request.validated.body),
        });
      },
      cancel: (request, response) => {
        response.json({
          dados: services.orders.cancel(request.auth.userId, request.validated.params.id),
        });
      },
    },
  };
}
