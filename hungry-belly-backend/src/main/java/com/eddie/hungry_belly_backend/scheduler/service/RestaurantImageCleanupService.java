package com.eddie.hungry_belly_backend.scheduler.service;

import com.eddie.hungry_belly_backend.common.util.storage.dto.StorageObject;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantImageCleanupService extends AbstractCleanupService {
    private final RestaurantImageRepository imageRepository;
    private final StorageService storageService;

    private static final String PREFIX = "restaurant-photos/";

    @Override
    public void cleanupOrphanFiles() {
        List<StorageObject> files = storageService.listFiles(PREFIX);
        Set<String> dbPaths = new HashSet<>(imageRepository.findAllPaths());

        Instant threshold = Instant.now().minus(Duration.ofHours(24));

        for(StorageObject file: files) {
            String filePath = file.getName();
            if(!dbPaths.contains(filePath) && file.getUpdatedAt().isBefore(threshold)) {
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
