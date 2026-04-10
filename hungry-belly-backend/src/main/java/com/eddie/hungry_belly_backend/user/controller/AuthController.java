package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.entity.RefreshToken;
import com.eddie.hungry_belly_backend.security.AppUserDetails;
import com.eddie.hungry_belly_backend.security.AppUserDetailsService;
import com.eddie.hungry_belly_backend.security.jwt.JwtUtils;
import com.eddie.hungry_belly_backend.token.service.RefreshTokenService;
import com.eddie.hungry_belly_backend.user.dto.request.LoginRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AuthUserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;
    private final AppUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    @Value("${auth.token.accessExpirationInMils}")
    private Long accessExpirationInMils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshExpirationInMils;


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String accessToken = jwtUtils.generateAccessToken(authentication);
        String refreshToken = refreshTokenService.generateRefreshToken(request.getEmail());
        cookieUtils.addTokenCookie(response, "accessToken", accessToken, accessExpirationInMils);
        cookieUtils.addTokenCookie(response, "refreshToken", refreshToken,refreshExpirationInMils);
        return ResponseEntity.ok(ApiResponse.success(null, "Login"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String token = cookieUtils.extractTokenFromCookies(request, "refreshToken");

        RefreshToken savedRefreshToken = refreshTokenService.findRefreshToken(token);

        if(savedRefreshToken == null) {
           return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), "Invalid or expired refresh token"));
        }
        else {
            String refreshToken = savedRefreshToken.getToken();
            boolean isValid = jwtUtils.validateToken(token);
            if(isValid) {
                String usernameFromToken = jwtUtils.getUsernameFromToken(refreshToken);
                UserDetails userDetails =  userDetailsService.loadUserByUsername(usernameFromToken);

                String newAccessToken = jwtUtils.generateAccessToken(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
                String newRefreshToken = jwtUtils.generateRefreshToken(usernameFromToken);
                if(newAccessToken != null) {
                    cookieUtils.addTokenCookie(response, "accessToken", newAccessToken, accessExpirationInMils);
                    cookieUtils.addTokenCookie(response, "refreshToken", newRefreshToken,refreshExpirationInMils);
                    return ResponseEntity.ok(ApiResponse.success(null, "Token has been refreshed"));
                }
                else {
                    return ResponseEntity.internalServerError()
                            .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error generating new access token"));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(HttpStatus.FORBIDDEN.value(), "Invalid or expired refresh token"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        cookieUtils.clearCookie(response, "accessToken");
        cookieUtils.clearCookie(response, "refreshToken");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUserDetails userDetails = (AppUserDetails)authentication.getPrincipal();

        refreshTokenService.invalidateTokenByUserId(userDetails.getId());

        return ResponseEntity.ok(ApiResponse.success(null, "Logout"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();

        Set<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

        AuthUserResponse response = AuthUserResponse.builder()
                .id(userDetails.getId())
                .name(userDetails.getName())
                .roles(roles)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Authenticated info fetched"));
    }



}
