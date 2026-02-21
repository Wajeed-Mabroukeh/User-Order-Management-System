import { CreateOrderRequest, Order } from "../types/order";
import { httpRequest } from "./http";

export const orderApi = {
  getMyOrders() {
    return httpRequest<Order[]>("/orders");
  },
  createOrder(payload: CreateOrderRequest) {
    return httpRequest<Order, CreateOrderRequest>("/orders", {
      method: "POST",
      body: payload
    });
  }
};
