package com.eddie.hungry_belly_backend.common.util.storage.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileRequest {
    private String fileName;
    private String contentType;
}
