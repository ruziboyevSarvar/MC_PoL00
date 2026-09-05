package uz.mcpoloo.backend.domain;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 700)
    private String url;

    @Column(length = 160)
    private String alt;

    @Column(nullable = false)
    private int sortOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getAlt() { return alt; }
    public void setAlt(String alt) { this.alt = alt; }
    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
