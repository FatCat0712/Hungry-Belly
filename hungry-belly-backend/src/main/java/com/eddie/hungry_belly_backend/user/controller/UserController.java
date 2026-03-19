package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.response.ApiResponse;
import com.eddie.hungry_belly_backend.user.dto.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> listUsers() {
            List<AdminUserResponse> listUsers = userService.listAllUsers();
            return ResponseEntity.ok(ApiResponse.success(listUsers, "User fetched successfully"));
    }
}
