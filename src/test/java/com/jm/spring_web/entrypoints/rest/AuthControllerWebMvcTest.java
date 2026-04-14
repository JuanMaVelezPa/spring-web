package com.jm.spring_web.entrypoints.rest;

import com.jm.spring_web.application.security.model.AuthResult;
import com.jm.spring_web.application.security.usecase.AuthenticateUserUseCase;
import com.jm.spring_web.application.common.exception.UnprocessableEntityException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "security.default-user.username=admin",
        "security.default-user.password=admin123"
})
class AuthControllerWebMvcTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticateUserUseCase authenticateUserUseCase;

    @Test
    void shouldLoginSuccessfullyWithValidPayload() throws Exception {
        Mockito.when(authenticateUserUseCase.execute(Mockito.any())).thenReturn(new AuthResult("jwt-token"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username":"admin",
                                  "password":"admin123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void shouldReturnBadRequestForInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username":"",
                                  "password":""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Bad Request"))
                .andExpect(jsonPath("$.detail").value("Validation failed for one or more fields"))
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors[0].field").exists())
                .andExpect(jsonPath("$.errors[0].message").exists());
        verify(authenticateUserUseCase, never()).execute(Mockito.any());
    }

    @Test
    void shouldReturnUnprocessableWhenCredentialsAreInvalid() throws Exception {
        Mockito.when(authenticateUserUseCase.execute(Mockito.any()))
                .thenThrow(new UnprocessableEntityException("Invalid credentials"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username":"admin",
                                  "password":"wrong"
                                }
                                """))
                .andExpect(status().is(422))
                .andExpect(jsonPath("$.detail").value("Invalid credentials"));
    }
}
