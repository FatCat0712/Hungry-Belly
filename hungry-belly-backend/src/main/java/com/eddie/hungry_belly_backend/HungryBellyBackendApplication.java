package com.eddie.hungry_belly_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
@EnableCaching
@EnableAsync
public class HungryBellyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HungryBellyBackendApplication.class, args);
	}


}
