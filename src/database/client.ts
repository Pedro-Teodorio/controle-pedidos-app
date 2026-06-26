import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { orderItems } from '@/database/schemas/order-items.schema';
import { orders } from '@/database/schemas/orders.schema';
import { works } from '@/database/schemas/works.schema';

export const databaseSchemas = {
  orderItems,
  orders,
  works,
};

export const sqliteDatabase = openDatabaseSync('controle-pedidos.db');

export const db = drizzle(sqliteDatabase, {
  schema: databaseSchemas,
});
