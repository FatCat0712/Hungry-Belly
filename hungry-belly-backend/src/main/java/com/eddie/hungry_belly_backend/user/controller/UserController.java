package com.eddie.hungry_belly_backend.user.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.storage.StorageService;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserCreateRequest;
import com.eddie.hungry_belly_backend.user.dto.request.AdminUserRequest;
import com.eddie.hungry_belly_backend.user.dto.request.ResetPasswordRequest;
import com.eddie.hungry_belly_backend.user.dto.request.UploadRequest;
import com.eddie.hungry_belly_backend.user.dto.response.AdminUserResponse;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import com.eddie.hungry_belly_backend.user.service.impl.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
public class UserController {
    private final UserService userService;
    private final StorageService storageService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> listUsers(
            @RequestParam(name = "pageNum", required = false) Integer pageNum,
            @RequestParam(name = "pageSize", required = false) Integer pageSize,
            @RequestParam(name = "sortField", required = false, defaultValue = "firstName") String sortField,
            @RequestParam(name = "sortDirection", required = false, defaultValue = "asc") String sortDirection,
            @RequestParam(name = "keyword", required = false) String keyword
            ) {
             var listUsers = userService.listByPage(pageNum, pageSize, sortField, sortDirection, keyword);
            return ResponseEntity.ok(ApiResponse.success(listUsers, "All users fetched"));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> countActiveUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserStats(),"OK"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody AdminUserCreateRequest request) {
         var response = userService.createUser(request);
         return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.create(response, "User created"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> findUserById(@PathVariable Long id) {
        var response = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "User fetched"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUserRequest request) {
        AdminUserResponse response = userService.updateUserInfo(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "User updated successfully"));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<ApiResponse<?>> resetUserPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        return ResponseEntity.ok(ApiResponse.success(null, null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, null));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateUserStatus(@PathVariable Long id) {
        userService.updateUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success(null, null));
    }

    @PostMapping("/presigned")
    public ResponseEntity<ApiResponse<?>> getUploadUrl(@RequestBody UploadRequest request) {
        var response = storageService.generateUploadUrl(request.getFolderName(), request.getFileName(), request.getContentType());
        return ResponseEntity.ok(ApiResponse.success(response, "User photo updated"));
    }

    @PostMapping("/export/{format}")
    public ResponseEntity<ApiResponse<?>> exportUsersCsv(@PathVariable String format) {
        ExportResult exportResult = userService.exportUser(format);
        return ResponseEntity.ok(ApiResponse.success(exportResult, "Data exported"));
    }











}
