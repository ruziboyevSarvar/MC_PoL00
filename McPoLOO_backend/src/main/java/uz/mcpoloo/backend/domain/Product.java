package uz.mcpoloo.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import uz.mcpoloo.backend.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_slug", columnList = "slug", unique = true),
        @Index(name = "idx_product_model", columnList = "model"),
        @Index(name = "idx_product_brand", columnList = "brand"),
        @Index(name = "idx_product_status", columnList = "status")
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(nullable = false, length = 180)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @NotBlank
    @Column(nullable = false, length = 120)
    private String brand;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String model;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(precision = 14, scale = 2)
    private BigDecimal oldPrice;

    @Column(columnDefinition = "text")
    private String description;

    @Column(length = 600)
    private String mainImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean newArrival = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder asc")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder asc")
    private List<ProductAttribute> attributes = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public void replaceImages(List<ProductImage> replacement) {
        images.clear();
        replacement.forEach(image -> {
            image.setProduct(this);
            images.add(image);
        });
    }

    public void replaceAttributes(List<ProductAttribute> replacement) {
        attributes.clear();
        replacement.forEach(attribute -> {
            attribute.setProduct(this);
            attributes.add(attribute);
        });
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMainImageUrl() { return mainImageUrl; }
    public void setMainImageUrl(String mainImageUrl) { this.mainImageUrl = mainImageUrl; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public boolean isNewArrival() { return newArrival; }
    public void setNewArrival(boolean newArrival) { this.newArrival = newArrival; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<ProductImage> getImages() { return images; }
    public List<ProductAttribute> getAttributes() { return attributes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
