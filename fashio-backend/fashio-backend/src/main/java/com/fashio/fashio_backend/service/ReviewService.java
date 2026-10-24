package com.fashio.fashio_backend.service;

import com.fashio.fashio_backend.dto.ReviewRequest;
import com.fashio.fashio_backend.dto.ReviewResponse;
import com.fashio.fashio_backend.dto.ReviewSummary;
import com.fashio.fashio_backend.entity.Product;
import com.fashio.fashio_backend.entity.Review;
import com.fashio.fashio_backend.entity.User;
import com.fashio.fashio_backend.repository.ProductRepository;
import com.fashio.fashio_backend.repository.ReviewRepository;
import com.fashio.fashio_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // email can be null when the visitor is not logged in
    @Transactional(readOnly = true)
    public ReviewSummary list(Long productId, String email) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);

        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        average = Math.round(average * 10) / 10.0;

        List<ReviewResponse> items = reviews.stream().map(r -> toResponse(r, email)).toList();
        return new ReviewSummary(average, items.size(), items);
    }

    @Transactional
    public ReviewResponse save(String email, Long productId, ReviewRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // one review per user per product: edit it if it already exists
        Review review = reviewRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseGet(() -> {
                    Review r = new Review();
                    r.setUser(user);
                    r.setProduct(product);
                    return r;
                });

        review.setRating(req.rating());
        review.setComment(req.comment() == null ? "" : req.comment().trim());
        review.setCreatedAt(LocalDateTime.now());
        reviewRepository.save(review);
        return toResponse(review, email);
    }

    @Transactional
    public void delete(Long id, String email, boolean isAdmin) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
        if (!isAdmin && !review.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own review");
        }
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review r, String email) {
        boolean mine = email != null && email.equals(r.getUser().getEmail());
        return new ReviewResponse(
                r.getId(),
                r.getUser().getName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt(),
                mine);
    }
}
