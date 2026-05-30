package com.eddie.hungry_belly_backend.auth.controller;

import com.eddie.hungry_belly_backend.auth.service.AuthService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.config.properties.AuthTokenProperties;
import com.eddie.hungry_belly_backend.token.service.TokenService;
import com.eddie.hungry_belly_backend.user.dto.request.LoginRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
@Tag(name = "Authentication", description = "Endpoints for login, token refresh, logout, and current account operations")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final TokenService tokenService;
    private final CookieUtils cookieUtils;
    private final AuthTokenProperties authTokenProperties;


    @Operation(summary = "Login", description = "Authenticates a user and issues access and refresh token cookies.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> authenticateUser(@RequestBody @Valid LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String[] tokens = tokenService.issueTokens(authentication, httpRequest);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], authTokenProperties.getAccessExpirationInMils());
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], authTokenProperties.getRefreshExpirationInMils());
        ApiResponse<?> body = ApiResponse.success(null, "Login");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Refresh access token", description = "Refreshes JWT tokens using the refresh token cookie.")
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String token = cookieUtils.extractTokenFromCookies(request, "refreshToken");
        cookieUtils.clearCookie(response, "accessToken");
        cookieUtils.clearCookie(response, "refreshToken");
        String[] tokens = tokenService.refresh(token);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], authTokenProperties.getAccessExpirationInMils());
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], authTokenProperties.getRefreshExpirationInMils());
        ApiResponse<?> body = ApiResponse.success(null, "Access token refreshed");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Logout", description = "Clears auth cookies and invalidates the current refresh token.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieUtils.extractTokenFromCookies(request, "refreshToken");
        tokenService.logout(refreshToken);
        cookieUtils.clearCookie(response, "accessToken");
        cookieUtils.clearCookie(response, "refreshToken");
        ApiResponse<?> body = ApiResponse.success(null, "Logout");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get current user", description = "Returns the authenticated user's profile.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getLoggedInUser() {
        UserResponse response = authService.getCurrentLoginUserInfo();
        ApiResponse<?> body = ApiResponse.success(response, "Authenticated user fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update current account", description = "Updates profile information for the authenticated user.")
    @PutMapping("/update-account")
    public ResponseEntity<ApiResponse<?>> updateAccount(@Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = authService.updateCurrentLoginUser(request);
        ApiResponse<?> body = ApiResponse.success(response, "Account updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

}
