package com.eddie.hungry_belly_backend.common.util.storage;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.user.dto.request.UploadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/storage")
public class StorageController {
    private final StorageService storageService;
    @PostMapping("/presigned")
    public ResponseEntity<ApiResponse<?>> getUploadUrl(@RequestBody UploadRequest request) {
        var response = storageService.generateUploadUrl(request.getFolderName(), request.getFileName(), request.getContentType());
        return ResponseEntity.ok(ApiResponse.success(response, String.format("%s upload URL generated", request.getFileName())));
    }
}
