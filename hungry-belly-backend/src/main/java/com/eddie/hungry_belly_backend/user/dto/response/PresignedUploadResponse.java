package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PresignedUploadResponse {
    private String uploadUrl;
    private String key;
}
