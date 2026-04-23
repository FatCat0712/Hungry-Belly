package com.eddie.hungry_belly_backend.category.controller;

import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<?> listAllCategories() {
        return ApiResponse.success(categoryService.listAllCategories(), "Get all categories");
    }

    @GetMapping("/{id}")
    public ApiResponse<?> findCategoryById(@PathVariable Long id) {
        return ApiResponse.success(categoryService.fetchCategoryById(id), "Category with id: " + id);
    }

    @GetMapping("/in-form")
    public ApiResponse<?> displayCategoryInHierarchy() {
        return ApiResponse.success(categoryService.displayCategoryInHierarchy(), "Display category in hierarchy");
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.success(categoryService.updateCategory(id, request), "Category with ID " + id + " was updated");
    }

}
