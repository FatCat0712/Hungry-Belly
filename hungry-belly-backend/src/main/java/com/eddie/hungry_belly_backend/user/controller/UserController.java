package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.response.ApiResponse;
import com.eddie.hungry_belly_backend.user.dto.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> listUsers() {
            List<AdminUserResponse> listUsers = userService.fetchAllUsers();
            return ResponseEntity.ok(ApiResponse.success(listUsers, "User fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody AdminUserRequest request) {
         userService.createUser(request);
         return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.create(null, "User created"));
    }
}
