package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExportResult {
    private String fileName;
    private String downloadUrl;
    private LocalDateTime created;
}
