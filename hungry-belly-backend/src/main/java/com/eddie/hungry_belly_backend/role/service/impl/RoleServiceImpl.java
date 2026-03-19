package com.eddie.hungry_belly_backend.role.service.impl;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.role.repository.RoleRepository;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public Set<Role> getRolesByNames(Set<String> names) {
        return roleRepository.findByNameIn(names);
    }
}
