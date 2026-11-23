package com.shopkart.chat;

import com.shopkart.product.Product;
import com.shopkart.product.ProductService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@ConditionalOnProperty(name = "shopkart.ai.enabled", havingValue = "false", matchIfMissing = true)
public class DemoChatService implements ChatService {

    private static final Pattern PRICE_PATTERN = Pattern.compile("(?:under|below|less than|upto|up to)\\s*₹?\\s*(\\d+)", Pattern.CASE_INSENSITIVE);
    private final ProductService productService;

    public DemoChatService(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public String reply(String message, Long customerId, List<ChatRequest.ChatTurn> history) {
        String normalized = message.toLowerCase(Locale.ROOT);
        if (normalized.contains("help") || normalized.contains("hello") || normalized.contains("hi")) {
            return "Hi! I can help you find ShopKart products. Try “wireless earbuds under 3000” or browse the catalog.";
        }

        Matcher priceMatcher = PRICE_PATTERN.matcher(message);
        BigDecimal maxPrice = priceMatcher.find() ? new BigDecimal(priceMatcher.group(1)) : null;
        String query = normalized.contains("earbud") || normalized.contains("headphone") ? "audio"
                : normalized.contains("shoe") || normalized.contains("running") ? "footwear"
                : normalized.contains("watch") || normalized.contains("fitness") ? "wearables"
                : "";
        List<Product> results = productService.search(query, null, maxPrice);
        if (results.isEmpty()) {
            return "I couldn't find a matching in-stock item. Try another category or budget.";
        }
        List<Product> inStock = results.stream().filter(product -> product.getStock() > 0).limit(3).toList();
        if (inStock.isEmpty()) {
            return "I found matching products, but they are currently out of stock. Try a different search.";
        }
        String recommendations = inStock.stream()
                .map(product -> product.getName() + " (₹" + product.getPrice() + ", rating "
                        + product.getRating() + "/5, " + product.getStock() + " in stock)")
                .reduce((first, second) -> first + "; " + second)
                .orElse("");
        return "Here are some highly rated matches: " + recommendations
                + ". This is demo chat mode; enable the Spring AI agent to place orders from chat.";
    }

    @Override
    public Flux<String> stream(String message, Long customerId, List<ChatRequest.ChatTurn> history) {
        return Flux.just(reply(message, customerId, history));
    }
}
