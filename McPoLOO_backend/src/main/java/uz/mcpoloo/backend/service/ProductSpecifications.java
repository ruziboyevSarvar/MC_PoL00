package uz.mcpoloo.backend.service;

import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import uz.mcpoloo.backend.domain.Product;
import uz.mcpoloo.backend.enums.ProductStatus;

import java.math.BigDecimal;

public final class ProductSpecifications {
    private ProductSpecifications() {}

    public static Specification<Product> status(ProductStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Product> publicVisible() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), ProductStatus.INACTIVE);
    }

    public static Specification<Product> categorySlug(String slug) {
        return (root, query, cb) -> slug == null || slug.isBlank() ? cb.conjunction() : cb.equal(root.join("category").get("slug"), slug);
    }

    public static Specification<Product> brand(String brand) {
        return (root, query, cb) -> brand == null || brand.isBlank() ? cb.conjunction() : cb.equal(cb.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            if (max != null) return cb.lessThanOrEqualTo(root.get("price"), max);
            return cb.conjunction();
        };
    }

    public static Specification<Product> search(String queryText) {
        return (root, query, cb) -> {
            if (queryText == null || queryText.isBlank()) return cb.conjunction();
            String like = "%" + queryText.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("model")), like),
                    cb.like(cb.lower(root.get("brand")), like),
                    cb.like(cb.lower(root.join("category", JoinType.LEFT).get("name")), like)
            );
        };
    }

    public static Specification<Product> color(String color) {
        return (root, query, cb) -> {
            if (color == null || color.isBlank()) return cb.conjunction();
            var attr = root.join("attributes", JoinType.LEFT);
            query.distinct(true);
            return cb.and(
                    cb.like(cb.lower(attr.get("name")), "%rang%"),
                    cb.equal(cb.lower(attr.get("value")), color.toLowerCase())
            );
        };
    }
}
