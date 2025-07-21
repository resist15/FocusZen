package com.focuszen.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.focuszen.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
}
