package uz.mcpoloo.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "image/avif");
    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Rasm fayli bo'sh");
        }
        if (!ALLOWED.contains(file.getContentType())) {
            throw new IllegalArgumentException("Faqat JPG, PNG, WebP yoki AVIF rasm yuklash mumkin");
        }
        String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String ext = original.contains(".") ? original.substring(original.lastIndexOf(".")).toLowerCase() : ".webp";
        if (!Set.of(".jpg", ".jpeg", ".png", ".webp", ".avif").contains(ext)) {
            throw new IllegalArgumentException("Rasm kengaytmasi noto'g'ri");
        }
        try {
            Files.createDirectories(uploadDir);
            String fileName = UUID.randomUUID() + ext;
            Files.copy(file.getInputStream(), uploadDir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new IllegalStateException("Rasmni saqlab bo'lmadi", e);
        }
    }

    public Path uploadDir() {
        return uploadDir;
    }
}
