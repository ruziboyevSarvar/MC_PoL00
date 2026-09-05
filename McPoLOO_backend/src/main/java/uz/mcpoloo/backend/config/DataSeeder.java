package uz.mcpoloo.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import uz.mcpoloo.backend.domain.*;
import uz.mcpoloo.backend.enums.ProductStatus;
import uz.mcpoloo.backend.repository.AdminUserRepository;
import uz.mcpoloo.backend.repository.CategoryRepository;
import uz.mcpoloo.backend.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(AdminUserRepository adminUserRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.username}") String username,
                           @Value("${app.admin.password}") String password) {
        return args -> {
            if (!adminUserRepository.existsByUsername(username)) {
                AdminUser admin = new AdminUser();
                admin.setUsername(username);
                admin.setPasswordHash(passwordEncoder.encode(password));
                adminUserRepository.save(admin);
            }
            if (categoryRepository.count() == 0) {
                categoryRepository.saveAll(List.of(
                        category("Unitazlar", "unitazlar", "Premium devorga osma va polga o'rnatiladigan unitazlar", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80", 1),
                        category("Rakovinalar", "rakovinalar", "Zamonaviy interyer uchun rakovinalar", "https://images.unsplash.com/photo-1580229080435-1c7e2ce835dd?auto=format&fit=crop&w=900&q=80", 2),
                        category("Dush sistemalari", "dush-sistemalari", "Yomg'ir dushi va termo boshqaruvli sistemalar", "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80", 3),
                        category("Smesitellar", "smesitellar", "Minimal va mustahkam smesitellar", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80", 4),
                        category("Vannalar", "vannalar", "Premium vanna yechimlari", "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&w=900&q=80", 5),
                        category("Aksessuarlar", "aksessuarlar", "Santexnika aksessuarlari", "https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=900&q=80", 6)
                ));
            }
            if (productRepository.count() == 0) {
                var unitaz = categoryRepository.findBySlug("unitazlar").orElseThrow();
                var dush = categoryRepository.findBySlug("dush-sistemalari").orElseThrow();
                var rakovina = categoryRepository.findBySlug("rakovinalar").orElseThrow();
                productRepository.save(sample("Osma unitaz", "osma-unitaz-mcpoloo-m2056", "M2056", unitaz, "White", "Keramika", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", true));
                productRepository.save(sample("Zamonaviy dush sistemi", "mcpoloo-m5032-dush-sistemasi", "M5032", dush, "Black", "Latun", "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80", true));
                productRepository.save(sample("Stol usti rakovina", "stol-usti-rakovina-mcpoloo-r108", "R108", rakovina, "White", "Keramika", "https://images.unsplash.com/photo-1580229080435-1c7e2ce835dd?auto=format&fit=crop&w=1200&q=80", false));
            }
        };
    }

    private Category category(String name, String slug, String description, String imageUrl, int sortOrder) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setSortOrder(sortOrder);
        category.setActive(true);
        return category;
    }

    private Product sample(String name, String slug, String model, Category category, String color, String material, String image, boolean featured) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setBrand("Mc PoLOO");
        product.setModel(model);
        product.setPrice(new BigDecimal("1450000"));
        product.setDescription("Mc PoLOO katalogi uchun premium mahsulot namunasi. Real loyiha ma'lumotlari admin panel orqali kiritiladi.");
        product.setMainImageUrl(image);
        product.setStatus(ProductStatus.ACTIVE);
        product.setFeatured(featured);
        product.setNewArrival(true);
        product.setCategory(category);
        ProductImage gallery = new ProductImage();
        gallery.setUrl(image);
        gallery.setAlt(name);
        product.replaceImages(List.of(gallery));
        ProductAttribute materialAttr = new ProductAttribute();
        materialAttr.setName("Material");
        materialAttr.setValue(material);
        ProductAttribute colorAttr = new ProductAttribute();
        colorAttr.setName("Rang");
        colorAttr.setValue(color);
        ProductAttribute warranty = new ProductAttribute();
        warranty.setName("Kafolat");
        warranty.setValue("Ma'lumot admin panelda sozlanadi");
        product.replaceAttributes(List.of(materialAttr, colorAttr, warranty));
        return product;
    }
}
