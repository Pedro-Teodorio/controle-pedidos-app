import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { works } from '@/database/schemas/works.schema';

export const databaseSchemas = {
  works,
};

export const sqliteDatabase = openDatabaseSync('controle-pedidos.db');

export const db = drizzle(sqliteDatabase, {
  schema: databaseSchemas,
});
