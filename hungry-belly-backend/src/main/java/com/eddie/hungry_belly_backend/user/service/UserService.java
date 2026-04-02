package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.dto.response.UserStatsResponse;
import jakarta.validation.Valid;

public interface UserService {
    PageResponse<AdminUserResponse> listByPage(Integer pageNum, Integer pageSize, String sortField, String sortDirection, String keyword);
    AdminUserResponse createUser(AdminUserCreateRequest request);
    AdminUserResponse updateUserInfo(Long id, AdminUserRequest request);
    UserStatsResponse getUserStats();
    ExportResult exportUserCsv();
    ExportResult exportUserExcel();
    void resetPassword(Long id, @Valid ResetPasswordRequest request);
    void delete(Long id);
    void updateUserStatus(Long id);

    AdminUserResponse findById(Long id);
}
