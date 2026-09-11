package uz.mcpoloo.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "image/avif");
    private final Path uploadDir;
    private final S3Client s3Client;
    private final String bucket;
    private final String cdnBaseUrl;

    public FileStorageService(
            @Value("${app.upload-dir}") String uploadDir,
            @Value("${acdn.s3.bucket}") String bucket,
            @Value("${acdn.cdn-base-url}") String cdnBaseUrl,
            S3Client s3Client
    ) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        this.bucket = bucket;
        this.cdnBaseUrl = cdnBaseUrl.replaceAll("/+$", "");
        this.s3Client = s3Client;
    }

    public StoredImage saveImage(MultipartFile file) {
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
        validateImageSignature(file, ext);
        String objectKey = "products/" + UUID.randomUUID() + ext;
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .cacheControl("public, max-age=31536000, immutable")
                    .build();
            try (InputStream inputStream = file.getInputStream()) {
                s3Client.putObject(request, RequestBody.fromInputStream(inputStream, file.getSize()));
            }
            return new StoredImage(objectKey, cdnBaseUrl + "/" + objectKey);
        } catch (IOException e) {
            throw new StorageException("Rasmni o'qib bo'lmadi", e);
        } catch (RuntimeException e) {
            throw new StorageException("Rasmni ACDN S3 ga yuklab bo'lmadi", e);
        }
    }

    public Path uploadDir() {
        return uploadDir;
    }

    public record StoredImage(String objectKey, String url) {}

    private void validateImageSignature(MultipartFile file, String ext) {
        try (InputStream inputStream = file.getInputStream()) {
            byte[] header = inputStream.readNBytes(16);
            boolean valid = switch (ext) {
                case ".jpg", ".jpeg" -> header.length >= 3
                        && (header[0] & 0xff) == 0xff
                        && (header[1] & 0xff) == 0xd8
                        && (header[2] & 0xff) == 0xff;
                case ".png" -> startsWith(header, new byte[]{(byte) 0x89, 0x50, 0x4e, 0x47});
                case ".webp" -> header.length >= 12
                        && asciiEquals(header, 0, "RIFF")
                        && asciiEquals(header, 8, "WEBP");
                case ".avif" -> header.length >= 12
                        && asciiEquals(header, 4, "ftyp")
                        && asciiEquals(header, 8, "avif");
                default -> false;
            };
            if (!valid) {
                throw new IllegalArgumentException("Rasm fayli formati noto'g'ri");
            }
        } catch (IOException e) {
            throw new StorageException("Rasmni o'qib bo'lmadi", e);
        }
    }

    private boolean startsWith(byte[] source, byte[] expected) {
        if (source.length < expected.length) return false;
        for (int i = 0; i < expected.length; i++) {
            if (source[i] != expected[i]) return false;
        }
        return true;
    }

    private boolean asciiEquals(byte[] source, int offset, String expected) {
        if (source.length < offset + expected.length()) return false;
        for (int i = 0; i < expected.length(); i++) {
            if (source[offset + i] != (byte) expected.charAt(i)) return false;
        }
        return true;
    }
}
