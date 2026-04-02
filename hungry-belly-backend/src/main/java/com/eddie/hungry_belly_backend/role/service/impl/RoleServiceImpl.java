package com.eddie.hungry_belly_backend.role.service.impl;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.role.dto.RoleResponse;
import com.eddie.hungry_belly_backend.role.repository.RoleRepository;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.projection.RoleUserCount;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Override
    public Set<Role> getRolesByNames(Set<String> names) {
        return roleRepository.findByNameIn(names);
    }

    @Override
    public Set<String> fetchAllRoleNames() {
        return roleRepository.fetchRolesWithPermissions().stream()
                .map(Role::getName).collect(Collectors.toSet());
    }

    @Override
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


    private RoleResponse convertToRoleResponse(Role role, Long userCount) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .permissions(role.getPermissions())
                .userCount(userCount)
                .build();




    }
}
