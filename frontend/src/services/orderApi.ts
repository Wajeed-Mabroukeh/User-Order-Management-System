import { CreateOrderRequest, Order, OrdersPageResponse } from "../types/order";
import { httpRequest } from "./http";

export const orderApi = {
  getMyOrders(page: number, size: number) {
    return httpRequest<OrdersPageResponse>(`/orders?page=${page}&size=${size}`);
  },
  createOrder(payload: CreateOrderRequest) {
    return httpRequest<Order, CreateOrderRequest>("/orders", {
      method: "POST",
      body: payload
    });
  }
};
