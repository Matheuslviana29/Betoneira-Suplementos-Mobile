import { createCartRepository } from './cart.repository.js';
import { createCatalogRepository } from './catalog.repository.js';
import { createCustomerRepository } from './customer.repository.js';
import { createOrderRepository } from './order.repository.js';
import { createSessionRepository, createUserRepository } from './user.repository.js';

export function createRepositories(database) {
  return {
    carts: createCartRepository(database),
    catalog: createCatalogRepository(database),
    customers: createCustomerRepository(database),
    orders: createOrderRepository(database),
    sessions: createSessionRepository(database),
    users: createUserRepository(database),
  };
}
