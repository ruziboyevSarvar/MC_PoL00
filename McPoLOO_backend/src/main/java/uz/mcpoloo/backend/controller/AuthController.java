package uz.mcpoloo.backend.controller;

import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import uz.mcpoloo.backend.dto.LoginRequest;
import uz.mcpoloo.backend.dto.LoginResponse;
import uz.mcpoloo.backend.security.AdminDetailsService;
import uz.mcpoloo.backend.security.JwtService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AdminDetailsService adminDetailsService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, AdminDetailsService adminDetailsService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.adminDetailsService = adminDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        UserDetails user = adminDetailsService.loadUserByUsername(request.username());
        return new LoginResponse(jwtService.generate(user), "Bearer", jwtService.expirationSeconds());
    }
}
