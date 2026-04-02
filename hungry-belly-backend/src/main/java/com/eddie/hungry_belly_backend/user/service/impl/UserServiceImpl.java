package com.eddie.hungry_belly_backend.user.service.impl;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.export.CsvExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExcelExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExportService;
import com.eddie.hungry_belly_backend.common.util.export.ExportStrategy;
import com.eddie.hungry_belly_backend.common.util.storage.StorageService;
import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.UserNotFoundException;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.dto.response.UserCsvDto;
import com.eddie.hungry_belly_backend.user.dto.response.UserStatsResponse;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
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
    private final ExportService exportService;
    private final StorageService storageService;

    public AdminUserResponse createUser(AdminUserCreateRequest request) {
        boolean isEmailUnique = userRepository.existsByEmailAndDeletedFalse(request.getEmail());
        if (isEmailUnique) {
            throw new BadRequestException("email: Email already exists");
        }
        User user = convertToUserEntity(request);
        user = userRepository.save(user);
        return convertToAdminResponse(user);
    }

    public User findUserById(Long id) {
        Optional<User> dbUser = userRepository.findUserById(id);
        if (dbUser.isEmpty()) {
            throw new UserNotFoundException("User with id " + id + " could not be found");
        }
        return dbUser.get();
    }

    @Override
    public AdminUserResponse findById(Long id) {
        return convertToAdminResponse(findUserById(id));
    }

    @Override
    public AdminUserResponse updateUserInfo(Long userId, AdminUserRequest request) {

        User existUser = userRepository.findByEmail(request.getEmail());

        if (existUser != null && !existUser.getId().equals(userId)) {
            throw new BadRequestException("email: Email already exists");
        }

        User userEntity = convertToUserEntity(request);

        User dbUser = findUserById(userId);

        if (userEntity.getPassword() == null) {
            dbUser.setPassword(dbUser.getPassword());
        }

        dbUser.setEmail(userEntity.getEmail());
        dbUser.setFirstName(userEntity.getFirstName());
        dbUser.setLastName(userEntity.getLastName());
        dbUser.setRoles(userEntity.getRoles());
        dbUser.setEnabled(userEntity.isEnabled());

        if (userEntity.getPhoto() != null) {
            storageService.removeFolder("user-photos/" + dbUser.getId() + "/" + dbUser.getPhoto());
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
    public PageResponse<AdminUserResponse> listByPage(
            Integer pageNum,
            Integer pageSize,
            String sortField,
            String sortDirection,
            String keyword
    ) {
        if (pageNum == null) {
            pageNum = 0;
        }

        if (pageSize == null) {
            pageSize = 10;
        }

        if (pageNum < 0 || pageSize <= 0 || pageSize > 100) {
            throw new IllegalArgumentException("Invalid pagination parameter");
        }

        Sort sort = Sort.by(sortField);
        sort = sortDirection.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, pageSize, sort);

        // Step 1: Get paginated IDs (efficient DB pagination, no collection fetch)
        Page<Long> idPage;
        if (keyword != null) {
            idPage = userRepository.findAllUserIdsWithKeyword(keyword, pageable);
        } else {
            idPage = userRepository.findAllUserIds(pageable);
        }

        // Step 2: Bulk load users with roles by IDs (single efficient query)
        List<User> users = userRepository.findAllWithRolesByIds(idPage.getContent());

        // Step 3: Convert to DTOs
        List<AdminUserResponse> responses = users.stream()
                .map(this::convertToAdminResponse)
                .toList();

        // Step 4: Reconstruct Page object with original pagination metadata
        Page<AdminUserResponse> responsePage = new PageImpl<>(
                responses,
                pageable,
                idPage.getTotalElements()
        );

        return PageMapper.toPageResponse(responsePage);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserStatsResponse getUserStats() {
        Long usersCount = userRepository.countAllUsers();
        Long userActiveCount = userRepository.countActiveUser();
        return UserStatsResponse.builder()
                .totalUsers(usersCount)
                .activeUsers(userActiveCount)
                .build();
    }

    @Override
    public ExportResult exportUser(String format) {
        List<UserCsvDto> userCsvDtos = findAllUsers().stream().map(this::convertToCsvDto).toList();

        String[] headers = {"User ID", "Email", "First Name", "Last Name", "Roles", "Status"};

        try {
            if ("csv".equals(format)) {
                ExportStrategy<UserCsvDto> strategy = new CsvExporter<>(headers, new String[]{"id", "email", "firstName", "lastName", "roles", "status"});
                return exportService.export(userCsvDtos, strategy);
            } else if ("excel".equals(format)) {
                ExportStrategy<UserCsvDto> strategy = new ExcelExporter<>(headers, u -> new Object[]{u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRoles(), u.getStatus()});
                return exportService.export(userCsvDtos, strategy);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        throw new IllegalArgumentException("Unsupported format");
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
                .photo(request.getPhoto())
                .build();
    }

    private String generateUserPhotoPath(User user) {
        String photo = user.getPhoto();
        if (photo == null) return null;
        return storageService.generateDownloadUrl("user-photos/" + user.getId() + "/" + photo, 3600);
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

    private UserCsvDto convertToCsvDto(User user) {
        return UserCsvDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles().toString())
                .status(user.isEnabled() ? "ACTIVE" : "INACTIVE")
                .build();
    }
}
