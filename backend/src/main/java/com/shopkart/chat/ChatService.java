package com.shopkart.chat;

import reactor.core.publisher.Flux;

import java.util.List;

public interface ChatService {
    String reply(String message, Long customerId, List<ChatRequest.ChatTurn> history);
    Flux<String> stream(String message, Long customerId, List<ChatRequest.ChatTurn> history);
}
