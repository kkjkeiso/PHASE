package com.phase.service;

import com.phase.entity.User;
import com.phase.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/* Serviço de usuários — consulta, persistência e geração de username */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /* Busca usuário por e-mail */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /* Verifica se e-mail já está cadastrado */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /* Persiste ou atualiza um usuário */
    public User save(User user) {
        return userRepository.save(user);
    }

    /* Gera username único baseado no nome do usuário */
    public String generateUniqueUsername(String baseName) {
        // Converte para minúsculas e remove caracteres especiais
        String baseUsername = baseName.toLowerCase().replaceAll("[^a-z0-9]", "");
        if (baseUsername.isEmpty()) {
            baseUsername = "user";
        }
        
        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        return username;
    }

    /* Busca usuário por ID */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /* Verifica se username já está em uso */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
