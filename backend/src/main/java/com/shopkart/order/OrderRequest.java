package com.shopkart.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequest(
        @NotNull Long customerId,
        @NotEmpty List<@Valid OrderLineRequest> items) {

    public record OrderLineRequest(
            @NotNull Long productId,
            @jakarta.validation.constraints.Min(1) int quantity) {
    }
}
