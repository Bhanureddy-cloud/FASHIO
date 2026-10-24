package com.fashio.fashio_backend.controller;

import com.fashio.fashio_backend.entity.Product;
import com.fashio.fashio_backend.service.WishlistService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<Product> get(Authentication auth) {
        return wishlistService.get(auth.getName());
    }

    @PostMapping("/{productId}")
    public List<Product> add(Authentication auth, @PathVariable Long productId) {
        return wishlistService.add(auth.getName(), productId);
    }

    @DeleteMapping("/{productId}")
    public List<Product> remove(Authentication auth, @PathVariable Long productId) {
        return wishlistService.remove(auth.getName(), productId);
    }
}