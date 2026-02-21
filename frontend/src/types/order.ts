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

export interface OrdersPageResponse {
  content: Order[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
