package com.eddie.hungry_belly_backend.scheduler.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class AbstractCleanupService {
    public void cleanup() {
        log.info("Starting image cleanup....");
        cleanupOrphanFiles();
        log.info("Image clean up finished");
    }

    protected abstract void cleanupOrphanFiles();
}
