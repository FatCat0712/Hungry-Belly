package com.eddie.hungry_belly_backend.token.service;

import com.eddie.hungry_belly_backend.config.properties.AuthTokenProperties;
import com.eddie.hungry_belly_backend.entity.RefreshToken;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.security.AppUserDetails;
import com.eddie.hungry_belly_backend.security.AppUserDetailsService;
import com.eddie.hungry_belly_backend.security.jwt.JwtUtils;
import com.eddie.hungry_belly_backend.token.repository.RefreshTokenRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AppUserDetailsService userDetailsService;
    private final AuthTokenProperties authTokenProperties;

    @Transactional
    public String[] issueTokens(String email, Authentication authentication) {
        User dbUser = userService.findByEmail(email);
        return buildAndSaveTokens(authentication, dbUser);
    }

    private String[] buildAndSaveTokens(Authentication authentication, User dbUser) {

        String accessToken = jwtUtils.generateAccessToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(dbUser.getEmail());

        RefreshToken savedRefreshToken = refreshTokenRepository.findByUserIdForUpdate(dbUser.getId())
                .orElseGet(RefreshToken::new);
        savedRefreshToken.setToken(refreshToken);
        savedRefreshToken.setUser(dbUser);
        savedRefreshToken.setExpiryDate(Instant.now().plusMillis(authTokenProperties.getRefreshExpirationInMils()));

        refreshTokenRepository.save(savedRefreshToken);
        return new String[]{accessToken, refreshToken};
    }

    @Transactional
    public String[] refresh(String token) {
        if (!jwtUtils.validateToken(token)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        RefreshToken storedRefreshToken = refreshTokenRepository.findByTokenForUpdate(token)
                .orElseThrow(() -> new BadRequestException("Invalid or already used refresh token"));

        String usernameFromToken = jwtUtils.getUsernameFromToken(token);
        if (!storedRefreshToken.getUser().getEmail().equals(usernameFromToken)) {
            throw new BadRequestException("Invalid or already used refresh token");
        }

        AppUserDetails userDetails = (AppUserDetails) userDetailsService.loadUserByUsername(usernameFromToken);
        return buildAndSaveTokens(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()),
                storedRefreshToken.getUser()
        );
    }


    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getPrincipal().toString();
        refreshTokenRepository.deleteByUserEmail(email);
    }

}
