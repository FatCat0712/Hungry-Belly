package com.eddie.hungry_belly_backend.category.service;

import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.dto.response.CategoryItemResponse;
import com.eddie.hungry_belly_backend.category.dto.response.DetailCategoryResponse;
import com.eddie.hungry_belly_backend.category.dto.response.SummaryCategoryResponse;
import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Category;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;

    public List<SummaryCategoryResponse> listAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(this::convertToSummaryCategoryResponse).toList();
    }

    public DetailCategoryResponse fetchCategoryById(Long id) {
     Category savedCategory = findCategoryById(id);
        return convertToDetailCategoryResponse(savedCategory);
    }

    public DetailCategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category savedCategory = findCategoryById(id);
        Category categoryWithSameName = findCategoryByName(request.getName());

        if(categoryWithSameName != null && !categoryWithSameName.getId().equals(id)) {
            throw new BadRequestException("name: The name was used by another category");
        }

        savedCategory.setName(request.getName());
        savedCategory.setAlias("".equals(request.getAlias()) ? request.getName().toLowerCase().replace(" ", "-") : request.getAlias());

        if(request.getImage() != null) {
            savedCategory.setImage(request.getImage());
        }

        savedCategory.setEnabled(request.getEnabled());
        savedCategory.setDescription(request.getDescription());

        if(request.getParentId() != null) {
            Category parentCategory = findCategoryById(request.getParentId());
            savedCategory.setParent(parentCategory);
        } else {
            savedCategory.setParent(null);
        }

        savedCategory = categoryRepository.save(savedCategory);
        return convertToDetailCategoryResponse(savedCategory);
    }




    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Category with id: " + id + " not found"));
    }

    private Category findCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    private SummaryCategoryResponse convertToSummaryCategoryResponse(Category category) {
        String imageUrl = storageService.generateDownloadUrl(category.getImage(), 3600);

        return SummaryCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .alias(category.getAlias())
                .image(imageUrl)
                .enabled(category.isEnabled())
                .description(category.getDescription())
                .build();
    }

    private DetailCategoryResponse convertToDetailCategoryResponse(Category category) {
        String imageUrl = storageService.generateDownloadUrl(category.getImage(), 3600);

        return DetailCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .alias(category.getAlias())
                .image(category.getImage())
                .imageUrl(imageUrl)
                .enabled(category.isEnabled())
                .description(category.getDescription())
                .parentId(category.getParent() != null ? category.getParent().getId().intValue() : null)
                .build();
    }

    public List<CategoryItemResponse> displayCategoryInHierarchy() {
        List<Category> categories = categoryRepository.findAll();
       List<CategoryItemResponse> categoryHierarchy = new ArrayList<>();
       for(Category category : categories) {
           if(category.getParent() == null) {
               categoryHierarchy.add(new CategoryItemResponse(category.getId(), category.getName()));
               displaySubCategories(category, categoryHierarchy, 1);
           }
       }
       return categoryHierarchy;
    }

    private void displaySubCategories(Category category, List<CategoryItemResponse> categoryHierarchy, int level) {
        Set<Category> children = category.getChildren();
        for(Category subCategory: children) {
            StringBuilder categoryName = new StringBuilder();
            for(int i = 1; i <= level; i++) {
                categoryName.append("--");
            }
            categoryName.append(subCategory.getName());
            categoryHierarchy.add(new CategoryItemResponse(subCategory.getId(), categoryName.toString()));
            displaySubCategories(subCategory, categoryHierarchy, level + 1);
        }
    }
}
