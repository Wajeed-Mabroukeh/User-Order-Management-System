import { CreateOrderRequest, Order } from "../types/order";
import { httpRequest } from "./http";

export const orderApi = {
  getMyOrders(token: string) {
    return httpRequest<Order[]>("/orders", { token });
  },
  createOrder(token: string, payload: CreateOrderRequest) {
    return httpRequest<Order, CreateOrderRequest>("/orders", {
      method: "POST",
      token,
      body: payload
    });
  }
};
