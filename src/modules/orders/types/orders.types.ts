export type OrderStatus = 'open' | 'closed' | 'canceled';

export type Order = {
  id: string;
  number: number;
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  canceledAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  patientName: string;
  workId: string;
  workName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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
  workId: string;
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
  closedAt: string | null;
  canceledAt: string | null;
}>;

export type UpdateOrderData = Partial<
  Omit<Order, 'id' | 'number' | 'createdAt'>
> & {
  updatedAt: string;
};

export type FindAllOrdersFilters = {
  search?: string;
  status?: OrderStatus;
  createdFrom?: string;
  createdTo?: string;
};
