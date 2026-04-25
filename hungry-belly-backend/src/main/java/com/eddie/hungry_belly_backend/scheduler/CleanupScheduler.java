package com.eddie.hungry_belly_backend.scheduler;

import com.eddie.hungry_belly_backend.scheduler.service.ExportCleanupService;
import com.eddie.hungry_belly_backend.scheduler.service.ImageCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CleanupScheduler {
    private final ImageCleanupService imageCleanupService;
    private final ExportCleanupService exportCleanupService;

    @Scheduled(cron = "0 0 */2 * * *")
    public void runImageCleanup() {
        imageCleanupService.cleanup();
    }

    @Scheduled(cron = "0 0 */2 * * *")
    public void runExportCleanup() {
        exportCleanupService.cleanup();
    }
}
