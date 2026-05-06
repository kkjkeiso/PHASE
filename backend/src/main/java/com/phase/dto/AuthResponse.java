package com.phase.dto;

import java.util.Map;

/* Resposta de autenticação: token JWT + dados do usuário */
public record AuthResponse(
        String token,
        Map<String, Object> user
) {}
