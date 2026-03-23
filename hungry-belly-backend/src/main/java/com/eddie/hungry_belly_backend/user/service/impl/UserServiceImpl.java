package com.eddie.hungry_belly_backend.user.service.impl;

import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.UserNotFoundException;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final RoleService roleService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<AdminUserResponse> fetchAllUsers() {
        return userRepository.findAllWithRoles().stream().map(this::convertToAdminResponse).toList();
    }

    public void createUser(AdminUserCreateRequest request) {
        boolean isEmailUnique = userRepository.existsByEmail(request.getEmail());
        if(!isEmailUnique) {
            User user = convertToUserEntity(request);
            userRepository.save(user);
        }
    }

    public User findUserById(Long id) {
        Optional<User> dbUser = userRepository.findById(id);
        if (dbUser.isEmpty()) {
            throw new UserNotFoundException("User with id " + id + " could not found");
        }
        return dbUser.get();
    }

    @Override
    public void updateUserInfo(Long userId, AdminUserRequest request) {

        User existUser = userRepository.findByEmail(request.getEmail());

        if(existUser != null && !existUser.getId().equals(userId)) {
            throw new BadRequestException("email: Email already exists");
        }

        User userEntity = convertToUserEntity(request);

        User dbUser = findUserById(userId);

        if(userEntity.getPassword() == null) {
            dbUser.setPassword(dbUser.getPassword());
        }

       dbUser.setId(dbUser.getId());
        dbUser.setEmail(userEntity.getEmail());
        dbUser.setFirstName(userEntity.getFirstName());
        dbUser.setLastName(userEntity.getLastName());
        dbUser.setRoles(userEntity.getRoles());
        dbUser.setEnabled(userEntity.isEnabled());
        dbUser.setPhoto(userEntity.getPhoto());

        userRepository.save(dbUser);
    }

    @Override
    public void resetPassword(Long id, ResetPasswordRequest request) {
        User dbUser = findUserById(id);
        dbUser.setPassword(encodePassword(request.getNewPassword()));
        userRepository.save(dbUser);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User dbUser = findUserById(id);
        userRepository.deleteUserById(dbUser.getId());
    }

    private User convertToUserEntity(AdminUserCreateRequest request) {
        Set<Role> savedRoles = convertToRoleEntitySet(request.getRoles());

        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(encodePassword(request.getPassword()))
                .enabled(request.getEnabled())
                .roles(savedRoles)
                .build();
    }


    private User convertToUserEntity(AdminUserRequest request) {
        Set<Role> savedRoles = convertToRoleEntitySet(request.getRoles());

        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(request.getEnabled())
                .roles(savedRoles)
                .build();
    }



    private Set<Role> convertToRoleEntitySet(Set<String> roles) {
        Set<Role> savedRoles = roleService.getRolesByNames(roles);

        if (roles.size() != savedRoles.size()) {
            throw new BadRequestException("Some roles are invalid");
        }

        return savedRoles;
    }

    private String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private AdminUserResponse convertToAdminResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::toString).collect(Collectors.toSet());

        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.isEnabled())
                .photo(user.getPhoto())
                .roles(roles)
                .build();
    }
}
