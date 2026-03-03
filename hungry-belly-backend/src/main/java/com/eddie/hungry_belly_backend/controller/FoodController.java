package com.eddie.hungry_belly_backend.controller;

import com.eddie.hungry_belly_backend.io.FoodRequest;
import com.eddie.hungry_belly_backend.io.FoodResponse;
import com.eddie.hungry_belly_backend.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.thirdparty.jackson.core.JsonProcessingException;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
public class FoodController {
    private final FoodService foodService;


    @PostMapping
    public FoodResponse addFood(
            @RequestPart("food") String foodString,
            @RequestPart("file") MultipartFile file
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        FoodRequest request;

        request = objectMapper.readValue(foodString, FoodRequest.class);

        return foodService.addFood(request, file);
    }
}
