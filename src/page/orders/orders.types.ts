export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "declined"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrders {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Order[];
}

export interface OrdersParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
}