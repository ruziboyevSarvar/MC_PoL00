package uz.mcpoloo.backend.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import uz.mcpoloo.backend.dto.CategoryResponse;
import uz.mcpoloo.backend.dto.PageResponse;
import uz.mcpoloo.backend.dto.ProductResponse;
import uz.mcpoloo.backend.service.CategoryService;
import uz.mcpoloo.backend.service.ProductService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PublicCatalogController {
    private final ProductService productService;
    private final CategoryService categoryService;

    public PublicCatalogController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return categoryService.publicCategories();
    }

    @GetMapping("/products")
    public PageResponse<ProductResponse> products(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "new") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.publicProducts(q, category, brand, color, minPrice, maxPrice, pageable(sort, page, size));
    }

    @GetMapping("/products/{id}")
    public ProductResponse productById(@PathVariable UUID id) {
        return productService.publicById(id);
    }

    @GetMapping("/products/slug/{slug}")
    public ProductResponse productBySlug(@PathVariable String slug) {
        return productService.publicBySlug(slug);
    }

    @GetMapping("/products/slug/{slug}/related")
    public List<ProductResponse> related(@PathVariable String slug) {
        return productService.related(slug);
    }

    @GetMapping("/categories/{slug}/products")
    public PageResponse<ProductResponse> categoryProducts(@PathVariable String slug, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "12") int size) {
        return productService.publicProducts(null, slug, null, null, null, null, PageRequest.of(page, Math.min(size, 40), Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    private PageRequest pageable(String sort, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 40);
        Sort selected = switch (sort == null ? "new" : sort) {
            case "price-asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price-desc" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        return PageRequest.of(safePage, safeSize, selected);
    }
}
