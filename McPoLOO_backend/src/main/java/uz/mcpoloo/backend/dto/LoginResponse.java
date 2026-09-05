package uz.mcpoloo.backend.dto;

public record LoginResponse(String token, String tokenType, long expiresInSeconds) {}
