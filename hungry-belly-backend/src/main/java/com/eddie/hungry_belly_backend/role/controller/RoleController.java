package com.eddie.hungry_belly_backend.role.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.role.dto.request.RoleCreateRequest;
import com.eddie.hungry_belly_backend.role.dto.request.RoleUpdateRequest;
import com.eddie.hungry_belly_backend.role.dto.response.RoleResponse;
import com.eddie.hungry_belly_backend.role.dto.response.UpdateRoleResponse;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping("/names")
    public ResponseEntity<ApiResponse<?>> fetchAllRoles() {
        Set<String> roles = roleService.fetchAllRoleNames();
        return ResponseEntity.ok(ApiResponse.success(roles, "Roles fetched"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> fetchRolesWithPermissions() {
        List<RoleResponse> roles = roleService.fetchRolesWithPermissions();
        return ResponseEntity.ok(ApiResponse.success(roles, "Roles with permissions fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> fetchRoleWithId(@PathVariable Long id) {
        UpdateRoleResponse role = roleService.fetchRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(role, "Role fetched"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateRole(@RequestBody @Valid RoleUpdateRequest request) {
        roleService.updateRole(request);
        return ResponseEntity.ok(ApiResponse.done(null, "Role updated"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRole(@RequestBody @Valid RoleCreateRequest request) {
        roleService.createRole(request);
        return ResponseEntity.ok(ApiResponse.create(null, "Role created"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.done(null, "Role deleted"));
    }



}
