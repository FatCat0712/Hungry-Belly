package com.eddie.hungry_belly_backend.restaurant.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantCreateRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping("/page")
    public ResponseEntity<ApiResponse<?>> getAllRestaurants(@RequestBody PageRequestDto request) {
        PageResponse<RestaurantSummaryResponse> restaurants = restaurantService.getRestaurants(request);
        return ResponseEntity.ok(ApiResponse.success(restaurants, "Get all restaurants"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateRestaurantStatus(@PathVariable Long id) {
        restaurantService.updateRestaurantStatus(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Restaurant status updated"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRestaurantById(@PathVariable Long id) {
        RestaurantDetailResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(restaurant, "Get restaurant by id"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantRequest request) {
        RestaurantDetailResponse response = restaurantService.updateRestaurant(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Restaurant updated"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRestaurant(@RequestBody RestaurantCreateRequest request) {
        RestaurantDetailResponse response = restaurantService.createRestaurant(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Create restaurant"));
    }
}
