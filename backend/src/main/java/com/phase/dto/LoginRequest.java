package com.phase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/* DTO de login: e-mail e senha */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
) {}
