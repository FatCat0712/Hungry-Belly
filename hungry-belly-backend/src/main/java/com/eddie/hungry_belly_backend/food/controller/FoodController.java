package com.eddie.hungry_belly_backend.food.controller;

import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
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


}
