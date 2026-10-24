package com.fashio.fashio_backend.service;

import com.fashio.fashio_backend.entity.Product;
import com.fashio.fashio_backend.entity.User;
import com.fashio.fashio_backend.repository.ProductRepository;
import com.fashio.fashio_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class WishlistService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(UserRepository userRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> get(String email) {
        return sorted(findUser(email));
    }

    @Transactional
    public List<Product> add(String email, Long productId) {
        User user = findUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        user.getWishlist().add(product);
        return sorted(user);
    }

    @Transactional
    public List<Product> remove(String email, Long productId) {
        User user = findUser(email);
        user.getWishlist().removeIf(p -> p.getId().equals(productId));
        return sorted(user);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private List<Product> sorted(User user) {
        return user.getWishlist().stream()
                .sorted(Comparator.comparing(Product::getId))
                .toList();
    }
}