package com.eddie.hungry_belly_backend.role.service;

import com.eddie.hungry_belly_backend.entity.Permission;
import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.RoleNotFoundException;
import com.eddie.hungry_belly_backend.permission.dto.response.PermissionResponse;
import com.eddie.hungry_belly_backend.permission.service.PermissionService;
import com.eddie.hungry_belly_backend.role.dto.request.RoleCreateRequest;
import com.eddie.hungry_belly_backend.role.dto.request.RoleUpdateRequest;
import com.eddie.hungry_belly_backend.role.dto.response.RoleResponse;
import com.eddie.hungry_belly_backend.role.dto.response.UpdateRoleResponse;
import com.eddie.hungry_belly_backend.role.repository.RoleRepository;
import com.eddie.hungry_belly_backend.user.projection.RoleUserCount;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService{
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PermissionService permissionService;


    public Set<Role> getRolesByNames(Set<String> names) {
        return roleRepository.findByNameIn(names);
    }

    public Set<String> fetchAllRoleNames() {
        return roleRepository.fetchRolesWithPermissions().stream()
                .map(Role::getName).collect(Collectors.toSet());
    }

    public List<RoleResponse> fetchRolesWithPermissions() {
        List<Role> roles = roleRepository.fetchRolesWithPermissions();
        List<RoleUserCount> roleUserCounts = userRepository.countUsersByRole();

        Map<Long, Long> countByRoleId = roleUserCounts.stream()
                .collect(Collectors.toMap(RoleUserCount::getRoleId, RoleUserCount::getUserCount));

        List<RoleResponse> roleResponses = new ArrayList<>();

        for (Role role : roles) {
            roleResponses.add(convertToRoleResponse(role, countByRoleId.getOrDefault(role.getId(), 0L)));
        }

        return roleResponses;
    }


    public UpdateRoleResponse fetchRoleById(Long id) {
        return convertToEditRoleResponse(fetchById(id));
    }


    public void updateRole(RoleUpdateRequest request) {
        Role existRole = getExistRoleWithSameName(request.getName());

        if(existRole != null && !existRole.getId().equals(request.getId())) {
            throw new BadRequestException("name: Role name is already exists");
        }

        Role dbRole = fetchById(request.getId());

        dbRole.setName(request.getName());
        dbRole.setDescription(request.getDescription());

        Set<Permission> dbPermissions = convertToPermission(request.getPermissions());

        dbRole.setPermissions(dbPermissions);

        roleRepository.save(dbRole);
    }



    public void createRole(RoleCreateRequest request) {
       Role existRole = getExistRoleWithSameName(request.getName());

       if(existRole != null) {
           throw new BadRequestException("name: Role name is already exists");
       }

       Set<Permission> dbPermissions = convertToPermission(request.getPermissions());

       Role newRole = new Role();
       newRole.setName(request.getName());
       newRole.setDescription(request.getDescription());
       newRole.setPermissions(dbPermissions);

       roleRepository.save(newRole);
    }


    public void delete(Long id) {
        roleRepository.deleteById(id);
    }

    private Role fetchById(Long id) {
        Optional<Role> dbRole = roleRepository.fetchRoleById(id);
        if(dbRole.isEmpty()) {
            throw new RoleNotFoundException("Role with id " + id + " could not be found");
        }
        return dbRole.get();
    }

    public Role getExistRoleWithSameName(String name) {
        return roleRepository.findByName(name);
    }


    private Set<Permission> convertToPermission(List<Long> permissionsId) {
        List<Permission> list = permissionService.fetchPermissionsInIds(permissionsId);
        return new HashSet<>(list);
    }

    private RoleResponse convertToRoleResponse(Role role, Long userCount) {
        List<PermissionResponse> permissionResponses = role.getPermissions().stream()
                .map(this::convertToPermissionResponse).toList();

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(permissionResponses)
                .userCount(userCount)
                .build();
    }


    private UpdateRoleResponse convertToEditRoleResponse(Role role) {

        List<Long> currentPermissions = role.getPermissions().stream()
                .map(Permission::getId).toList();

        return UpdateRoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .currentPermissions(currentPermissions)
                .build();
    }

    private PermissionResponse convertToPermissionResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .resource(permission.getName().split("_")[0])
                .build();
    }
}
