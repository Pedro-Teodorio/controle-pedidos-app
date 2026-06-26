/*
 * Contratos técnicos para LMX-33 - Banco de orders e order_items.
 * Este arquivo é referência para execução futura e não deve importar código produtivo,
 * acessar banco, implementar regra de negócio ou criar UI.
 */

export const orderStatusValues = ['open', 'closed', 'canceled'] as const;

export type OrderStatus = (typeof orderStatusValues)[number];

export type Nullable<TValue> = TValue | null;

export type IsoDateTimeString = string;

export type OrderId = string;
export type OrderItemId = string;
export type WorkId = string;

export type Order = {
  id: OrderId;
  number: number;
  customerName: string;
  customerPhone: Nullable<string>;
  notes: Nullable<string>;
  status: OrderStatus;
  total: number;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  closedAt: Nullable<IsoDateTimeString>;
  canceledAt: Nullable<IsoDateTimeString>;
};

export type OrderItem = {
  id: OrderItemId;
  orderId: OrderId;
  patientName: string;
  workId: WorkId;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: Nullable<string>;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone?: string | null;
  notes?: string | null;
  items: CreateOrderItemInput[];
};

export type CreateOrderItemInput = {
  patientName: string;
  workId: WorkId;
  workName: string;
  quantity: number;
  unitPrice: number;
  notes?: string | null;
};

export type CreateOrderData = Order;

export type CreateOrderItemData = OrderItem;

export type UpdateOrderInput = Partial<{
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  status: OrderStatus;
  closedAt: IsoDateTimeString | null;
  canceledAt: IsoDateTimeString | null;
}>;

export type UpdateOrderData = Partial<
  Omit<Order, 'id' | 'number' | 'createdAt'>
> & {
  updatedAt: IsoDateTimeString;
};

export type FindAllOrdersFilters = {
  search?: string;
  status?: OrderStatus;
  createdFrom?: IsoDateTimeString;
  createdTo?: IsoDateTimeString;
};

export type OrderRouteParams = {
  id: OrderId;
};

export type OrdersSchemaContract = {
  tableName: 'orders';
  columns: {
    id: { dbName: 'id'; type: 'text'; nullable: false; primaryKey: true };
    number: { dbName: 'number'; type: 'integer'; nullable: false };
    customerName: { dbName: 'customer_name'; type: 'text'; nullable: false };
    customerPhone: { dbName: 'customer_phone'; type: 'text'; nullable: true };
    notes: { dbName: 'notes'; type: 'text'; nullable: true };
    status: { dbName: 'status'; type: 'text'; nullable: false; enum: typeof orderStatusValues };
    total: { dbName: 'total'; type: 'real'; nullable: false };
    createdAt: { dbName: 'created_at'; type: 'text'; nullable: false };
    updatedAt: { dbName: 'updated_at'; type: 'text'; nullable: false };
    closedAt: { dbName: 'closed_at'; type: 'text'; nullable: true };
    canceledAt: { dbName: 'canceled_at'; type: 'text'; nullable: true };
  };
};

export type OrderItemsSchemaContract = {
  tableName: 'order_items';
  columns: {
    id: { dbName: 'id'; type: 'text'; nullable: false; primaryKey: true };
    orderId: { dbName: 'order_id'; type: 'text'; nullable: false };
    patientName: { dbName: 'patient_name'; type: 'text'; nullable: false };
    workId: { dbName: 'work_id'; type: 'text'; nullable: false; foreignKeyToWorks: false };
    workName: { dbName: 'work_name'; type: 'text'; nullable: false; historicalSnapshot: true };
    quantity: { dbName: 'quantity'; type: 'real'; nullable: false };
    unitPrice: { dbName: 'unit_price'; type: 'real'; nullable: false; historicalSnapshot: true };
    totalPrice: { dbName: 'total_price'; type: 'real'; nullable: false };
    notes: { dbName: 'notes'; type: 'text'; nullable: true };
    createdAt: { dbName: 'created_at'; type: 'text'; nullable: false };
    updatedAt: { dbName: 'updated_at'; type: 'text'; nullable: false };
  };
  relationships: {
    orderIdReferencesOrdersId: true;
    workIdReferencesWorksId: false;
    cascadeDeleteWithWorks: false;
  };
};

export type DatabaseClientRegistrationContract = {
  schemaKeys: ['works', 'orders', 'orderItems'];
};

export type MigrationContract = {
  createsTables: ['orders', 'order_items'];
  nullableColumns: ['orders.customer_phone', 'orders.canceled_at', 'orders.closed_at', 'orders.notes', 'order_items.notes'];
  requiredSnapshotColumns: ['order_items.work_name', 'order_items.unit_price'];
  forbiddenSqlPatterns: ['ON DELETE CASCADE between works and order_items'];
  migrationsJsMustRegisterNewSqlFile: true;
};

export type OrderValidationContract = {
  validateCreateOrderInput(input: CreateOrderInput): void;
  validateCreateOrderItemInput(input: CreateOrderItemInput): void;
  validateOrderStatus(status: string): asserts status is OrderStatus;
};

export type OrdersRepositoryContract = {
  createOrder(data: CreateOrderData): Promise<void>;
  createOrderItem(data: CreateOrderItemData): Promise<void>;
  findOrderById(id: OrderId): Promise<OrderWithItems | null>;
  findAllOrders(filters?: FindAllOrdersFilters): Promise<Order[]>;
  updateOrder(id: OrderId, data: UpdateOrderData): Promise<void>;
};

export type OrdersServiceContract = {
  createOrder(input: CreateOrderInput): Promise<OrderId>;
  findOrderById(id: OrderId): Promise<OrderWithItems | null>;
  findAllOrders(filters?: FindAllOrdersFilters): Promise<Order[]>;
  updateOrder(id: OrderId, input: UpdateOrderInput): Promise<void>;
};

export type OrdersQueryKeysContract = {
  all: readonly ['orders'];
  lists: readonly ['orders', 'list'];
  list(filters?: FindAllOrdersFilters): readonly ['orders', 'list', FindAllOrdersFilters | undefined];
  details: readonly ['orders', 'detail'];
  detail(id: OrderId): readonly ['orders', 'detail', OrderId];
};

export type OrdersQueryOptionsContract = {
  findAllOrders(filters?: FindAllOrdersFilters): unknown;
  findOrderById(id: OrderId): unknown;
};

export type OrdersMutationsContract = {
  useCreateOrderMutation(): unknown;
  useUpdateOrderMutation(): unknown;
};
