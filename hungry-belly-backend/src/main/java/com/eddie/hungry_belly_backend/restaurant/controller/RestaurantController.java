package com.eddie.hungry_belly_backend.restaurant.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantCreateRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/restaurants")
@Tag(name = "Restaurant Management", description = "Endpoints for managing restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @Operation(summary = "List restaurants by page", description = "Returns restaurants using pagination and filters from request body.")
    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> getAllRestaurants(@RequestBody PageRequestDto request) {
        PageResponse<RestaurantSummaryResponse> restaurants = restaurantService.getRestaurants(request);
        ApiResponse<?> body = ApiResponse.success(restaurants, "Get all restaurants");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update restaurant status", description = "Toggles active status for a restaurant by ID.")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateRestaurantStatus(@PathVariable Long id) {
        restaurantService.updateRestaurantStatus(id);
        ApiResponse<?> body = ApiResponse.success(null, "Restaurant status updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get restaurant by ID", description = "Returns detailed information for a specific restaurant.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRestaurantById(@PathVariable Long id) {
        RestaurantDetailResponse restaurant = restaurantService.getRestaurantById(id);
        ApiResponse<?> body = ApiResponse.success(restaurant, "Get restaurant by id");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update restaurant", description = "Updates restaurant details by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantRequest request) {
        RestaurantDetailResponse response = restaurantService.updateRestaurant(id, request);
        ApiResponse<?> body = ApiResponse.success(response, "Restaurant updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create restaurant", description = "Creates a new restaurant.")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRestaurant(@RequestBody RestaurantCreateRequest request) {
        RestaurantDetailResponse response = restaurantService.createRestaurant(request);
        ApiResponse<?> body = ApiResponse.success(response, "Create restaurant");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Delete restaurant", description = "Deletes a restaurant by ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        ApiResponse<?> body = ApiResponse.done(null, "Restaurant deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }
}
