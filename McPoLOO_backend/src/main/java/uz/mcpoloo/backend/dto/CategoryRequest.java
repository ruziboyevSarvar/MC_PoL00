package uz.mcpoloo.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String name,
        String slug,
        String description,
        String imageUrl,
        boolean active,
        int sortOrder
) {}
