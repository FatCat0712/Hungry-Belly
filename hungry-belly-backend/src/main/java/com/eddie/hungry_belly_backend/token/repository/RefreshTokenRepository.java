package com.eddie.hungry_belly_backend.token.repository;

import com.eddie.hungry_belly_backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByToken(String token);

    @Modifying
    void deleteByUserId(Long userId);
}
