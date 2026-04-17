package com.eddie.hungry_belly_backend.common.util.export;

import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ExportService {
    private final StorageService storageService;

    public <T>ExportResult export(List<T> data, ExportStrategy<T> strategy) throws Exception {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        String timestamp = dateTimeFormatter.format(LocalDateTime.now());
        String fileName = "users_" + timestamp;
        String path = "exports/" + fileName + strategy.getFileExtension();
        Path tempFile = Files.createTempFile(fileName, strategy.getFileExtension());

        try (OutputStream os = Files.newOutputStream(tempFile)) {
            strategy.export(data, os);
        }

        storageService.removeFolder("exports/" + fileName);
        storageService.uploadFile(path, Files.newInputStream(tempFile), strategy.getContentType());

        String signedUrl = storageService.generateDownloadUrl(path, 3600);

        return ExportResult.builder()
                .fileName(fileName + strategy.getFileExtension())
                .downloadUrl(signedUrl)
                .created(LocalDateTime.now())
                .build();

    }
}
