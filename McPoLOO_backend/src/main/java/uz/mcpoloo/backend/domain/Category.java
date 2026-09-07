package uz.mcpoloo.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "categories", indexes = @Index(name = "idx_category_slug", columnList = "slug", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(nullable = false, length = 140)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(length = 600)
    private String description;

    @Column(length = 600)
    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private int sortOrder = 0;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }


}
