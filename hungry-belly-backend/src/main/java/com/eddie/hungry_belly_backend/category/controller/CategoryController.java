package com.eddie.hungry_belly_backend.category.controller;

import com.eddie.hungry_belly_backend.category.dto.request.CategoryCreateRequest;
import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/roots")
    public ApiResponse<?> listAllCategories(@RequestBody PageRequestDto request) {
        return ApiResponse.success(categoryService.listCategoriesByPage(request), "Get all categories");
    }


    @GetMapping("/{id}")
    public ApiResponse<?> findCategoryById(@PathVariable Long id) {
        return ApiResponse.success(categoryService.fetchCategoryById(id), "Category has been fetched" );
    }

    @GetMapping("/in-form")
    public ApiResponse<?> displayCategoryInHierarchy() {
        return ApiResponse.success(categoryService.displayCategoryInHierarchy(), "Category tree has been fetched");
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.success(categoryService.updateCategory(id, request), "Category was updated");
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<?> updateCategoryStatus(@PathVariable Long id) {
        categoryService.updateCategoryStatus(id);
        return ApiResponse.done(null, "Category status was updated");
    }

    @PostMapping
    public ApiResponse<?> createCategory(@RequestBody @Valid CategoryCreateRequest request) {
        return ApiResponse.create(categoryService.createCategory(request), "Category was created");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.done(null, "Category was deleted");
    }

    @PostMapping("/export/{format}")
    public ApiResponse<?> exportCategories(@PathVariable String format) {
    ExportResult exportResult = categoryService.exportCategories(format);
    return ApiResponse.done(exportResult, "All categories exported");
    }

}
