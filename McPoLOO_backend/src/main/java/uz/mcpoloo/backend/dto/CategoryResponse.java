package uz.mcpoloo.backend.dto;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        String imageUrl,
        boolean active,
        int sortOrder
) {}
