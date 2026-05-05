package com.eddie.hungry_belly_backend.food.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.food.dto.request.FoodCreateRequest;
import com.eddie.hungry_belly_backend.food.dto.request.FoodUpdateRequest;
import com.eddie.hungry_belly_backend.food.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/foods")
@RequiredArgsConstructor
public class FoodController {
    private final FoodService foodService;

    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> getAllFoodItems(@RequestBody PageRequestDto requestDto) {
        ApiResponse<?> body = ApiResponse.success(foodService.listAllFoodItems(requestDto), "All foods fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateFoodStatus(@PathVariable("id") Long foodId) {
        foodService.updateFoodStatus(foodId);
        ApiResponse<?> body = ApiResponse.success(null, "Food status updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getFoodDetails(@PathVariable("id") Long foodId) {
        ApiResponse<?> body = ApiResponse.success(foodService.getFoodDetails(foodId), "Food details fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createFoodItem(@RequestBody FoodCreateRequest request) {
        ApiResponse<?> body = ApiResponse.create(foodService.createFoodItem(request), "Food item created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateFoodItem(@PathVariable("id") Long foodId, @RequestBody FoodUpdateRequest request) {
        ApiResponse<?> body = ApiResponse.success(foodService.updateFoodItem(foodId, request), "Food item updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteFoodItem(@PathVariable("id") Long foodId) {
        foodService.deleteFood(foodId);
        ApiResponse<?> body = ApiResponse.done(null, "Food item deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

}
