package com.fashio.fashio_backend.seed;

import com.fashio.fashio_backend.entity.Category;
import com.fashio.fashio_backend.entity.Product;
import com.fashio.fashio_backend.repository.CategoryRepository;
import com.fashio.fashio_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;   // only seed an empty table

        Category men = category("Men");
        Category women = category("Women");
        Category kids = category("Kids");
        Category acc = category("Accessories");

        add("Oxford Blue Shirt", "Breathable cotton shirt", "1299", 30, "S,M,L,XL", "Blue,White", men, "m1");
        add("Slim Fit Chinos", "Stretch cotton chinos", "1799", 20, "30,32,34,36", "Khaki,Navy", men, "m2");
        add("Graphic Oversized Tee", "Heavy cotton streetwear tee", "999", 50, "S,M,L,XL", "Black,White", men, "m3");
        add("Floral Summer Dress", "Light midi dress", "2199", 15, "S,M,L", "Pink,Yellow", women, "w1");
        add("High Waist Jeans", "Straight fit denim", "2499", 25, "26,28,30,32", "Blue,Black", women, "w2");
        add("Linen Co-ord Set", "Top and trouser set", "2999", 10, "S,M,L", "Beige,Olive", women, "w3");
        add("Kids Hoodie", "Soft fleece hoodie", "1199", 40, "4Y,6Y,8Y,10Y", "Red,Grey", kids, "k1");
        add("Leather Belt", "Genuine leather belt", "799", 60, "M,L", "Brown,Black", acc, "a1");
        add("Classic Sunglasses", "UV protected", "1499", 35, "Free", "Black", acc, "a2");
    }

    private Category category(String name) {
        return categoryRepository.findByName(name)
                   .orElseGet(() -> categoryRepository.save(new Category(null, name)));
    }

    private void add(String name, String desc, String price, int stock,
                     String sizes, String colors, Category cat, String seed) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(new BigDecimal(price));
        p.setStock(stock);
        p.setSizes(sizes);
        p.setColors(colors);
        p.setImageUrl("https://picsum.photos/seed/" + seed + "/600/800");
        p.setCategory(cat);
        productRepository.save(p);
    }
}