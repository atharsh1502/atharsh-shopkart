package com.shopkart.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;

import java.util.List;

public record ChatRequest(
        @NotBlank @Size(max = 2000) String message,
        Long customerId,
        @Size(max = 24) List<@Valid ChatTurn> history) {

    public ChatRequest {
        if (customerId == null) {
            customerId = 1L;
        }
        if (history == null) {
            history = List.of();
        }
    }

    public record ChatTurn(
            @Pattern(regexp = "user|assistant") String role,
            @NotBlank @Size(max = 2000) String content) {
    }
}
