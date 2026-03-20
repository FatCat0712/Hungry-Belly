package com.eddie.hungry_belly_backend.role.service;

import com.eddie.hungry_belly_backend.entity.Role;

import java.util.Set;

public interface RoleService {
    Set<Role> getRolesByNames(Set<String> names);
    Set<String> fetchAllRoleNames();
}
