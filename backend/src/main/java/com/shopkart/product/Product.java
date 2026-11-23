package com.shopkart.product;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String category;

    @NotBlank
    private String brand;

    @DecimalMin("0.0")
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    @Min(0)
    private double rating;

    @Min(0)
    private int stock;

    @Column(length = 1000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    protected Product() {
    }

    public Product(String name, String category, String brand, BigDecimal price, double rating,
                   int stock, String description, List<String> tags) {
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.rating = rating;
        this.stock = stock;
        this.description = description;
        this.tags = new ArrayList<>(tags);
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getBrand() { return brand; }
    public BigDecimal getPrice() { return price; }
    public double getRating() { return rating; }
    public int getStock() { return stock; }
    public String getDescription() { return description; }
    public List<String> getTags() { return List.copyOf(tags); }

    public void setStock(int stock) {
        this.stock = stock;
    }
}
