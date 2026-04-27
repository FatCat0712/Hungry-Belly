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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> listUsers(@RequestBody PageRequestDto request) {
        var listUsers = userService.listByPage(request);
        ApiResponse<?> body = ApiResponse.success(listUsers, "All users fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> countActiveUsers() {
        ApiResponse<?> body = ApiResponse.success(userService.getUserStats(), "OK");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody UserCreateRequest request) {
        var response = userService.createUser(request);
        ApiResponse<?> body = ApiResponse.create(response, "User created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> findUserById(@PathVariable Long id) {
        var response = userService.findById(id);
        ApiResponse<?> body = ApiResponse.success(response, "User fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserResponse response = userService.updateUserInfo(id, request);
        ApiResponse<?> body = ApiResponse.success(response, "User updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse<?>> resetUserPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateUserStatus(@PathVariable Long id) {
        userService.updateUserStatus(id);
        ApiResponse<?> body = ApiResponse.success(null, null);
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping("/export/{format}")
    public ResponseEntity<ApiResponse<?>> exportUsersCsv(@PathVariable String format) {
        ExportResult exportResult = userService.exportUser(format);
        ApiResponse<?> body = ApiResponse.success(exportResult, "Data exported");
        return ResponseEntity.status(body.getStatus()).body(body);
    }











}
