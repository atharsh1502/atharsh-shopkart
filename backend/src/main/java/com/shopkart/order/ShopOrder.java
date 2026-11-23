package com.shopkart.order;

import com.shopkart.customer.Customer;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class ShopOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    protected ShopOrder() {
    }

    public ShopOrder(Customer customer, List<OrderItem> items, BigDecimal total) {
        this.customer = customer;
        this.total = total;
        this.status = OrderStatus.PLACED;
        items.forEach(item -> {
            item.setOrder(this);
            this.items.add(item);
        });
    }

    public Long getId() { return id; }
    public Long getCustomerId() { return customer.getId(); }
    public List<OrderItem> getItems() { return List.copyOf(items); }
    public BigDecimal getTotal() { return total; }
    public OrderStatus getStatus() { return status; }
}
