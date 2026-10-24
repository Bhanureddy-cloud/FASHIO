package com.fashio.fashio_backend.dto;

public record AuthResponse(String token, String name, String email, String role) {}