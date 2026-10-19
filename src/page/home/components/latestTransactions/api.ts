
import api from "../../../../app/api/axios";

export type TransactionStatus =
  | "declined"
  | "approved"
  | "pending";

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

interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}

export const fetchLatestTransactions = async (): Promise<Transaction[]> => {
  const res = await api.get<PaginatedResponse<Transaction>>("/transactions", {
    params: {
      _page: 1,
      _per_page: 5,
      _sort: "-createdAt",
    },
  });

  return res.data.data;
};
