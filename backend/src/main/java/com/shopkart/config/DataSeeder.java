package com.shopkart.config;

import com.shopkart.customer.Customer;
import com.shopkart.customer.CustomerRepository;
import com.shopkart.product.Product;
import com.shopkart.product.ProductRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    ApplicationRunner seedData(ProductRepository products, CustomerRepository customers) {
        return args -> {
            if (products.count() == 0) {
                products.saveAll(List.of(
                        new Product("boAt Airdopes 141", "Audio", "boAt", new BigDecimal("1299.00"), 4.2, 24,
                                "Wireless earbuds with up to 42 hours of playback and low-latency mode.",
                                List.of("wireless", "bluetooth", "earbuds", "long battery")),
                        new Product("Noise Buds VS104", "Audio", "Noise", new BigDecimal("1499.00"), 4.1, 18,
                                "Truly wireless earbuds with up to 45 hours of playtime and quad mic ENC.",
                                List.of("wireless", "bluetooth", "earbuds", "long battery")),
                        new Product("JBL Wave Buds", "Audio", "JBL", new BigDecimal("2799.00"), 4.4, 12,
                                "Deep bass true wireless earbuds with a compact, comfortable fit.",
                                List.of("wireless", "bluetooth", "earbuds", "bass")),
                        new Product("Sony WF-C500", "Audio", "Sony", new BigDecimal("4990.00"), 4.5, 7,
                                "Reliable wireless earbuds with clear sound and up to 20 hours of battery.",
                                List.of("wireless", "bluetooth", "earbuds", "sound")),
                        new Product("Nike Revolution 7", "Footwear", "Nike", new BigDecimal("3695.00"), 4.3, 10,
                                "Everyday road running shoe with soft cushioning and a breathable upper.",
                                List.of("running", "shoes", "cushioned", "sports")),
                        new Product("Adidas Duramo SL", "Footwear", "Adidas", new BigDecimal("4299.00"), 4.2, 8,
                                "Lightweight running shoes designed for daily training and comfort.",
                                List.of("running", "shoes", "lightweight", "sports")),
                        new Product("Noise ColorFit Pulse 4", "Wearables", "Noise", new BigDecimal("1799.00"), 4.0, 20,
                                "Smart watch with a bright display, activity tracking, and long battery life.",
                                List.of("smartwatch", "fitness", "wearables", "battery")),
                        new Product("boAt Wave Neo", "Wearables", "boAt", new BigDecimal("1599.00"), 3.9, 15,
                                "Everyday smartwatch with a large display and multiple sports modes.",
                                List.of("smartwatch", "fitness", "wearables"))
                ));
            }
            if (customers.count() == 0) {
                customers.save(new Customer("ShopKart Demo Customer", "demo@shopkart.local"));
            }
        };
    }
}
