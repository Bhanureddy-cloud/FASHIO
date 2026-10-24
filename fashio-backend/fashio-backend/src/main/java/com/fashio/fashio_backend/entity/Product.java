package com.fashio.fashio_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer stock;

    private String imageUrl;

    private String sizes;   // example: "S,M,L,XL"

    private String colors;  // example: "Black,White,Navy"

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}