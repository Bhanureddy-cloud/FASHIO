package com.fashio.fashio_backend.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        String imageUrl,
        String size,
        int quantity,
        BigDecimal price
) {}