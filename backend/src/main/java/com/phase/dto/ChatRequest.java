package com.phase.dto;

/* Payload de envio de mensagem no chat */
public record ChatRequest(
        Long sessionId,
        String message,
        String image
) {}
