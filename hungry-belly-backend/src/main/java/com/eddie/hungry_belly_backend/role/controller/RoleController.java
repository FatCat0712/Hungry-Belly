package com.eddie.hungry_belly_backend.role.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.role.dto.request.RoleCreateRequest;
import com.eddie.hungry_belly_backend.role.dto.request.RoleUpdateRequest;
import com.eddie.hungry_belly_backend.role.dto.response.RoleResponse;
import com.eddie.hungry_belly_backend.role.dto.response.UpdateRoleResponse;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping("/names")
    public ApiResponse<?> fetchAllRoles() {
        Set<String> roles = roleService.fetchAllRoleNames();
        return ApiResponse.success(roles, "Roles fetched");
    }

    @GetMapping
    public ApiResponse<?> fetchRolesWithPermissions() {
        List<RoleResponse> roles = roleService.fetchRolesWithPermissions();
        return ApiResponse.success(roles, "Roles with permissions fetched");
    }

    @GetMapping("/{id}")
    public ApiResponse<?> fetchRoleWithId(@PathVariable Long id) {
        UpdateRoleResponse role = roleService.fetchRoleById(id);
        return ApiResponse.success(role, "Role fetched");
    }

    @PutMapping
    public ApiResponse<?> updateRole(@RequestBody @Valid RoleUpdateRequest request) {
        roleService.updateRole(request);
        return ApiResponse.done(null, "Role updated");
    }

    @PostMapping
    public ApiResponse<?> createRole(@RequestBody @Valid RoleCreateRequest request) {
        roleService.createRole(request);
        return ApiResponse.create(null, "Role created");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        return ApiResponse.done(null, "Role deleted");
    }



}
