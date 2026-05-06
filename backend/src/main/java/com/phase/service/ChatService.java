package com.phase.service;

import com.phase.dto.ChatMessageDTO;
import com.phase.dto.ChatSessionDTO;
import com.phase.entity.ChatMessage;
import com.phase.entity.ChatSession;
import com.phase.repository.ChatMessageRepository;
import com.phase.repository.ChatSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/* Serviço de chat — gerencia sessões, mensagens e integração com IA */
@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final GroqService groqService;

    public ChatService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository, GroqService groqService) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.groqService = groqService;
    }

    /* Lista sessões do usuário ordenadas pela última atualização */
    public List<ChatSessionDTO> getUserSessions(Long userId) {
        return chatSessionRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(ChatSessionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /* Retorna mensagens de uma sessão após validar acesso */
    public List<ChatMessageDTO> getSessionMessages(Long sessionId, Long userId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));
        
        if (!session.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Acesso negado à sessão");
        }

        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream()
                .map(ChatMessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /* Processa mensagem: cria/recupera sessão, salva msg do user, chama IA, salva resposta */
    @Transactional
    public Long processMessage(Long userId, Long sessionId, String userMessage, String image) {
        ChatSession session;

        if (sessionId == null) {
            // Nova sessão
            session = new ChatSession();
            session.setUserId(userId);
            // Título baseado nas primeiras palavras da mensagem
            String title = userMessage.length() > 30 ? userMessage.substring(0, 30) + "..." : userMessage;
            session.setTitle(title);
            session = chatSessionRepository.save(session);
        } else {
            session = chatSessionRepository.findById(sessionId)
                    .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));
            if (!session.getUserId().equals(userId)) {
                throw new IllegalArgumentException("Acesso negado à sessão");
            }
            // Atualiza o timestamp
            session = chatSessionRepository.save(session);
        }

        // Salvar mensagem do usuário
        ChatMessage userMsgEntity = new ChatMessage();
        userMsgEntity.setSession(session);
        userMsgEntity.setRole("user");
        userMsgEntity.setContent(userMessage);
        chatMessageRepository.save(userMsgEntity);

        // Chamar a IA
        String botReply = groqService.chat(userMessage, image);

        // Salvar resposta do bot
        ChatMessage botMsgEntity = new ChatMessage();
        botMsgEntity.setSession(session);
        botMsgEntity.setRole("bot");
        botMsgEntity.setContent(botReply);
        chatMessageRepository.save(botMsgEntity);

        return session.getId();
    }
}
