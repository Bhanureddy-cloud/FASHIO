package com.fashio.fashio_backend.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        String userName,
        int rating,
        String comment,
        LocalDateTime createdAt,
        boolean mine
) {}