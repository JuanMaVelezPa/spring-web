package com.jm.spring_web.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
class BranchFlowIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:18")
            .withDatabaseName("companydb")
            .withUsername("company")
            .withPassword("company");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("security.jwt.secret", () -> "test-secret-test-secret-test-secret-123");
        registry.add("security.jwt.expiration-seconds", () -> "3600");
        registry.add("security.default-user.username", () -> "admin");
        registry.add("security.default-user.password", () -> "admin123");
    }

    @BeforeEach
    void cleanTable() {
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS branch (
                    id UUID PRIMARY KEY,
                    code VARCHAR(30) NOT NULL UNIQUE,
                    name VARCHAR(150) NOT NULL,
                    city VARCHAR(120) NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL
                )
                """);
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS outbox_event (
                    id UUID PRIMARY KEY,
                    aggregate_type VARCHAR(80) NOT NULL,
                    aggregate_id UUID NOT NULL,
                    event_type VARCHAR(120) NOT NULL,
                    payload TEXT NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    retry_count INTEGER NOT NULL DEFAULT 0,
                    created_at TIMESTAMP NOT NULL,
                    processed_at TIMESTAMP NULL
                )
                """);
        Boolean branchTableExists = jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'branch')",
                Boolean.class);
        if (Boolean.TRUE.equals(branchTableExists)) {
            jdbcTemplate.execute("DELETE FROM branch");
        }
        Boolean outboxTableExists = jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'outbox_event')",
                Boolean.class);
        if (Boolean.TRUE.equals(outboxTableExists)) {
            jdbcTemplate.execute("DELETE FROM outbox_event");
        }
    }

    @Test
    void shouldListBranchesWithPaginationRespectingPageSize() throws Exception {
        String token = loginAndGetToken();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < 12; i++) {
            jdbcTemplate.update(
                    """
                            INSERT INTO branch (id, code, name, city, is_active, created_at, updated_at)
                            VALUES (?, ?, ?, ?, true, ?, ?)
                            """,
                    UUID.randomUUID(),
                    "BR-PAGE-" + i,
                    "Branch " + i,
                    "City",
                    now,
                    now);
        }

        mockMvc.perform(get("/api/v1/branches")
                        .param("page", "0")
                        .param("size", "10")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements").value(12))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalPages").value(2));

        mockMvc.perform(get("/api/v1/branches")
                        .param("page", "1")
                        .param("size", "10")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(12))
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalPages").value(2));
    }

    @Test
    void shouldExecuteAuthenticatedBranchFlow() throws Exception {
        String token = loginAndGetToken();

        MvcResult createResult = mockMvc.perform(post("/api/v1/branches")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .content("""
                                {
                                  "code":"BR100",
                                  "name":"HQ",
                                  "city":"Madrid"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("BR100"))
                .andReturn();

        JsonNode created = objectMapper.readTree(createResult.getResponse().getContentAsString());
        UUID branchId = UUID.fromString(created.get("id").asText());

        mockMvc.perform(get("/api/v1/branches/" + branchId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(branchId.toString()))
                .andExpect(jsonPath("$.isActive").value(true));

        mockMvc.perform(patch("/api/v1/branches/" + branchId + "/deactivate")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(false));
    }

    private String loginAndGetToken() throws Exception {
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username":"admin",
                                  "password":"admin123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return loginJson.get("token").asText();
    }
}
