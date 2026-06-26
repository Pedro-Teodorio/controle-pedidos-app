import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const orderStatusValues = ['open', 'closed', 'canceled'] as const;

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    number: integer('number').notNull(),
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone'),
    notes: text('notes'),
    status: text('status', { enum: orderStatusValues }).notNull(),
    total: real('total').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    closedAt: text('closed_at'),
    canceledAt: text('canceled_at'),
  },
  (table) => [uniqueIndex('orders_number_unique').on(table.number)]
);
