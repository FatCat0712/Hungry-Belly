package com.eddie.hungry_belly_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SupabaseConfig {
    @Value("${supabase.endpointSignUrl}")
    private String endpointUrl;

    @Value("${supabase.serviceRoleKey}")
    private String serviceKey;

    @Bean
    public WebClient supabaseWebClient() {
        return WebClient.builder()
                .baseUrl(endpointUrl)
                .defaultHeader("apiKey", serviceKey)
                .defaultHeader("Authorization", "Bearer " + serviceKey)
                .build();
    }
}
