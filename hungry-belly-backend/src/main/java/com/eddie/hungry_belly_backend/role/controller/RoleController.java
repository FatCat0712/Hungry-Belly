package com.eddie.hungry_belly_backend.role.controller;

import com.eddie.hungry_belly_backend.response.ApiResponse;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> fetchAllRoles() {
        Set<String> roles = roleService.fetchAllRoleNames();
        return ResponseEntity.ok(ApiResponse.success(roles, "Roles fetched successfully"));
    }

}
