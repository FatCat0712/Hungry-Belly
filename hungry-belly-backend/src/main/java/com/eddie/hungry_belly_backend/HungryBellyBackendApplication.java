package com.eddie.hungry_belly_backend;

import com.eddie.hungry_belly_backend.config.SupabaseConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class HungryBellyBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(HungryBellyBackendApplication.class, args);
	}

}
