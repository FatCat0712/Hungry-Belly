package com.eddie.hungry_belly_backend.role.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.role.dto.request.RoleCreateRequest;
import com.eddie.hungry_belly_backend.role.dto.request.RoleUpdateRequest;
import com.eddie.hungry_belly_backend.role.dto.response.RoleResponse;
import com.eddie.hungry_belly_backend.role.dto.response.UpdateRoleResponse;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "Endpoints for managing roles and role permissions")
public class RoleController {
    private final RoleService roleService;

    @Operation(summary = "List role names", description = "Returns all role names.")
    @GetMapping("/names")
    public ResponseEntity<ApiResponse<?>> fetchAllRoles() {
        Set<String> roles = roleService.fetchAllRoleNames();
        ApiResponse<?> body = ApiResponse.success(roles, "Roles fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "List roles with permissions", description = "Returns all roles and their assigned permissions.")
    @GetMapping
    public ResponseEntity<ApiResponse<?>> fetchRolesWithPermissions() {
        List<RoleResponse> roles = roleService.fetchRolesWithPermissions();
        ApiResponse<?> body = ApiResponse.success(roles, "Roles with permissions fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get role by ID", description = "Returns a single role and permission details by ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> fetchRoleWithId(@PathVariable Long id) {
        UpdateRoleResponse role = roleService.fetchRoleById(id);
        ApiResponse<?> body = ApiResponse.success(role, "Role fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update role", description = "Updates role details and permission assignments.")
    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateRole(@RequestBody @Valid RoleUpdateRequest request) {
        roleService.updateRole(request);
        ApiResponse<?> body = ApiResponse.done(null, "Role updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create role", description = "Creates a new role with permission assignments.")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRole(@RequestBody @Valid RoleCreateRequest request) {
        roleService.createRole(request);
        ApiResponse<?> body = ApiResponse.create(null, "Role created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Delete role", description = "Deletes a role by ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        ApiResponse<?> body = ApiResponse.done(null, "Role deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }



}
