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
        ApiResponse<?> body = ApiResponse.success(roles, "Roles fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> fetchRolesWithPermissions() {
        List<RoleResponse> roles = roleService.fetchRolesWithPermissions();
        ApiResponse<?> body = ApiResponse.success(roles, "Roles with permissions fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> fetchRoleWithId(@PathVariable Long id) {
        UpdateRoleResponse role = roleService.fetchRoleById(id);
        ApiResponse<?> body = ApiResponse.success(role, "Role fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateRole(@RequestBody @Valid RoleUpdateRequest request) {
        roleService.updateRole(request);
        ApiResponse<?> body = ApiResponse.done(null, "Role updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRole(@RequestBody @Valid RoleCreateRequest request) {
        roleService.createRole(request);
        ApiResponse<?> body = ApiResponse.create(null, "Role created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        ApiResponse<?> body = ApiResponse.done(null, "Role deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }



}
