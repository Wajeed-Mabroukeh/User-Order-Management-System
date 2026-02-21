package com.user_managment.backend.Dto;

import java.util.List;

public record OrdersPageResponse(
        List<OrderResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext
) {
}
