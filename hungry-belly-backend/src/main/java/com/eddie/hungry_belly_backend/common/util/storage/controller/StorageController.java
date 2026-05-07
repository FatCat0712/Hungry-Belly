package com.eddie.hungry_belly_backend.common.util.storage.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.UploadRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/storage")
@Tag(name = "Storage", description = "Endpoints for file upload URL generation and temporary upload sessions")
public class StorageController {
    private final StorageService storageService;

    @Operation(summary = "Generate upload URL", description = "Generates a presigned upload URL for client-side file upload.")
    @PostMapping("/presigned-urls")
    public ResponseEntity<ApiResponse<?>> getUploadUrl(@RequestBody UploadRequest request) {
        var response = storageService.generateUploadUrl(request);
        ApiResponse<?> body = ApiResponse.success(response, "Generated upload URL");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create temp upload session", description = "Creates a temporary upload session identifier.")
    @PostMapping("/temp-session")
    public ResponseEntity<ApiResponse<?>> createTempSession() {
        Random random = new Random();
        String tempId = random.nextInt(1, 1001) + "";
        ApiResponse<?> body = ApiResponse.success(tempId, "Upload session created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }


}
