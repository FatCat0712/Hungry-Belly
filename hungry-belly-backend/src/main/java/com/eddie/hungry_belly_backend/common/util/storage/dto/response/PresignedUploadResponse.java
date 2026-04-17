package com.eddie.hungry_belly_backend.common.util.storage.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class PresignedUploadResponse {
    private String uploadUrl;
    private String publicUrl;
    private String path;
}
