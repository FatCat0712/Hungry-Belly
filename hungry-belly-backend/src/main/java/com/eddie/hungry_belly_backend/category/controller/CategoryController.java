package com.eddie.hungry_belly_backend.category.controller;

import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<?> listAllCategories() {
        return ApiResponse.success(categoryService.listAllCategories(), "Get all categories");
    }
}
