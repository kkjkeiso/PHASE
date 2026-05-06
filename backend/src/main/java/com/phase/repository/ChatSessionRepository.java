package com.phase.repository;

import com.phase.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/* Repositório JPA para sessões de chat */
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
