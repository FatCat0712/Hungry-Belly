package com.eddie.hungry_belly_backend.auth.controller;

import com.eddie.hungry_belly_backend.auth.service.AuthService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.CookieUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.security.AppUserDetails;
import com.eddie.hungry_belly_backend.token.service.TokenService;
import com.eddie.hungry_belly_backend.user.dto.request.LoginRequest;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.UploadRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
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

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthService authService;
    private final StorageService storageService;
    private final TokenService tokenService;
    private final CookieUtils cookieUtils;

    @Value("${auth.token.accessExpirationInMils}")
    private Long accessExpirationInMils;

    @Value("${auth.token.refreshExpirationInMils}")
    private Long refreshExpirationInMils;


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String[] tokens = tokenService.issueTokens(request.getEmail(), authentication);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], accessExpirationInMils);
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], refreshExpirationInMils);

        return ResponseEntity.ok(ApiResponse.success(null, "Login"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String token = cookieUtils.extractTokenFromCookies(request, "refreshToken");
        String[] tokens = tokenService.refresh(token);
        cookieUtils.addTokenCookie(response, "accessToken", tokens[0], accessExpirationInMils);
        cookieUtils.addTokenCookie(response, "refreshToken", tokens[1], refreshExpirationInMils);
        return ResponseEntity.ok(ApiResponse.success(null, "Access token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        cookieUtils.clearCookie(response, "accessToken");
        cookieUtils.clearCookie(response, "refreshToken");
        tokenService.logout();
        return ResponseEntity.ok(ApiResponse.success(null, "Logout"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getLoggedInUser() {
        AppUserDetails userDetails = authService.getCurrentLoginUser();

        User dbUser = userService.findUserById(userDetails.getId());

        Set<String> roles = dbUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String photoUrl = userService.generateUserPhotoPath(dbUser);

        UserResponse response = UserResponse.builder()
                .id(dbUser.getId())
                .firstName(dbUser.getFirstName())
                .lastName(dbUser.getLastName())
                .email(dbUser.getEmail())
                .enabled(dbUser.isEnabled())
                .photo(photoUrl)
                .roles(roles)
                .build();
        return ResponseEntity.ok(ApiResponse.success(response, "Authenticated info fetched"));
    }

    @PutMapping("/update-account")
    public ResponseEntity<ApiResponse<?>> updateAccount(@Valid @RequestBody UserUpdateRequest request) {
        AppUserDetails userDetails = authService.getCurrentLoginUser();
        UserResponse response = userService.updateUserInfo(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Account updated"));
    }

    @PostMapping("/presigned")
    public ResponseEntity<ApiResponse<?>> getUploadUrl(@RequestBody UploadRequest request) {
        var response = storageService.generateUploadUrl(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Account photo updated"));
    }





}
