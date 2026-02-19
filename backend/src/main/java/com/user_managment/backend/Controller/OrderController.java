package com.user_managment.backend.Controller;

import com.user_managment.backend.Dto.CreateOrderRequest;
import com.user_managment.backend.Dto.OrderResponse;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User authenticatedUser) {
        return orderService.createOrder(request, authenticatedUser);
    }

    @GetMapping
    public List<OrderResponse> getCurrentUserOrders(@AuthenticationPrincipal User authenticatedUser) {
        return orderService.getOrdersForCurrentUser(authenticatedUser);
    }
}
