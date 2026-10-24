package com.fashio.fashio_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotBlank String address,
        @NotEmpty @Valid List<OrderItemRequest> items
) {}
