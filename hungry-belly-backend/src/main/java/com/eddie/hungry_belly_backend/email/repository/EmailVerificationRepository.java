package com.eddie.hungry_belly_backend.email.repository;

import com.eddie.hungry_belly_backend.entity.EmailVerification;
import com.eddie.hungry_belly_backend.entity.TokenType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends CrudRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByTokenAndTokenType(String token, TokenType tokenType);
    void deleteByUserIdAndTokenType(Long userId, TokenType tokenType);
}
