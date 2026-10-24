package com.fashio.fashio_backend.dto;

import com.fashio.fashio_backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull OrderStatus status) {}