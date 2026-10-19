import api from "../../app/api/axios";
import type { Transaction } from "./transactions.type";

export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data } = await api.get<Transaction[]>("/transactions");
    return data;
  },
};