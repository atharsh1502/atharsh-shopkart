package com.shopkart.order;

import com.shopkart.customer.Customer;
import com.shopkart.customer.CustomerRepository;
import com.shopkart.product.Product;
import com.shopkart.product.ProductRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrderServiceTest {

    @Test
    void placesOrderWithExactTotalAndDecrementsStock() {
        OrderRepository orders = mock(OrderRepository.class);
        ProductRepository products = mock(ProductRepository.class);
        CustomerRepository customers = mock(CustomerRepository.class);
        Product product = new Product("Earbuds", "Audio", "Example", new BigDecimal("999.99"),
                4.5, 4, "Wireless earbuds", List.of("wireless"));
        when(customers.findById(1L)).thenReturn(Optional.of(new Customer("Demo", "demo@example.test")));
        when(products.findById(1L)).thenReturn(Optional.of(product));
        when(orders.save(org.mockito.ArgumentMatchers.any(ShopOrder.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        OrderService service = new OrderService(orders, products, customers);

        ShopOrder order = service.placeOrder(new OrderRequest(1L,
                List.of(new OrderRequest.OrderLineRequest(1L, 2))));

        assertEquals(new BigDecimal("1999.98"), order.getTotal());
        assertEquals(2, product.getStock());
        verify(orders).save(org.mockito.ArgumentMatchers.any(ShopOrder.class));
    }

    @Test
    void rejectsOrderWhenStockIsInsufficient() {
        OrderRepository orders = mock(OrderRepository.class);
        ProductRepository products = mock(ProductRepository.class);
        CustomerRepository customers = mock(CustomerRepository.class);
        Product product = new Product("Earbuds", "Audio", "Example", new BigDecimal("999.99"),
                4.5, 1, "Wireless earbuds", List.of("wireless"));
        when(customers.findById(1L)).thenReturn(Optional.of(new Customer("Demo", "demo@example.test")));
        when(products.findById(1L)).thenReturn(Optional.of(product));
        OrderService service = new OrderService(orders, products, customers);

        assertThrows(OrderService.InsufficientStockException.class, () -> service.placeOrder(
                new OrderRequest(1L, List.of(new OrderRequest.OrderLineRequest(1L, 2)))));
    }
}
