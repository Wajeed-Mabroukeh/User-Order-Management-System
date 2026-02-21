package com.user_managment.backend.Service;

import com.user_managment.backend.Dto.CreateOrderRequest;
import com.user_managment.backend.Dto.OrderResponse;
import com.user_managment.backend.Entity.Order;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderResponse createOrder(CreateOrderRequest request, User authenticatedUser) {
        Order order = new Order();
        order.setTotalAmount(request.getTotalAmount());
        order.setItemName(request.getItemName().trim());
        order.setStatus("PENDING");
        order.setUser(authenticatedUser);

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromOrder(savedOrder);
    }

    public List<OrderResponse> getOrdersForCurrentUser(User authenticatedUser) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(authenticatedUser.getId())
                .stream()
                .map(OrderResponse::fromOrder)
                .toList();
    }
}
