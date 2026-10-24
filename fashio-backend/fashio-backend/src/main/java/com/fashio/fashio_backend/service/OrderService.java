package com.fashio.fashio_backend.service;

import com.fashio.fashio_backend.dto.*;
import com.fashio.fashio_backend.entity.*;
import com.fashio.fashio_backend.repository.OrderRepository;
import com.fashio.fashio_backend.repository.ProductRepository;
import com.fashio.fashio_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest req) {
        User user = findUser(email);

        Order order = new Order();
        order.setUser(user);
        order.setAddress(req.address().trim());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest ir : req.items()) {
            Product product = productRepository.findById(ir.productId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Product not found: " + ir.productId()));

            int stock = product.getStock() == null ? 0 : product.getStock();
            if (stock < ir.quantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Not enough stock for " + product.getName());
            }
            product.setStock(stock - ir.quantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(ir.quantity());
            item.setSize(ir.size());
            item.setPrice(product.getPrice());
            order.getItems().add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(ir.quantity())));
        }

        order.setTotalPrice(total);
        orderRepository.save(order);
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders(String email) {
        User user = findUser(email);
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> allOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public OrderResponse cancelMyOrder(String email, Long id) {
        // a user can only cancel their own order; others get "not found"
        Order order = orderRepository.findById(id)
                .filter(o -> o.getUser().getEmail().equals(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only orders that are still PLACED can be cancelled");
        }
        restoreStock(order);
        order.setStatus(OrderStatus.CANCELLED);
        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        OrderStatus current = order.getStatus();
        if (current == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelled orders cannot be changed");
        }
        if (status == OrderStatus.CANCELLED) {
            if (current == OrderStatus.DELIVERED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Delivered orders cannot be cancelled");
            }
            restoreStock(order);
        }
        order.setStatus(status);
        return toResponse(order);
    }

    private void restoreStock(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int stock = product.getStock() == null ? 0 : product.getStock();
            product.setStock(stock + item.getQuantity());
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private OrderResponse toResponse(Order o) {
        List<OrderItemResponse> items = o.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getImageUrl(),
                        i.getSize(),
                        i.getQuantity(),
                        i.getPrice()))
                .toList();
        return new OrderResponse(
                o.getId(),
                o.getStatus().name(),
                o.getTotalPrice(),
                o.getAddress(),
                o.getCreatedAt(),
                o.getUser().getName(),
                o.getUser().getEmail(),
                items);
    }
}
