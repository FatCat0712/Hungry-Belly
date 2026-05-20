package com.eddie.hungry_belly_backend.token.service;

import com.eddie.hungry_belly_backend.config.properties.AuthTokenProperties;
import com.eddie.hungry_belly_backend.entity.RefreshToken;
import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.entity.user.UserSession;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.security.AppUserDetails;
import com.eddie.hungry_belly_backend.security.jwt.JwtUtils;
import com.eddie.hungry_belly_backend.session.service.SessionService;
import com.eddie.hungry_belly_backend.token.repository.RefreshTokenRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthTokenProperties authTokenProperties;
    private final SessionService sessionService;

    @Transactional
    public String[] issueTokens(Authentication authentication, HttpServletRequest request) {
        AppUserDetails appUserDetails = (AppUserDetails) authentication.getPrincipal();
        Long userId = appUserDetails.getId();
        User dbUser = userService.findUserById(userId);
        UserSession session = sessionService.createSession(dbUser, request);
        return buildAndSaveTokens(authentication, dbUser, session, session.getId());
    }

    private String[] buildAndSaveTokens(Authentication authentication, User dbUser, UserSession session, Long familyId) {

        String accessToken = jwtUtils.generateAccessToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(dbUser.getEmail());

        RefreshToken savedRefreshToken = new RefreshToken();
        savedRefreshToken.setToken(refreshToken);
        savedRefreshToken.setUser(dbUser);
        savedRefreshToken.setSession(session);
        savedRefreshToken.setFamilyId(familyId);
        savedRefreshToken.setUsed(false);
        savedRefreshToken.setExpiryDate(Instant.now().plusMillis(authTokenProperties.getRefreshExpirationInMils()));

        refreshTokenRepository.save(savedRefreshToken);
        return new String[]{accessToken, refreshToken};
    }

    @Transactional
    public String[] refresh(String token) {
        if (!StringUtils.hasText(token)) {
            throw new BadRequestException("Refresh token is missing");
        }

        if (!jwtUtils.validateToken(token)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        RefreshToken storedRefreshToken = refreshTokenRepository.findByTokenForUpdate(token)
                .orElseThrow(() -> new BadRequestException("Invalid or already used refresh token"));

        if (storedRefreshToken.isUsed()) {
            revokeTokenFamily(storedRefreshToken);
            throw new BadRequestException("Refresh token reuse detected");
        }

        if (storedRefreshToken.getExpiryDate().isBefore(Instant.now())) {
            revokeTokenFamily(storedRefreshToken);
            throw new BadRequestException("Refresh token expired");
        }

        UserSession session = storedRefreshToken.getSession();
        if (session == null || !session.isValid()) {
            throw new BadRequestException("Session is no longer active");
        }

        storedRefreshToken.setUsed(true);
        refreshTokenRepository.save(storedRefreshToken);

        User user = storedRefreshToken.getUser();
        AppUserDetails userDetails = AppUserDetails.buildUserDetails(user);
        return buildAndSaveTokens(
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()),
                user,
                session,
                storedRefreshToken.getFamilyId()
        );
    }


    private void revokeTokenFamily(RefreshToken refreshToken) {
        refreshTokenRepository.deleteAllByFamilyId(refreshToken.getFamilyId());
        sessionService.invalidateSession(refreshToken.getSession());
    }

    @Transactional
    public void logout(String refreshToken) {
        if (StringUtils.hasText(refreshToken)) {
            refreshTokenRepository.findByTokenForUpdate(refreshToken).ifPresent(this::revokeTokenFamily);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails appUserDetails)) {
            return;
        }

        refreshTokenRepository.deleteByUserEmail(appUserDetails.getEmail());
    }

}
