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
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/restaurants")
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping("/page")
    public ApiResponse<?> getAllRestaurants(@RequestBody PageRequestDto request) {
        PageResponse<RestaurantSummaryResponse> restaurants = restaurantService.getRestaurants(request);
        return ApiResponse.success(restaurants, "Get all restaurants");
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<?> updateRestaurantStatus(@PathVariable Long id) {
        restaurantService.updateRestaurantStatus(id);
        return ApiResponse.success(null, "Restaurant status updated");
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getRestaurantById(@PathVariable Long id) {
        RestaurantDetailResponse restaurant = restaurantService.getRestaurantById(id);
        return ApiResponse.success(restaurant, "Get restaurant by id");
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateRestaurant(@PathVariable Long id, @RequestBody RestaurantRequest request) {
        RestaurantDetailResponse response = restaurantService.updateRestaurant(id, request);
        return ApiResponse.success(response, "Restaurant updated");
    }

    @PostMapping
    public ApiResponse<?> createRestaurant(@RequestBody RestaurantCreateRequest request) {
        RestaurantDetailResponse response = restaurantService.createRestaurant(request);
        return ApiResponse.success(response, "Create restaurant");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ApiResponse.done(null, "Restaurant deleted");
    }
}
