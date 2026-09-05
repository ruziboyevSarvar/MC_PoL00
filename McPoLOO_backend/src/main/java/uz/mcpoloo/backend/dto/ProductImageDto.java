package uz.mcpoloo.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductImageDto(@NotBlank String url, String alt, int sortOrder) {}
