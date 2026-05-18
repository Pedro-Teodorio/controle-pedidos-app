import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const status = ['active', 'inactive'] as const;

export const works = sqliteTable('works', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  status: text('status', { enum: status }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
