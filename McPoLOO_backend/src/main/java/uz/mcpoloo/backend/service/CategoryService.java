package uz.mcpoloo.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.mcpoloo.backend.domain.Category;
import uz.mcpoloo.backend.dto.CategoryRequest;
import uz.mcpoloo.backend.dto.CategoryResponse;
import uz.mcpoloo.backend.repository.CategoryRepository;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> publicCategories() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAscNameAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> adminCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        apply(category, request);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Kategoriya topilmadi"));
        apply(category, request);
        return toResponse(category);
    }

    @Transactional
    public void delete(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Kategoriya topilmadi");
        }
        categoryRepository.deleteById(id);
    }

    Category getRequired(UUID id) {
        return categoryRepository.findById(id).orElseThrow(() -> new NotFoundException("Kategoriya topilmadi"));
    }

    Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug).orElseThrow(() -> new NotFoundException("Kategoriya topilmadi"));
    }

    CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getSlug(), category.getDescription(), category.getImageUrl(), category.isActive(), category.getSortOrder());
    }

    private void apply(Category category, CategoryRequest request) {
        category.setName(request.name().trim());
        String requestedSlug = request.slug() == null || request.slug().isBlank() ? request.name() : request.slug();
        category.setSlug(SlugUtil.slugify(requestedSlug));
        category.setDescription(request.description());
        category.setImageUrl(request.imageUrl());
        category.setActive(request.active());
        category.setSortOrder(request.sortOrder());
    }
}
