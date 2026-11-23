package com.shopkart.product;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProductServiceTest {

    @Test
    void searchFiltersByQueryCategoryAndPriceAndSortsByRating() {
        ProductRepository repository = mock(ProductRepository.class);
        ProductService service = new ProductService(repository);
        Product earbuds = new Product("Wireless Earbuds", "Audio", "Example", new BigDecimal("2000.00"),
                4.8, 3, "Long battery bluetooth earbuds", List.of("wireless"));
        Product headphones = new Product("Wired Headphones", "Audio", "Example", new BigDecimal("1500.00"),
                4.1, 5, "Over-ear sound", List.of("wired"));
        when(repository.findAll()).thenReturn(List.of(headphones, earbuds));

        List<Product> result = service.search("wireless", "audio", new BigDecimal("3000"));

        assertEquals(List.of(earbuds), result);
    }
}
