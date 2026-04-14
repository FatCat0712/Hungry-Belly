package com.eddie.hungry_belly_backend.restaurant.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

//    @PutMapping("/{id}")
//    public ResponseEntity<ApiResponse<?>> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantUpdateRequest request) {
//        RestaurantResponse response = restaurantService.updateRestaurant(id, request);
//        return ResponseEntity.ok(ApiResponse.success(response, "Restaurant updated"));
//    }
}
