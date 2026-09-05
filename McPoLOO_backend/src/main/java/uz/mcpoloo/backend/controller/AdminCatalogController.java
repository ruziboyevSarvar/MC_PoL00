package uz.mcpoloo.backend.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import uz.mcpoloo.backend.dto.*;
import uz.mcpoloo.backend.enums.ProductStatus;
import uz.mcpoloo.backend.service.CategoryService;
import uz.mcpoloo.backend.service.ProductService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminCatalogController {
    private final ProductService productService;
    private final CategoryService categoryService;

    public AdminCatalogController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    @GetMapping("/products")
    public PageResponse<ProductResponse> products(@RequestParam(required = false) String q,
                                                  @RequestParam(required = false) ProductStatus status,
                                                  @RequestParam(required = false) String category,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "12") int size) {
        return productService.adminProducts(q, status, category, PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 60), Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @PostMapping("/products")
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        productService.delete(id);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return categoryService.adminCategories();
    }

    @PostMapping("/categories")
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable UUID id) {
        categoryService.delete(id);
    }
}
