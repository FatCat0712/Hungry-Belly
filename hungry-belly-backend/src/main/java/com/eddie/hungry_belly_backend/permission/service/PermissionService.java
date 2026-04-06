package com.eddie.hungry_belly_backend.permission.service;

import com.eddie.hungry_belly_backend.entity.Permission;
import com.eddie.hungry_belly_backend.permission.dto.response.PermissionResponse;
import com.eddie.hungry_belly_backend.permission.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    public List<Permission> fetchPermissionsInIds(List<Long> ids){
        return permissionRepository.findByIdIn(ids);
    }

    public List<Permission> fetchAllPermissionsInternal() {
        return permissionRepository.findAll();
    }

    public List<PermissionResponse> fetchAllPermissions() {
        return fetchAllPermissionsInternal().stream()
                .map(this::convertToPermissionResponse).toList();
    }

    private PermissionResponse convertToPermissionResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .resource(permission.getName().split("_")[0])
                .build();
    }


}
