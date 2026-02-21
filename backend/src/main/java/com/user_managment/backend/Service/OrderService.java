package com.user_managment.backend.Service;

import com.user_managment.backend.Dto.CreateOrderRequest;
import com.user_managment.backend.Dto.OrderResponse;
import com.user_managment.backend.Dto.OrdersPageResponse;
import com.user_managment.backend.Entity.Order;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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

    public OrdersPageResponse getOrdersForCurrentUser(User authenticatedUser, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> ordersPage = orderRepository.findByUserId(authenticatedUser.getId(), pageable);

        return new OrdersPageResponse(
                ordersPage.getContent().stream().map(OrderResponse::fromOrder).toList(),
                ordersPage.getNumber(),
                ordersPage.getSize(),
                ordersPage.getTotalElements(),
                ordersPage.getTotalPages(),
                ordersPage.hasNext()
        );
    }
}
