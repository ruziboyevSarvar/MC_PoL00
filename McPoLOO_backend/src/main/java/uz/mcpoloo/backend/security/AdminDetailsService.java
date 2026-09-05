package uz.mcpoloo.backend.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import uz.mcpoloo.backend.repository.AdminUserRepository;

import java.util.List;

@Service
public class AdminDetailsService implements UserDetailsService {
    private final AdminUserRepository adminUserRepository;

    public AdminDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var admin = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin topilmadi"));
        return new User(admin.getUsername(), admin.getPasswordHash(), admin.isEnabled(), true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole().name())));
    }
}
