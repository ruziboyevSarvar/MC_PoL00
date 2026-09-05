package uz.mcpoloo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.mcpoloo.backend.domain.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Category> findByActiveTrueOrderBySortOrderAscNameAsc();
}
