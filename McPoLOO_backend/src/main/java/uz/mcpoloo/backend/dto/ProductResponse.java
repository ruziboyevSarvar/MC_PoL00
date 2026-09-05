package uz.mcpoloo.backend.dto;

import uz.mcpoloo.backend.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String slug,
        String brand,
        String model,
        BigDecimal price,
        BigDecimal oldPrice,
        String description,
        String mainImageUrl,
        ProductStatus status,
        boolean featured,
        boolean newArrival,
        CategoryResponse category,
        List<ProductImageDto> galleryImages,
        List<ProductAttributeDto> attributes,
        Instant createdAt,
        Instant updatedAt
) {}
