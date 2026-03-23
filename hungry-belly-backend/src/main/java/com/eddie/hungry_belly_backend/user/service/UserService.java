package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;

import java.util.List;

public interface UserService {
    List<AdminUserResponse> fetchAllUsers();
    void createUser(AdminUserCreateRequest request);
    void updateUserInfo(Long id, AdminUserRequest request);
}
