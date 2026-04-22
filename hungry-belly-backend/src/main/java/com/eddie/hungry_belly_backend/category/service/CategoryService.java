package com.eddie.hungry_belly_backend.category.service;

import com.eddie.hungry_belly_backend.category.dto.CategoryResponse;
import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.entity.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> listAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(this::convertToCategoryResponse).toList();
    }

    private CategoryResponse convertToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .name(category.getName())
                .alias(category.getAlias())
                .image(category.getImage())
                .enabled(category.isEnabled())
                .build();
    }
}
