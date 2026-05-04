package com.eddie.hungry_belly_backend.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "auth.token")
public class AuthTokenProperties {
    private Long accessExpirationInMils;
    private Long refreshExpirationInMils;
    private String jwtSecret;
}
