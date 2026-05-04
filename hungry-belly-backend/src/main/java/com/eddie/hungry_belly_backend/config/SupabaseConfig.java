package com.eddie.hungry_belly_backend.config;

import com.eddie.hungry_belly_backend.config.properties.SupabaseProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
@RequiredArgsConstructor
public class SupabaseConfig {
    private final SupabaseProperties supabaseProperties;

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .endpointOverride(URI.create(supabaseProperties.getEndpointUrl()))
                .region(Region.of(supabaseProperties.getRegionName()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(supabaseProperties.getAccessKey(), supabaseProperties.getSecretKey())
                ))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }

    @Bean
    public S3Client createClient() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(supabaseProperties.getAccessKey(), supabaseProperties.getSecretKey());
        return S3Client.builder()
                .endpointOverride(URI.create(supabaseProperties.getEndpointUrl()))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.of(supabaseProperties.getRegionName()))
                .forcePathStyle(true)
                .build();
    }

}
