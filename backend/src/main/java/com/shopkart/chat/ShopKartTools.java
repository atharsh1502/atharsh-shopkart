package com.shopkart.chat;

import com.shopkart.order.OrderRequest;
import com.shopkart.order.OrderService;
import com.shopkart.order.ShopOrder;
import com.shopkart.product.Product;
import com.shopkart.product.ProductService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ShopKartTools {

    private final ProductService productService;
    private final OrderService orderService;

    public ShopKartTools(ProductService productService, OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

    @Tool(description = "Search ShopKart products by keyword, category, or maximum price in INR.")
    public List<Product> searchProducts(
            @ToolParam(description = "Keywords such as wireless earbuds; use an empty string for all products") String query,
            @ToolParam(description = "Optional category such as Audio, Footwear, or Wearables") String category,
            @ToolParam(description = "Maximum price in rupees; use 0 for no price limit") BigDecimal maxPrice) {
        BigDecimal effectiveMaxPrice = maxPrice == null || maxPrice.signum() <= 0 ? null : maxPrice;
        return productService.search(query, category, effectiveMaxPrice);
    }

    @Tool(description = "Check the current stock quantity for a ShopKart product by its ID.")
    public String checkStock(@ToolParam(description = "The product ID") Long productId) {
        Product product = productService.getById(productId);
        return product.getName() + " has " + product.getStock() + " unit(s) in stock.";
    }

    @Tool(description = "Place an order for a customer. Only call this when the customer explicitly asks to buy or place an order. Confirm the product and quantity with the customer before calling.")
    public String placeOrder(
            @ToolParam(description = "Customer ID; the demo customer is ID 1") Long customerId,
            @ToolParam(description = "Product ID to purchase") Long productId,
            @ToolParam(description = "Quantity to purchase") Integer quantity) {
        if (quantity == null || quantity < 1 || quantity > 10) {
            return "Order quantity must be between 1 and 10.";
        }
        ShopOrder order = orderService.placeOrder(new OrderRequest(
                customerId,
                List.of(new OrderRequest.OrderLineRequest(productId, quantity))));
        return "Order #" + order.getId() + " placed successfully. Total: ₹" + order.getTotal() + ".";
    }
}
