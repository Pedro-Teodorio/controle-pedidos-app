import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { orders } from '@/database/schemas/orders.schema';

export const orderItems = sqliteTable(
  'order_items',
  {
    id: text('id').primaryKey(),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id),
    patientName: text('patient_name').notNull(),
    workId: text('work_id').notNull(),
    workName: text('work_name').notNull(),
    quantity: real('quantity').notNull(),
    unitPrice: real('unit_price').notNull(),
    totalPrice: real('total_price').notNull(),
    notes: text('notes'),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('order_items_order_id_idx').on(table.orderId)]
);
