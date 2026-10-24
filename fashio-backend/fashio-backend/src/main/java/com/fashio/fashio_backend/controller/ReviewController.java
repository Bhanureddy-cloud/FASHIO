package com.fashio.fashio_backend.controller;

import com.fashio.fashio_backend.dto.ReviewRequest;
import com.fashio.fashio_backend.dto.ReviewResponse;
import com.fashio.fashio_backend.dto.ReviewSummary;
import com.fashio.fashio_backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // public: anyone can read reviews (auth is null when not logged in)
    @GetMapping("/product/{productId}")
    public ReviewSummary list(Authentication auth, @PathVariable Long productId) {
        return reviewService.list(productId, auth == null ? null : auth.getName());
    }

    @PostMapping("/product/{productId}")
    public ReviewResponse save(Authentication auth,
                               @PathVariable Long productId,
                               @Valid @RequestBody ReviewRequest req) {
        return reviewService.save(auth.getName(), productId, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable Long id) {
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        reviewService.delete(id, auth.getName(), isAdmin);
    }
}