package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/page")
    public ApiResponse<?> listUsers(@RequestBody PageRequestDto request) {
             var listUsers = userService.listByPage(request);
            return ApiResponse.success(listUsers, "All users fetched");
    }

    @GetMapping("/stats")
    public ApiResponse<?> countActiveUsers() {
        return ApiResponse.success(userService.getUserStats(),"OK");
    }

    @PostMapping
    public ApiResponse<?> createUser(@Valid @RequestBody UserCreateRequest request) {
         var response = userService.createUser(request);
         return ApiResponse.create(response, "User created");
    }

    @GetMapping("/{id}")
    public ApiResponse<?> findUserById(@PathVariable Long id) {
        var response = userService.findById(id);
        return ApiResponse.success(response, "User fetched");
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUserInfo(id, request);
        return ApiResponse.success(response, "User updated");
    }

    @PutMapping("/{id}/password")
    public ApiResponse<?> resetUserPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        return ApiResponse.success(null, null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ApiResponse.success(null, null);
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<?> updateUserStatus(@PathVariable Long id) {
        userService.updateUserStatus(id);
        return ApiResponse.success(null, null);
    }

    @PostMapping("/export/{format}")
    public ApiResponse<?> exportUsersCsv(@PathVariable String format) {
        ExportResult exportResult = userService.exportUser(format);
        return ApiResponse.success(exportResult, "Data exported");
    }











}
