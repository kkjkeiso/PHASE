package com.phase.controller;

import com.phase.dto.ChatMessageDTO;
import com.phase.dto.ChatRequest;
import com.phase.dto.ChatResponse;
import com.phase.dto.ChatSessionDTO;
import com.phase.entity.User;
import com.phase.repository.UserRepository;
import com.phase.service.ChatService;
import com.phase.service.GroqService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/* Controlador de chat — sessões, mensagens e transcrição de áudio */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final GroqService groqService;
    private final UserRepository userRepository;

    public ChatController(ChatService chatService, GroqService groqService, UserRepository userRepository) {
        this.chatService = chatService;
        this.groqService = groqService;
        this.userRepository = userRepository;
    }

    /* Extrai o ID do usuário a partir do token */
    private Long getUserId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return null;
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email).map(User::getId).orElse(null);
    }

    /* Lista todas as sessões do usuário */
    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(Authentication auth) {
        Long userId = getUserId(auth);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Não autenticado"));
        List<ChatSessionDTO> sessions = chatService.getUserSessions(userId);
        return ResponseEntity.ok(sessions);
    }

    /* Retorna mensagens de uma sessão específica */
    @GetMapping("/sessions/{id}/messages")
    public ResponseEntity<?> getSessionMessages(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("message", "Não autenticado"));
        try {
            List<ChatMessageDTO> messages = chatService.getSessionMessages(id, userId);
            return ResponseEntity.ok(messages);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /* Envia mensagem — guest usa IA direto, logado persiste histórico */
    @PostMapping
    public ResponseEntity<?> chat(@Valid @RequestBody ChatRequest request, Authentication auth) {
        Long userId = getUserId(auth);
        
        // Se usuário não estiver logado (Guest), apenas chama a IA sem persistir
        if (userId == null) {
            String reply = groqService.chat(request.message(), request.image());
            return ResponseEntity.ok(new ChatResponse(null, reply));
        }

        // Se logado, passa pelo serviço que gerencia histórico
        try {
            Long sessionId = chatService.processMessage(userId, request.sessionId(), request.message(), request.image());
            List<ChatMessageDTO> messages = chatService.getSessionMessages(sessionId, userId);
            String lastBotReply = messages.get(messages.size() - 1).content();
            
            return ResponseEntity.ok(new ChatResponse(sessionId, lastBotReply));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /* Transcreve áudio via Groq Whisper */
    @PostMapping(value = "/audio", consumes = "multipart/form-data")
    public ResponseEntity<?> transcribeAudio(@RequestParam("file") MultipartFile file) {
        try {
            String transcription = groqService.transcribeAudio(file);
            return ResponseEntity.ok(Map.of("text", transcription));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erro na transcrição: " + e.getMessage()));
        }
    }
}
