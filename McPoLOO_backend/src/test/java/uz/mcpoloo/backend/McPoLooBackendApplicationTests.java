package uz.mcpoloo.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import uz.mcpoloo.backend.domain.Category;
import uz.mcpoloo.backend.domain.Product;
import uz.mcpoloo.backend.dto.ProductRequest;
import uz.mcpoloo.backend.enums.ProductStatus;
import uz.mcpoloo.backend.repository.CategoryRepository;
import uz.mcpoloo.backend.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@SpringBootTest
@ActiveProfiles("test")
class McPoLooBackendApplicationTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void categoryListReturnsSeededCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("unitazlar"));
    }

    @Test
    void productListSupportsSearchAndPagination() throws Exception {
        mockMvc.perform(get("/api/products").param("q", "M5032").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].model").value("M5032"))
                .andExpect(jsonPath("$.size").value(2));
    }

    @Test
    void publicProductsHideOnlyInactiveProducts() throws Exception {
        Category category = categoryRepository.findBySlug("unitazlar").orElseThrow();
        productRepository.save(testProduct("Out of stock test", "out-of-stock-test", "OST100", ProductStatus.OUT_OF_STOCK, category));
        productRepository.save(testProduct("Inactive test", "inactive-test", "INT100", ProductStatus.INACTIVE, category));

        mockMvc.perform(get("/api/products").param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].status", hasItem("OUT_OF_STOCK")))
                .andExpect(jsonPath("$.content[*].status", everyItem(not("INACTIVE"))));
    }

    @Test
    void adminEndpointIsProtected() throws Exception {
        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanCreateUpdateAndDeleteProduct() throws Exception {
        var category = categoryRepository.findBySlug("unitazlar").orElseThrow();
        ProductRequest create = new ProductRequest(
                "Test unitaz",
                "test-unitaz",
                "Mc PoLOO",
                "T100",
                new BigDecimal("1000000"),
                null,
                "Test description",
                "https://example.com/image.webp",
                ProductStatus.ACTIVE,
                false,
                true,
                category.getId(),
                List.of(),
                List.of()
        );

        String response = mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(create)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("test-unitaz"))
                .andReturn().getResponse().getContentAsString();

        String id = objectMapper.readTree(response).get("id").asText();
        ProductRequest update = new ProductRequest(
                "Test unitaz updated",
                "test-unitaz-updated",
                "Mc PoLOO",
                "T101",
                new BigDecimal("1200000"),
                new BigDecimal("1300000"),
                "Updated",
                "https://example.com/image.webp",
                ProductStatus.OUT_OF_STOCK,
                true,
                false,
                category.getId(),
                List.of(),
                List.of()
        );

        mockMvc.perform(put("/api/admin/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("OUT_OF_STOCK"))
                .andExpect(jsonPath("$.oldPrice").value(1300000));

        mockMvc.perform(delete("/api/admin/products/{id}", id))
                .andExpect(status().isOk());
    }

    private Product testProduct(String name, String slug, String model, ProductStatus status, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setBrand("Mc PoLOO");
        product.setModel(model);
        product.setPrice(new BigDecimal("1000000"));
        product.setMainImageUrl("https://example.com/image.webp");
        product.setStatus(status);
        product.setCategory(category);
        return product;
    }
}
