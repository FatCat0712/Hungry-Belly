package com.eddie.hungry_belly_backend.token.service;

import com.eddie.hungry_belly_backend.entity.RefreshToken;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.security.jwt.JwtUtils;
import com.eddie.hungry_belly_backend.token.repository.RefreshTokenRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshExpirationInMils;

    public String generateRefreshToken(String email) {
        String token = jwtUtils.generateRefreshToken(email);
        User dbUser = userService.findByEmail(email);
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setToken(token);
        refreshToken.setUser(dbUser);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationInMils));

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    public RefreshToken findRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public void invalidateTokenByUserId(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

}
