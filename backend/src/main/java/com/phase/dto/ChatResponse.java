package com.phase.dto;

/* Resposta do chat: ID da sessão + texto de resposta */
public record ChatResponse(
        Long sessionId,
        String reply
) {}
