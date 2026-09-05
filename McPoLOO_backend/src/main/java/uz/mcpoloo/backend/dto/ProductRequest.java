package uz.mcpoloo.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import uz.mcpoloo.backend.enums.ProductStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequest(
        @NotBlank String name,
        String slug,
        @NotBlank String brand,
        @NotBlank String model,
        @NotNull @Positive BigDecimal price,
        BigDecimal oldPrice,
        String description,
        @NotBlank String mainImageUrl,
        @NotNull ProductStatus status,
        boolean featured,
        boolean newArrival,
        @NotNull UUID categoryId,
        List<@Valid ProductImageDto> galleryImages,
        List<@Valid ProductAttributeDto> attributes
) {}
