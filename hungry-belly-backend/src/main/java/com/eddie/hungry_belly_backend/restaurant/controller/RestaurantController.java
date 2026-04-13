package com.eddie.hungry_belly_backend.restaurant.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.restaurant.dto.RestaurantResponse;
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
        PageResponse<RestaurantResponse> restaurants = restaurantService.getRestaurants(request);
        return ResponseEntity.ok(ApiResponse.success(restaurants, "Get all restaurants"));
    }

}
