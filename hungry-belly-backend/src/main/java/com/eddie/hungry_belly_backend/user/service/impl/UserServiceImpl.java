package com.eddie.hungry_belly_backend.user.service.impl;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.dto.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final RoleService roleService;
    private final UserRepository userRepository;

    @Override
    public List<AdminUserResponse> fetchAllUsers() {
        return userRepository.findAll().stream().map(this::convertToAdminResponse).toList();
    }

    public void createUser(AdminUserRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("email: Email already exists");
        }
        User user = convertToUserEntity(request);
        userRepository.save(user);
    }


    private User convertToUserEntity(AdminUserRequest request) {
        Set<String> roles = request.getRoles();

        Set<Role> savedRoles= roleService.getRolesByNames(roles);

        if (roles.size() != savedRoles.size()) {
            throw new BadRequestException("Some roles are invalid");
        }

        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(request.getPassword())
                .enabled(request.getEnabled())
                .roles(savedRoles)
                .build();

    }

    private AdminUserResponse convertToAdminResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::toString).collect(Collectors.toSet());


        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getFirstName() + " " + user.getLastName())
                .enabled(user.isEnabled())
                .photo(user.getPhoto())
                .roles(roles)
                .build();
    }
}
