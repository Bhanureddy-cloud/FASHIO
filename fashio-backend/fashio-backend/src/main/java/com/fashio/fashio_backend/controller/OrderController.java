package com.fashio.fashio_backend.controller;

import com.fashio.fashio_backend.dto.OrderRequest;
import com.fashio.fashio_backend.dto.OrderResponse;
import com.fashio.fashio_backend.dto.StatusUpdateRequest;
import com.fashio.fashio_backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ----- customer -----

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse place(Authentication auth, @Valid @RequestBody OrderRequest req) {
        return orderService.placeOrder(auth.getName(), req);
    }

    @GetMapping("/orders/my")
    public List<OrderResponse> mine(Authentication auth) {
        return orderService.myOrders(auth.getName());
    }
    
    @PutMapping("/orders/{id}/cancel")
    public OrderResponse cancel(Authentication auth, @PathVariable Long id) {
        return orderService.cancelMyOrder(auth.getName(), id);
    }

    // ----- admin -----

    @GetMapping("/admin/orders")
    public List<OrderResponse> all() {
        return orderService.allOrders();
    }

    @PutMapping("/admin/orders/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id,
                                      @Valid @RequestBody StatusUpdateRequest req) {
        return orderService.updateStatus(id, req.status());
    }
}