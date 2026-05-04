package com.eddie.hungry_belly_backend.scheduler;

import com.eddie.hungry_belly_backend.scheduler.service.AbstractCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CleanupScheduler {
    private final List<AbstractCleanupService> cleanupServices;

    @Scheduled(cron = "0 0 */2 * * *")
    public void runImageCleanup() {
        for(AbstractCleanupService service: cleanupServices) {
            service.cleanup();
        }
    }
}
