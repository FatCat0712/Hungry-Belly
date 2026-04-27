package com.eddie.hungry_belly_backend.permission.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.permission.dto.response.PermissionResponse;
import com.eddie.hungry_belly_backend.permission.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> fetchAllPermissions() {
        List<PermissionResponse> response = permissionService.fetchAllPermissions();
        ApiResponse<?> body = ApiResponse.success(response, "All permissions fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }



}
