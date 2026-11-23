package com.shopkart.order;

import com.shopkart.customer.Customer;
import com.shopkart.customer.CustomerRepository;
import com.shopkart.product.Product;
import com.shopkart.product.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public ShopOrder placeOrder(OrderRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer " + request.customerId() + " was not found"));
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequest.OrderLineRequest line : request.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new EntityNotFoundException("Product " + line.productId() + " was not found"));
            if (product.getStock() < line.quantity()) {
                throw new InsufficientStockException(product.getName(), product.getStock());
            }
            product.setStock(product.getStock() - line.quantity());
            orderItems.add(new OrderItem(product.getId(), product.getName(), line.quantity(), product.getPrice()));
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
        }

        return orderRepository.save(new ShopOrder(customer, orderItems, total));
    }

    @Transactional(readOnly = true)
    public ShopOrder getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order " + id + " was not found"));
    }

    public static class InsufficientStockException extends RuntimeException {
        public InsufficientStockException(String productName, int available) {
            super("Only " + available + " unit(s) of " + productName + " are in stock");
        }
    }
}
