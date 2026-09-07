package uz.mcpoloo.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.mcpoloo.backend.enums.Role;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "admin_users", indexes = @Index(name = "idx_admin_username", columnList = "username", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private Role role = Role.ADMIN;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

}
