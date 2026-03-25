package com.eddie.hungry_belly_backend.user.service.impl;

import com.eddie.hungry_belly_backend.SupabaseS3Util;
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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final RoleService roleService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SupabaseS3Util supabaseS3Util;

    @Override
    public List<AdminUserResponse> fetchAllUsers() {
        return userRepository.findAllWithRoles().stream().map(this::convertToAdminResponse).toList();
    }

    public AdminUserResponse createUser(AdminUserCreateRequest request) {
        boolean isEmailUnique = userRepository.existsByEmailAndDeletedFalse(request.getEmail());
        if(isEmailUnique) {
            throw new BadRequestException("email: Email already exists");
        }
        User user = convertToUserEntity(request);
        user = userRepository.save(user);
        return convertToAdminResponse(user);
    }

    public User findUserById(Long id) {
        Optional<User> dbUser = userRepository.findById(id);
        if (dbUser.isEmpty()) {
            throw new UserNotFoundException("User with id " + id + " could not found");
        }
        return dbUser.get();
    }

    @Override
    public AdminUserResponse updateUserInfo(Long userId, AdminUserRequest request) {

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

        if(userEntity.getPhoto() != null) {
            dbUser.setPhoto(userEntity.getPhoto());
        }

        dbUser = userRepository.save(dbUser);
        return convertToAdminResponse(dbUser);
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

    @Override
    @Transactional
    public void updateUserStatus(Long id) {
        User dbUser = findUserById(id);
        userRepository.updateUserStatus(dbUser.getId(), !dbUser.isEnabled());
    }

    @Override
    public AdminUserResponse uploadPhoto(Long id, MultipartFile photo) {
        User dbUser = findUserById(id);

        if(!photo.isEmpty()) {
            String contentType = photo.getContentType();
            if(contentType != null && !contentType.startsWith("image/")) {
                throw new BadRequestException("photo: only images allowed");
            }
            else {
                String filename = StringUtils.cleanPath(Objects.requireNonNull(photo.getOriginalFilename()));
                dbUser.setPhoto(filename);
                dbUser = userRepository.save(dbUser);
                String uploadDir = "user-photos/" + dbUser.getId();
                supabaseS3Util.removeFolder(uploadDir);
                try {
                    supabaseS3Util.uploadFile(uploadDir, filename, photo.getInputStream());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        return convertToAdminResponse(dbUser);
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

    private String generateUserPhotoPath(User user) {
        String photo = user.getPhoto();
        if(photo == null) return "";
        return supabaseS3Util.createSignedUrl("user-photos/" + user.getId() + "/" + photo , 3600);
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
                .photo(generateUserPhotoPath(user))
                .roles(roles)
                .build();
    }
}
