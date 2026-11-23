package com.shopkart.product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> search(String query, String category, BigDecimal maxPrice) {
        String normalizedQuery = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        String normalizedCategory = category == null ? "" : category.trim().toLowerCase(Locale.ROOT);

        return productRepository.findAll().stream()
                .filter(product -> normalizedCategory.isEmpty()
                        || product.getCategory().toLowerCase(Locale.ROOT).contains(normalizedCategory))
                .filter(product -> maxPrice == null || product.getPrice().compareTo(maxPrice) <= 0)
                .filter(product -> normalizedQuery.isEmpty()
                        || (product.getName() + " " + product.getBrand() + " " + product.getCategory() + " "
                        + product.getDescription() + " " + String.join(" ", product.getTags()))
                        .toLowerCase(Locale.ROOT).contains(normalizedQuery))
                .sorted(Comparator.comparing(Product::getRating).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(Long id) {
            super("Product " + id + " was not found");
        }
    }
}
