package com.phase.dto;

import com.phase.entity.ChatSession;
import java.time.LocalDateTime;

/* Projeção de sessão para listagem na API */
public record ChatSessionDTO(
        Long id,
        String title,
        LocalDateTime updatedAt
) {
    /* Converte entidade para DTO */
    public static ChatSessionDTO fromEntity(ChatSession session) {
        return new ChatSessionDTO(session.getId(), session.getTitle(), session.getUpdatedAt());
    }
}
