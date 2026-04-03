package com.eddie.hungry_belly_backend.permission.service;

import com.eddie.hungry_belly_backend.entity.Permission;
import com.eddie.hungry_belly_backend.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    public Set<Permission> fetchPermissionsInIds(List<Long> ids){
        return permissionRepository.findByIdIn(ids);
    }

    public List<Permission> fetchAllPermissions() {
        return permissionRepository.findAll();
    }
}
