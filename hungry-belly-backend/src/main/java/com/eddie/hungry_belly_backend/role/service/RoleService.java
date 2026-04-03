package com.eddie.hungry_belly_backend.role.service;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.role.dto.request.RoleUpdateRequest;
import com.eddie.hungry_belly_backend.role.dto.response.RoleResponse;
import com.eddie.hungry_belly_backend.role.dto.response.UpdateRoleResponse;

import java.util.List;
import java.util.Set;

public interface RoleService {
    Set<Role> getRolesByNames(Set<String> names);
    Set<String> fetchAllRoleNames();
    List<RoleResponse> fetchRolesWithPermissions();
    UpdateRoleResponse fetchRoleById(Long id);
    void updateRole(RoleUpdateRequest request);
}
