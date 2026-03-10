package com.eddie.hungry_belly_backend.controller;

import com.eddie.hungry_belly_backend.io.FoodRequest;
import com.eddie.hungry_belly_backend.io.FoodResponse;
import com.eddie.hungry_belly_backend.service.FoodService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
@CrossOrigin("*")
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

    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readFoods();
    }

    @GetMapping("/{id}")
    public FoodResponse readFood(@PathVariable Long id) {
        return foodService.readFoodResponse(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
    }






}
