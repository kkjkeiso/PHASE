package com.phase.repository;

import com.phase.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/* Repositório JPA para a entidade User */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
