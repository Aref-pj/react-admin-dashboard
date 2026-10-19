import api from "../../app/api/axios";
import type { Order } from "./orders.types";

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>("/orders");
    return data;
  },
};