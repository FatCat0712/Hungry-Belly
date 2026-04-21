package com.eddie.hungry_belly_backend.user.dto.request;

import com.eddie.hungry_belly_backend.common.util.storage.dto.request.EntityType;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.FileRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadRequest {
    List<FileRequest> files;
    private EntityType entityType;
    private String uploadId;
}
