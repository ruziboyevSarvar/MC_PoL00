package uz.mcpoloo.backend.dto;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T>(
        long totalElements,
        int totalPages,
        int page,
        int size,
        List<T> content
) {
    public static <T> PageResponse<T> from(Page<T> data) {
        return new PageResponse<>(data.getTotalElements(), data.getTotalPages(), data.getNumber(), data.getSize(), data.getContent());
    }
}
