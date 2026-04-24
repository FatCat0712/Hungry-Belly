package com.eddie.hungry_belly_backend.category.service;

import com.eddie.hungry_belly_backend.category.dto.request.CategoryCreateRequest;
import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.dto.response.CategoryCsvCto;
import com.eddie.hungry_belly_backend.category.dto.response.CategoryItemResponse;
import com.eddie.hungry_belly_backend.category.dto.response.DetailCategoryResponse;
import com.eddie.hungry_belly_backend.category.dto.response.SummaryCategoryResponse;
import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.export.CsvExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExcelExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExportService;
import com.eddie.hungry_belly_backend.common.util.export.ExportStrategy;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Category;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final ExportService exportService;

    public PageResponse<SummaryCategoryResponse> listCategoriesByPage(PageRequestDto request) {
        Pageable pageable = PaginationUtils.buildPageable(request);

        Page<Category> pageCategories;

        if(request.getKeyword() != null) {
            pageCategories = categoryRepository.findCategoriesWithKeyword(request.getKeyword(),pageable);
        } else {
            pageCategories = categoryRepository.findAll(pageable);
        }

        List<Category> rootCategories = pageCategories.getContent();
        List<SummaryCategoryResponse> summaryCategoryResponses = rootCategories.stream().map(this::convertToSummaryCategoryResponse).toList();

        return PageResponse.<SummaryCategoryResponse>builder()
                .content(summaryCategoryResponses)
                .page(pageCategories.getNumber() + 1)
                .size(pageCategories.getSize())
                .totalElements(pageCategories.getTotalElements())
                .totalPages(pageCategories.getTotalPages())
                .build();

    }

    public DetailCategoryResponse fetchCategoryById(Long id) {
     Category savedCategory = findCategoryById(id);
        return convertToDetailCategoryResponse(savedCategory);
    }

    public DetailCategoryResponse createCategory(CategoryCreateRequest request) {
        validateCategoryName(request.getName(), null);

        Category category = new Category();
        applyCommonCategoryFields(
                category, request.getName(), request.getAlias(),
                request.getImage(), request.getEnabled(), request.getDescription(),
                request.getParentId()
        );

        category = categoryRepository.save(category);
        return convertToDetailCategoryResponse(category);
    }

    public void updateCategoryStatus(Long id) {
        Category savedCategory = findCategoryById(id);
        savedCategory.setEnabled(!savedCategory.isEnabled());
        categoryRepository.save(savedCategory);
    }

    public DetailCategoryResponse updateCategory(Long id, CategoryUpdateRequest request) {
        Category savedCategory = findCategoryById(id);

        validateCategoryName(request.getName(), id);

            applyCommonCategoryFields(
                    savedCategory, request.getName(), request.getAlias(),
                    request.getImage(), request.getEnabled(), request.getDescription(),
                    request.getParentId()
            );

        savedCategory = categoryRepository.save(savedCategory);
        return convertToDetailCategoryResponse(savedCategory);
    }

    public void deleteCategory(Long id) {
        Category savedCategory = findCategoryById(id);
        if(savedCategory.getImage() != null) {
            storageService.deleteFile(savedCategory.getImage());
        }
        categoryRepository.deleteById(id);
    }

    public ExportResult exportCategories(String format) {
        List<CategoryCsvCto> categoryCsvCtos = listAllCategories().stream().map(this::convertToCsvDto).toList();

        String[] headers = {"ID", "Name", "Alias", "Description", "Status"};

        try {
            if ("csv".equals(format)) {
                ExportStrategy<CategoryCsvCto> strategy = new CsvExporter<>(headers, new String[]{"ID", "name", "alias", "description", "status"});
                return exportService.export("categories" , categoryCsvCtos, strategy);
            } else if ("excel".equals(format)) {
                ExportStrategy<CategoryCsvCto> strategy = new ExcelExporter<>(headers, c -> new Object[]{c.getId(), c.getName(), c.getAlias(), c.getDescription(), c.getStatus()});
                return exportService.export("categories" ,categoryCsvCtos, strategy);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        throw new IllegalArgumentException("Unsupported format");


    }

    private List<Category> listAllCategories() {
        return categoryRepository.findAll();
    }

    private void applyCommonCategoryFields(
            Category category, String name,
            String alias, String image, boolean enabled,
            String description, Long parentId
    ) {
        category.setName(name);
        category.setAlias(generateAlias(alias, name));

        if(image != null && !image.isEmpty()) {
            category.setImage(image);
        }

        category.setEnabled(enabled);
        category.setDescription(description);

        if(parentId != null) {
            Category parentCategory = findCategoryById(parentId);
            category.setParent(parentCategory);
        }

    }

    private SortedSet<Category> sortSubCategories(Set<Category> children, String sortDir) {
        SortedSet<Category> sortedChildren = new TreeSet<>(
                (o1, o2) -> "asc".equals(sortDir) ? o1.getName().compareTo(o2.getName()) : o2.getName().compareTo(o1.getName())
        );

        sortedChildren.addAll(children);
        return sortedChildren;
    }

    private String generateAlias(String providedAlias, String name) {
        return "".equals(providedAlias) ? name.toLowerCase().replace(" ", "-") : providedAlias;
    }

    private void validateCategoryName(String name, Long id) {
        Category categoryWithSameName = findCategoryByName(name);

        if(categoryWithSameName != null && !categoryWithSameName.getId().equals(id)) {
            throw new BadRequestException("name: The name was used by another category");
        }
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
        List<Category> categories = categoryRepository.findRootCategories();
       List<CategoryItemResponse> categoryHierarchy = new ArrayList<>();
       for(Category category : categories) {
               categoryHierarchy.add(new CategoryItemResponse(category.getId(), category.getName()));
               displaySubCategories(category, categoryHierarchy, 1);
       }
       return categoryHierarchy;
    }

    private void displaySubCategories(Category category, List<CategoryItemResponse> categoryHierarchy, int level) {
        SortedSet<Category> children = sortSubCategories(category.getChildren(), "asc");
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

    private CategoryCsvCto convertToCsvDto(Category category) {
        return CategoryCsvCto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .alias(category.getAlias())
                .status(category.isEnabled() ? "Enabled" : "Disabled")
                .build();
    }
}
