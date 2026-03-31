package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {
    List<AdminUserResponse> fetchAllUsers();
    AdminUserResponse createUser(AdminUserCreateRequest request);
    AdminUserResponse updateUserInfo(Long id, AdminUserRequest request);
    void resetPassword(Long id, @Valid ResetPasswordRequest request);
    void delete(Long id);
    void updateUserStatus(Long id);
    AdminUserResponse findById(Long id);
}
