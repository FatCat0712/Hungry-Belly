package com.eddie.hungry_belly_backend.scheduler.service;

import com.eddie.hungry_belly_backend.common.util.storage.dto.StorageObject;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportCleanupService {
    private final StorageService storageService;

    public void cleanup() {
        log.info("Starting image cleanup....");
        cleanupOrphanFiles();
        log.info("Image clean up finished");
    }

    private static final String PREFIX = "exports/";

    private void cleanupOrphanFiles() {
        List<StorageObject> files = storageService.listFiles(PREFIX);
        Instant threshold = Instant.now().minus(Duration.ofHours(24));

        for(StorageObject file: files) {
            String filePath = file.getName();
            if(file.getUpdatedAt().isBefore(threshold)) {
                try {
                    storageService.deleteFile(file.getName());
                    log.info("Deleted orphan file: {}", filePath);
                }catch (Exception e) {
                    log.error("Failed to delete file: {}", filePath, e);
                }
            }
        }
    }
}
