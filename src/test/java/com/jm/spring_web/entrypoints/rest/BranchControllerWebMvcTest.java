package com.jm.spring_web.entrypoints.rest;

import com.jm.spring_web.application.branch.model.BranchResult;
import com.jm.spring_web.application.branch.usecase.CreateBranchUseCase;
import com.jm.spring_web.application.branch.usecase.DeactivateBranchUseCase;
import com.jm.spring_web.application.branch.usecase.GetBranchUseCase;
import com.jm.spring_web.application.branch.usecase.ListBranchesUseCase;
import com.jm.spring_web.application.branch.usecase.UpdateBranchUseCase;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "security.default-user.username=admin",
        "security.default-user.password=admin123"
})
class BranchControllerWebMvcTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CreateBranchUseCase createBranchUseCase;
    @MockitoBean
    private GetBranchUseCase getBranchUseCase;
    @MockitoBean
    private ListBranchesUseCase listBranchesUseCase;
    @MockitoBean
    private UpdateBranchUseCase updateBranchUseCase;
    @MockitoBean
    private DeactivateBranchUseCase deactivateBranchUseCase;
    @Test
    void shouldRejectUnauthorizedRequestForProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/branches"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldReturnListWhenAuthenticated() throws Exception {
        Mockito.when(listBranchesUseCase.execute()).thenReturn(List.of(
                new BranchResult(
                        UUID.randomUUID(),
                        "BR001",
                        "Main",
                        "Madrid",
                        true,
                        LocalDateTime.now(),
                        LocalDateTime.now())
        ));

        mockMvc.perform(get("/api/v1/branches"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].code").value("BR001"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldReturnBadRequestWhenCreatePayloadIsInvalid() throws Exception {
        mockMvc.perform(post("/api/v1/branches")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "code":"",
                                  "name":"",
                                  "city":""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Bad Request"))
                .andExpect(jsonPath("$.detail").value("Validation failed for one or more fields"))
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors[0].field").exists())
                .andExpect(jsonPath("$.errors[0].message").exists());
    }
}
