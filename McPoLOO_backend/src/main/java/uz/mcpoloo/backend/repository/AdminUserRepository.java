package uz.mcpoloo.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.mcpoloo.backend.domain.AdminUser;

import java.util.Optional;
import java.util.UUID;

public interface AdminUserRepository extends JpaRepository<AdminUser, UUID> {
    Optional<AdminUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
