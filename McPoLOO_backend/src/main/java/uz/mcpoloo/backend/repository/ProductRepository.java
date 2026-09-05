package uz.mcpoloo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import uz.mcpoloo.backend.domain.Product;
import uz.mcpoloo.backend.enums.ProductStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlugAndStatus(String slug, ProductStatus status);
    Optional<Product> findByIdAndStatus(UUID id, ProductStatus status);
    boolean existsBySlug(String slug);
    List<Product> findTop8ByCategorySlugAndStatusNotAndIdNotOrderByCreatedAtDesc(String categorySlug, ProductStatus status, UUID id);
}
