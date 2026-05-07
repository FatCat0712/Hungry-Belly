package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
@Tag(name = "User Management", description = "Endpoints for managing users (Admin only)")
public class UserController {
    private final UserService userService;

    @Operation(summary = "List users with pagination", description = "Fetches a paginated list of users. Admin only.")
    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> listUsers(@RequestBody PageRequestDto request) {
        var listUsers = userService.listByPage(request);
        ApiResponse<?> body = ApiResponse.success(listUsers, "All users fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get user statistics", description = "Fetches statistics about users, such as total count and active users. Admin only.")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> countActiveUsers() {
        ApiResponse<?> body = ApiResponse.success(userService.getUserStats(), "OK");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create a new user", description = "Creates a new user with the provided information. Admin only.")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody UserCreateRequest request) {
        var response = userService.createUser(request);
        ApiResponse<?> body = ApiResponse.create(response, "User created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get user by ID", description = "Fetches details of a specific user by ID. Admin only.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> findUserById(@PathVariable Long id) {
        var response = userService.findById(id);
        ApiResponse<?> body = ApiResponse.success(response, "User fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update user", description = "Updates profile information of a specific user. Admin only.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUserInfo(id, request);
        ApiResponse<?> body = ApiResponse.success(response, "User updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Reset user password", description = "Resets password for a specific user. Admin only.")
    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse<?>> resetUserPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Delete user", description = "Deletes a specific user account. Admin only.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update user status", description = "Toggles active/inactive status for a specific user. Admin only.")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateUserStatus(@PathVariable Long id) {
        userService.updateUserStatus(id);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Export users", description = "Exports user data in the requested format (for example csv or xlsx). Admin only.")
    @PostMapping("/export/{format}")
    public ResponseEntity<ApiResponse<?>> exportUsersCsv(@PathVariable String format) {
        ExportResult exportResult = userService.exportUser(format);
        ApiResponse<?> body = ApiResponse.success(exportResult, "Data exported");
        return ResponseEntity.status(body.getStatus()).body(body);
    }











}
