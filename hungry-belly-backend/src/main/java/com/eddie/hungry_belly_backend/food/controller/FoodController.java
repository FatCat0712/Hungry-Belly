package com.eddie.hungry_belly_backend.food.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.food.dto.request.FoodCreateRequest;
import com.eddie.hungry_belly_backend.food.dto.request.FoodUpdateRequest;
import com.eddie.hungry_belly_backend.food.service.FoodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/foods")
@RequiredArgsConstructor
@Tag(name = "Food Management", description = "Endpoints for managing food items")
public class FoodController {
    private final FoodService foodService;

    @Operation(summary = "List foods by page", description = "Returns food items using pagination and filters from request body.")
    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> getAllFoodItems(@RequestBody PageRequestDto requestDto) {
        ApiResponse<?> body = ApiResponse.success(foodService.listAllFoodItems(requestDto), "All foods fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update food status", description = "Toggles active status for a food item by ID.")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateFoodStatus(@PathVariable("id") Long foodId) {
        foodService.updateFoodStatus(foodId);
        ApiResponse<?> body = ApiResponse.success(null, "Food status updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get food details", description = "Returns full details for a specific food item.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getFoodDetails(@PathVariable("id") Long foodId) {
        ApiResponse<?> body = ApiResponse.success(foodService.getFoodDetails(foodId), "Food details fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create food item", description = "Creates a new food item.")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createFoodItem(@RequestBody FoodCreateRequest request) {
        ApiResponse<?> body = ApiResponse.create(foodService.createFoodItem(request), "Food item created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update food item", description = "Updates a food item by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateFoodItem(@PathVariable("id") Long foodId, @RequestBody FoodUpdateRequest request) {
        ApiResponse<?> body = ApiResponse.success(foodService.updateFoodItem(foodId, request), "Food item updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Delete food item", description = "Deletes a food item by ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteFoodItem(@PathVariable("id") Long foodId) {
        foodService.deleteFood(foodId);
        ApiResponse<?> body = ApiResponse.done(null, "Food item deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

}
