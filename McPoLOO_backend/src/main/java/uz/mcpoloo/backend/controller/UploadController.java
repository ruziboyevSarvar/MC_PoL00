package uz.mcpoloo.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uz.mcpoloo.backend.dto.UploadResponse;
import uz.mcpoloo.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/admin/uploads")
public class UploadController {
    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/images")
    public UploadResponse upload(@RequestPart("file") MultipartFile file) {
        FileStorageService.StoredImage image = fileStorageService.saveImage(file);
        return new UploadResponse(image.objectKey(), image.url());
    }
}
