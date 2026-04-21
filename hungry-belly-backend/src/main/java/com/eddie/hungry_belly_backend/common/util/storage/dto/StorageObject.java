package com.eddie.hungry_belly_backend.common.util.storage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class StorageObject {
    private String name;
    private Instant updatedAt;
}
