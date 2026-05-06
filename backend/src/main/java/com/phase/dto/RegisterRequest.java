package com.phase.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/* DTO de registro: nome, e-mail e senha */
public record RegisterRequest(
        @NotBlank @Size(min = 2) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8) String password
) {}
