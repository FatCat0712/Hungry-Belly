package com.eddie.hungry_belly_backend.category.controller;

import com.eddie.hungry_belly_backend.category.dto.request.CategoryCreateRequest;
import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.ApiResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
@Tag(name = "Category Management", description = "Endpoints for managing food categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Operation(summary = "List categories by page", description = "Returns root categories in a paginated format.")
    @PostMapping("/roots")
    public ResponseEntity<ApiResponse<?>> listAllCategories(@RequestBody PageRequestDto request) {
        ApiResponse<?> body = ApiResponse.success(categoryService.listCategoriesByPage(request), "Get all categories");
        return ResponseEntity.status(body.getStatus()).body(body);
    }


    @Operation(summary = "Get category by ID", description = "Returns details for a specific category.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> findCategoryById(@PathVariable Long id) {
        ApiResponse<?> body = ApiResponse.success(categoryService.fetchCategoryById(id), "Category has been fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Get category hierarchy", description = "Returns categories in hierarchical tree form.")
    @GetMapping("/in-form")
    public ResponseEntity<ApiResponse<?>> displayCategoryInHierarchy() {
        ApiResponse<?> body = ApiResponse.success(categoryService.displayCategoryInHierarchy(), "Category tree has been fetched");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update category", description = "Updates a category by ID.")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryUpdateRequest request) {
        ApiResponse<?> body = ApiResponse.success(categoryService.updateCategory(id, request), "Category was updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Update category status", description = "Toggles category active status by ID.")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateCategoryStatus(@PathVariable Long id) {
        categoryService.updateCategoryStatus(id);
        ApiResponse<?> body = ApiResponse.done(null, "Category status was updated");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Create category", description = "Creates a new category.")
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createCategory(@RequestBody @Valid CategoryCreateRequest request) {
        ApiResponse<?> body = ApiResponse.create(categoryService.createCategory(request), "Category was created");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Delete category", description = "Deletes a category by ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        ApiResponse<?> body = ApiResponse.done(null, "Category was deleted");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

    @Operation(summary = "Export categories", description = "Exports categories in the requested format.")
    @PostMapping("/export/{format}")
    public ResponseEntity<ApiResponse<?>> exportCategories(@PathVariable String format) {
        ExportResult exportResult = categoryService.exportCategories(format);
        ApiResponse<?> body = ApiResponse.done(exportResult, "All categories exported");
        return ResponseEntity.status(body.getStatus()).body(body);
    }

}
