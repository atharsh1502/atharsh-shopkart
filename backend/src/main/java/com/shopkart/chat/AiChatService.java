package com.shopkart.chat;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
@ConditionalOnProperty(name = "shopkart.ai.enabled", havingValue = "true")
public class AiChatService implements ChatService {

    private final ChatClient chatClient;
    private final ShopKartTools tools;

    public AiChatService(ChatClient.Builder builder, ShopKartTools tools) {
        this.chatClient = builder
                .defaultSystem("""
                        You are ShopKart's friendly shopping assistant for an Indian online store.
                        Prices are in Indian rupees (INR). Use the available tools for current catalog,
                        stock, and order information. Never invent products, prices, or stock.
                        Ask a short clarifying question if the request is ambiguous. A recommendation
                        alone is not authorization to place an order: place an order only when the
                        customer explicitly asks to purchase, confirms the product, and gives a quantity.
                        The demo customer ID is 1. Keep answers concise and helpful.
                        """)
                .build();
        this.tools = tools;
    }

    @Override
    public String reply(String message, Long customerId, List<ChatRequest.ChatTurn> history) {
        return chatClient.prompt()
                .messages(toMessages(history).toArray(Message[]::new))
                .user(message)
                .tools(tools)
                .call()
                .content();
    }

    @Override
    public Flux<String> stream(String message, Long customerId, List<ChatRequest.ChatTurn> history) {
        return chatClient.prompt()
                .messages(toMessages(history).toArray(Message[]::new))
                .user(message)
                .tools(tools)
                .stream()
                .content();
    }

    private List<Message> toMessages(List<ChatRequest.ChatTurn> history) {
        return history.stream()
                .map(turn -> "assistant".equals(turn.role())
                        ? (Message) new AssistantMessage(turn.content())
                        : new UserMessage(turn.content()))
                .toList();
    }
}
