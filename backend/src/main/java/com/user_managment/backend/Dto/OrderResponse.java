package com.user_managment.backend.Dto;

import com.user_managment.backend.Entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private String itemName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;

    public static OrderResponse fromOrder(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .itemName(order.getItemName())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
