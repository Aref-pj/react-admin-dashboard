export type TransactionStatus = "approved" | "pending" | "declined";

export interface Transaction {
  id: string;
  userId: string;
  customer: string;
  avatar: string;
  orderId: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}