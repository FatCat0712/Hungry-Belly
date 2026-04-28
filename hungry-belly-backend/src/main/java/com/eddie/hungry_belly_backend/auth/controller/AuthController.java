package com.eddie.hungry_belly_backend.auth.controller;

import com.eddie.hungry_belly_backend.auth.service.AuthService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.UploadRequest;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.token.service.TokenService;
import com.eddie.hungry_belly_backend.user.dto.request.LoginRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final StorageService storageService;
    private final TokenService tokenService;
    private final CookieUtils cookieUtils;

    @Value("${auth.token.accessExpirationInMils}")
    private Long accessExpirationInMils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshExpirationInMils;


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> authenticateUser(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String[] tokens = tokenService.issueTokens(request.getEmail(), authentication);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], accessExpirationInMils);
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], refreshExpirationInMils);
        ApiResponse<?> body = ApiResponse.success(null, "Login");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<?>> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String token = cookieUtils.extractTokenFromCookies(request, "refreshToken");
        String[] tokens = tokenService.refresh(token);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], accessExpirationInMils);
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], refreshExpirationInMils);
        ApiResponse<?> body = ApiResponse.success(null, "Access token refreshed");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletResponse response) {
        cookieUtils.clearCookie(response, "accessToken");
        cookieUtils.clearCookie(response, "refreshToken");
        tokenService.logout();
        ApiResponse<?> body = ApiResponse.success(null, "Logout");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getLoggedInUser() {
        UserResponse response = authService.getCurrentLoginUserInfo();
        ApiResponse<?> body = ApiResponse.success(response, "Authenticated user fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PutMapping("/update-account")
    public ResponseEntity<ApiResponse<?>> updateAccount(@Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = authService.updateCurrentLoginUser(request);
        ApiResponse<?> body = ApiResponse.success(response, "Account updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping("/presigned")
    public ResponseEntity<ApiResponse<?>> getUploadUrl(@RequestBody UploadRequest request) {
        var response = storageService.generateUploadUrl(request);
        ApiResponse<?> body = ApiResponse.success(response, "Account photo updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }





}
