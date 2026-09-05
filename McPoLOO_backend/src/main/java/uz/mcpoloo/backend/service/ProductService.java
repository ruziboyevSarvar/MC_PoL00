package uz.mcpoloo.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.mcpoloo.backend.domain.Product;
import uz.mcpoloo.backend.domain.ProductAttribute;
import uz.mcpoloo.backend.domain.ProductImage;
import uz.mcpoloo.backend.dto.*;
import uz.mcpoloo.backend.enums.ProductStatus;
import uz.mcpoloo.backend.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> publicProducts(String q, String category, String brand, String color, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.publicVisible()
                .and(ProductSpecifications.search(q))
                .and(ProductSpecifications.categorySlug(category))
                .and(ProductSpecifications.brand(brand))
                .and(ProductSpecifications.color(color))
                .and(ProductSpecifications.priceBetween(minPrice, maxPrice));
        Page<ProductResponse> data = productRepository.findAll(spec, pageable).map(this::toResponse);
        return PageResponse.from(data);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> adminProducts(String q, ProductStatus status, String category, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.search(q)
                .and(ProductSpecifications.status(status))
                .and(ProductSpecifications.categorySlug(category));
        return PageResponse.from(productRepository.findAll(spec, pageable).map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public ProductResponse publicBySlug(String slug) {
        return productRepository.findOne(ProductSpecifications.publicVisible().and((root, query, cb) -> cb.equal(root.get("slug"), slug)))
                .map(this::toResponse)
                .orElseThrow(() -> new NotFoundException("Mahsulot topilmadi"));
    }

    @Transactional(readOnly = true)
    public ProductResponse publicById(UUID id) {
        return productRepository.findOne(ProductSpecifications.publicVisible().and((root, query, cb) -> cb.equal(root.get("id"), id)))
                .map(this::toResponse)
                .orElseThrow(() -> new NotFoundException("Mahsulot topilmadi"));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> related(String slug) {
        Product product = productRepository.findOne(ProductSpecifications.publicVisible().and((root, query, cb) -> cb.equal(root.get("slug"), slug)))
                .orElseThrow(() -> new NotFoundException("Mahsulot topilmadi"));
        return productRepository.findTop8ByCategorySlugAndStatusNotAndIdNotOrderByCreatedAtDesc(product.getCategory().getSlug(), ProductStatus.INACTIVE, product.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new NotFoundException("Mahsulot topilmadi"));
        apply(product, request);
        return toResponse(product);
    }

    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Mahsulot topilmadi");
        }
        productRepository.deleteById(id);
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getBrand(),
                product.getModel(),
                product.getPrice(),
                product.getOldPrice(),
                product.getDescription(),
                product.getMainImageUrl(),
                product.getStatus(),
                product.isFeatured(),
                product.isNewArrival(),
                categoryService.toResponse(product.getCategory()),
                product.getImages().stream().map(i -> new ProductImageDto(i.getUrl(), i.getAlt(), i.getSortOrder())).toList(),
                product.getAttributes().stream().map(a -> new ProductAttributeDto(a.getName(), a.getValue(), a.getSortOrder())).toList(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private void apply(Product product, ProductRequest request) {
        product.setName(request.name().trim());
        product.setSlug(SlugUtil.slugify(request.slug() == null || request.slug().isBlank() ? request.name() + " " + request.model() : request.slug()));
        product.setBrand(request.brand().trim());
        product.setModel(request.model().trim());
        product.setPrice(request.price());
        product.setOldPrice(request.oldPrice());
        product.setDescription(request.description());
        product.setMainImageUrl(request.mainImageUrl());
        product.setStatus(request.status());
        product.setFeatured(request.featured());
        product.setNewArrival(request.newArrival());
        product.setCategory(categoryService.getRequired(request.categoryId()));
        product.replaceImages((request.galleryImages() == null ? List.<ProductImageDto>of() : request.galleryImages()).stream().map(dto -> {
            ProductImage image = new ProductImage();
            image.setUrl(dto.url());
            image.setAlt(dto.alt());
            image.setSortOrder(dto.sortOrder());
            return image;
        }).toList());
        product.replaceAttributes((request.attributes() == null ? List.<ProductAttributeDto>of() : request.attributes()).stream().map(dto -> {
            ProductAttribute attribute = new ProductAttribute();
            attribute.setName(dto.name());
            attribute.setValue(dto.value());
            attribute.setSortOrder(dto.sortOrder());
            return attribute;
        }).toList());
    }
}
