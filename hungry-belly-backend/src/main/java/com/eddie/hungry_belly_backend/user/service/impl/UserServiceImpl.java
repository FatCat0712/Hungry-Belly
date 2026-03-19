package com.eddie.hungry_belly_backend.user.service.impl;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
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
    private final UserRepository userRepository;

    @Override
    public List<AdminUserResponse> listAllUsers() {
        return userRepository.findAll().stream().map(this::convertToAdminResponse).toList();
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
