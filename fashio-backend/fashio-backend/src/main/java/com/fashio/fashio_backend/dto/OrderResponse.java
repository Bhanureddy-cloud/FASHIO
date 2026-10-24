package com.fashio.fashio_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String status,
        BigDecimal totalPrice,
        String address,
        LocalDateTime createdAt,
        String customerName,
        String customerEmail,
        List<OrderItemResponse> items
) {}