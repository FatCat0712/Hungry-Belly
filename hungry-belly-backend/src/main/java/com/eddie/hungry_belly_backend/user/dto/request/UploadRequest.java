package com.eddie.hungry_belly_backend.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadRequest {
    private String folderName;
    private String fileName;
    private String contentType;
}
