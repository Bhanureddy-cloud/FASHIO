package com.fashio.fashio_backend.dto;

import java.util.List;

public record ReviewSummary(double average, int count, List<ReviewResponse> reviews) {}
