package uz.mcpoloo.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductAttributeDto(@NotBlank String name, @NotBlank String value, int sortOrder) {}
