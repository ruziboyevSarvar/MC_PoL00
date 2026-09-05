package uz.mcpoloo.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.mcpoloo.backend.service.FileStorageService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
public class UploadController {
    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/images")
    public Map<String, String> upload(@RequestPart("file") MultipartFile file) {
        return Map.of("url", fileStorageService.saveImage(file));
    }
}
