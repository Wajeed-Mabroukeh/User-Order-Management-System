export interface Order {
  id: number;
  itemName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  itemName: string;
  totalAmount: number;
}
