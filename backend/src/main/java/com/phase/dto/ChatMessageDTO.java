package com.phase.dto;

import com.phase.entity.ChatMessage;
import java.time.LocalDateTime;

/* Projeção de mensagem para resposta da API */
public record ChatMessageDTO(
        Long id,
        String role,
        String content,
        LocalDateTime createdAt
) {
    /* Converte entidade para DTO */
    public static ChatMessageDTO fromEntity(ChatMessage message) {
        return new ChatMessageDTO(
                message.getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
