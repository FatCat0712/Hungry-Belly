package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.export.CsvExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExcelExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExportService;
import com.eddie.hungry_belly_backend.common.util.export.ExportStrategy;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Role;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.InvalidOperationException;
import com.eddie.hungry_belly_backend.exception.UserNotFoundException;
import com.eddie.hungry_belly_backend.role.service.RoleService;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.dto.response.UserCsvDto;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.dto.response.UserStatsResponse;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final RoleService roleService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExportService exportService;
    private final StorageService storageService;

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(UserCreateRequest request) {
        boolean isEmailUnique = userRepository.existsByEmail(request.getEmail());
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
            throw new UserNotFoundException("User could not be found");
        }
        return dbUser.get();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse findById(Long id) {
        return convertToAdminResponse(findUserById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUserInfo(Long userId, UserUpdateRequest request) {

        User existUser = findByEmail(request.getEmail());

        if (existUser != null && !existUser.getId().equals(userId)) {
            throw new BadRequestException("email: Email already exists");
        }

        User userEntity = convertToUserEntity(request);

        User dbUser = findUserById(userId);

        if (
                userEntity.getPassword() == null
                        || userEntity.getPassword().isEmpty()
                        || userEntity.getPassword().isBlank()
        ) {
            dbUser.setPassword(dbUser.getPassword());
        } else {
            String encodedPassword = encodePassword(userEntity.getPassword());
            dbUser.setPassword(encodedPassword);
        }

        dbUser.setEmail(userEntity.getEmail());
        dbUser.setFirstName(userEntity.getFirstName());
        dbUser.setLastName(userEntity.getLastName());
        dbUser.setRoles(userEntity.getRoles());
        dbUser.setEnabled(userEntity.isEnabled());

        if (request.getPhoto() != null && !request.getPhoto().isEmpty()) {
            dbUser.setPhoto(userEntity.getPhoto());
        }


        dbUser = userRepository.save(dbUser);
        return convertToAdminResponse(dbUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void resetPassword(Long id, ResetPasswordRequest request) {
        User dbUser = findUserById(id);
        dbUser.setPassword(encodePassword(request.getNewPassword()));
        userRepository.save(dbUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(Long id) {
        User currentUser = findUserById(id);
        Role roleAdmin = roleService.getExistRoleWithSameName("ROLE_ADMIN");

        if (currentUser.getRoles().contains(roleAdmin)) {
            long activeAdminCount = userRepository.countActiveAdmins();
            if (activeAdminCount <= 1) {
                throw new InvalidOperationException("At least one active admin is required");
            }
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = auth.getName();
        User loggedInUser = userRepository.findByEmail(currentEmail);

        if (loggedInUser != null && loggedInUser.getId().equals(id)) {
            throw new InvalidOperationException("You cannot delete your own account");
        }

        userRepository.deleteUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void updateUserStatus(Long id) {
        User dbUser = findUserById(id);
        userRepository.updateUserStatus(dbUser.getId(), !dbUser.isEnabled());
    }


    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserResponse> listByPage(PageRequestDto request) {
//        Step 1: Build pageable from request
        Pageable pageable = PaginationUtils.buildPageable(request);

        // Step 2: Get paginated IDs (efficient DB pagination, no collection fetch)
        Page<Long> idPage;
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = request.getKeyword();
            idPage = userRepository.findAllUserIdsWithKeyword(keyword, pageable);
        } else {
            idPage = userRepository.findAllUserIds(pageable);
        }

        List<Long> idList = idPage.getContent();

        //  If no IDs, return empty page
        if (idList.isEmpty()) {
            Page<UserResponse> emptyPage = new PageImpl<>(List.of(), pageable, idPage.getTotalElements());
            return PageMapper.toPageResponse(emptyPage);
        }

        // Step 3: Bulk load users with roles by IDs (single efficient query)
        List<User> users = userRepository.findUserWithRolesByIds(idList);

//       Step 4: Convert fetched users into a map for fast lookup
        Map<Long, User> userMap = users.stream().collect(Collectors.toMap(User::getId, u -> u));

//        Step 5: Rebuild the user list using idList to preserve pageable sort order from first query
//        Note: the bulk fetch query may return users in any order, so we must reorder them according to the original ID list
        List<User> orderedUsers = idList.stream()
                .map(userMap::get)
                .filter(Objects::nonNull) // In case of any missing IDs, though unlikely
                .toList();

//        Step 6: Convert to response DTOs and build PageResponse
        PageImpl<UserResponse> responsePage = new PageImpl<>(
                orderedUsers.stream().map(this::convertToAdminResponse).toList(),
                pageable,
                idPage.getTotalElements()
        );

        return PageMapper.toPageResponse(responsePage);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserStatsResponse getUserStats() {
        Long usersCount = userRepository.countAllUsers();
        Long userActiveCount = userRepository.countActiveUser();
        return UserStatsResponse.builder()
                .totalUsers(usersCount)
                .activeUsers(userActiveCount)
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ExportResult exportUser(String format) {
        List<UserCsvDto> userCsvDtos = findAllUsers().stream().map(this::convertToCsvDto).toList();

        String[] headers = {"User ID", "Email", "First Name", "Last Name", "Roles", "Status"};

        try {
            if ("csv".equals(format)) {
                ExportStrategy<UserCsvDto> strategy = new CsvExporter<>(headers, new String[]{"id", "email", "firstName", "lastName", "roles", "status"});
                return exportService.export("users", userCsvDtos, strategy);
            } else if ("excel".equals(format)) {
                ExportStrategy<UserCsvDto> strategy = new ExcelExporter<>(headers, u -> new Object[]{u.getId(), u.getEmail(), u.getFirstName(), u.getLastName(), u.getRoles(), u.getStatus()});
                return exportService.export("users", userCsvDtos, strategy);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        throw new IllegalArgumentException("Unsupported format");
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }


    private User convertToUserEntity(UserCreateRequest request) {
        Set<Role> savedRoles = convertToRoleEntitySet(request.getRoles());

        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(encodePassword(request.getPassword()))
                .enabled(request.getEnabled())
                .photo(request.getPhoto())
                .roles(savedRoles)
                .build();
    }

    private User convertToUserEntity(UserUpdateRequest request) {
        Set<Role> savedRoles = convertToRoleEntitySet(request.getRoles());

        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(request.getEnabled())
                .roles(savedRoles)
                .password(request.getPassword())
                .photo(request.getPhoto())
                .build();
    }

    public String generateUserPhotoPath(User user) {
        String photo = user.getPhoto();
        if (photo == null) return null;
        return storageService.generateDownloadUrl(photo, 3600);
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

    public UserResponse convertToAdminResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(Role::toString).collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.isEnabled())
                .photoUrl(generateUserPhotoPath(user))
                .photoPath(user.getPhoto())
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
