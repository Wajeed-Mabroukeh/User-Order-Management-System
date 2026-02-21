package com.user_managment.backend.Controller;

import com.user_managment.backend.Dto.CreateOrderRequest;
import com.user_managment.backend.Dto.OrderResponse;
import com.user_managment.backend.Dto.OrdersPageResponse;
import com.user_managment.backend.Entity.User;
import com.user_managment.backend.Service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api/orders")
@Validated
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
    public OrdersPageResponse getCurrentUserOrders(
            @AuthenticationPrincipal User authenticatedUser,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "5") @Min(1) @Max(50) int size) {
        return orderService.getOrdersForCurrentUser(authenticatedUser, page, size);
    }
}
