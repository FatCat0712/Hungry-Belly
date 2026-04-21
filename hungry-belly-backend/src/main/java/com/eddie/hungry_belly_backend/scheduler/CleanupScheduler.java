package com.eddie.hungry_belly_backend.scheduler;

import com.eddie.hungry_belly_backend.restaurant.service.ImageCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CleanupScheduler {
    private final ImageCleanupService cleanupService;

    @Scheduled(cron = "0 0 */2 * * *")
    public void runCleanup() {
        cleanupService.cleanup();
    }
}
