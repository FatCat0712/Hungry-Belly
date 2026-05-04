package com.eddie.hungry_belly_backend.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {
    private String bucketName;
    private String accessKey;
    private String secretKey;
    private String regionName;
    private String endpointUrl;
    private String serviceRoleKey;
    private String endpointSignUrl;
}
