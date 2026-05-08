package com.eddie.hungry_belly_backend.category.service;

import com.eddie.hungry_belly_backend.category.dto.CategoryFlatView;
import com.eddie.hungry_belly_backend.category.dto.request.CategoryCreateRequest;
import com.eddie.hungry_belly_backend.category.dto.request.CategoryUpdateRequest;
import com.eddie.hungry_belly_backend.category.dto.response.CategoryCsvCto;
import com.eddie.hungry_belly_backend.category.dto.response.CategoryItemResponse;
import com.eddie.hungry_belly_backend.category.dto.response.DetailCategoryResponse;
import com.eddie.hungry_belly_backend.category.dto.response.SummaryCategoryResponse;
import com.eddie.hungry_belly_backend.category.repository.CategoryRepository;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.export.CsvExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExcelExporter;
import com.eddie.hungry_belly_backend.common.util.export.ExportService;
import com.eddie.hungry_belly_backend.common.util.export.ExportStrategy;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Category;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.user.dto.response.ExportResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StorageService storageService;
    private final ExportService exportService;

    public PageResponse<SummaryCategoryResponse> listCategoriesByPage(PageRequestDto request) {
        //  Step 1: Build pageable from request
        Pageable pageable = PaginationUtils.buildPageable(request);

        Page<Long> idPage;

        //  Step 2: Get paginated IDs (efficient DB pagination, no collection fetch)
        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            idPage = categoryRepository.findCategoriesWithKeyword(request.getKeyword(), pageable);
        } else {
            idPage = categoryRepository.findAllCategoryIds(pageable);
        }

        List<Long> idList = idPage.getContent();

        //  If no IDs, return empty page
        if (idList.isEmpty()) {
            Page<SummaryCategoryResponse> emptyPage = new PageImpl<>(List.of(), pageable, idPage.getTotalElements());
            return PageMapper.toPageResponse(emptyPage);
        }

        // Step 3: Bulk load users with roles by IDs (single efficient query)
        List<Category> categories = categoryRepository.findCategoryInIds(idList);

        // Step 4: Convert fetched users into a map for fast lookup
        Map<Long, Category> categoryMap = categories.stream().collect(Collectors.toMap(Category::getId, c -> c));

//        Step 5: Rebuild the user list using idList to preserve pageable sort order from first query
//        Note: the bulk fetch query may return users in any order, so we must reorder them according to the original ID list
        List<Category> orderedCategories = idList.stream().map(categoryMap::get).filter(Objects::nonNull).toList();

//        Step 6: Convert to response DTOs and build PageResponse
        List<SummaryCategoryResponse> summaryCategoryResponses = orderedCategories.stream().map(this::convertToSummaryCategoryResponse).toList();

        PageImpl<SummaryCategoryResponse> categoryPage = new PageImpl<>(summaryCategoryResponses,
                pageable,
                idPage.getTotalElements()
        );

        return PageMapper.toPageResponse(categoryPage);
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
        if (savedCategory.getImage() != null) {
            storageService.deleteFile(savedCategory.getImage());
        }
        categoryRepository.deleteById(id);
    }

    public Set<Category> findCategoriesInSet(Set<String> categories) {
        return categoryRepository.finCategoriesInSet(categories);
    }

    public ExportResult exportCategories(String format) {
        List<CategoryCsvCto> categoryCsvCtos = listAllCategories().stream().map(this::convertToCsvDto).toList();

        String[] headers = {"ID", "Name", "Alias", "Description", "Status"};

        try {
            if ("csv".equals(format)) {
                ExportStrategy<CategoryCsvCto> strategy = new CsvExporter<>(headers, new String[]{"ID", "name", "alias", "description", "status"});
                return exportService.export("categories", categoryCsvCtos, strategy);
            } else if ("excel".equals(format)) {
                ExportStrategy<CategoryCsvCto> strategy = new ExcelExporter<>(headers, c -> new Object[]{c.getId(), c.getName(), c.getAlias(), c.getDescription(), c.getStatus()});
                return exportService.export("categories", categoryCsvCtos, strategy);
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

        if (image != null && !image.isEmpty()) {
            category.setImage(image);
        }

        category.setEnabled(enabled);
        category.setDescription(description);

        if (parentId != null) {
            Category parentCategory = findCategoryById(parentId);
            category.setParent(parentCategory);
        }

    }

    private String generateAlias(String providedAlias, String name) {
        return "".equals(providedAlias) ? name.toLowerCase().replace(" ", "-") : providedAlias;
    }

    private void validateCategoryName(String name, Long id) {
        Category categoryWithSameName = findCategoryByName(name);

        if (categoryWithSameName != null && !categoryWithSameName.getId().equals(id)) {
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
        // Retrieve all enabled categories in flat format
        List<CategoryFlatView> flat = categoryRepository.findAllEnabledFlat();

        // Initialize data structures for building the hierarchy
        Map<Long, List<CategoryFlatView>> childrenByParent = new HashMap<>();  // Maps parent IDs to their children
        List<CategoryFlatView> roots = new ArrayList<>();  // Stores top-level categories

        // Partition categories into roots and children based on parent ID
        for (CategoryFlatView c : flat) {
            if (c.getParentId() == null) {
                // Category has no parent, so it's a root
                roots.add(c);
            } else {
                // Category has a parent, so group it with siblings
                childrenByParent.computeIfAbsent(c.getParentId(), k -> new ArrayList<>()).add(c);
            }
        }

        // Sort all categories alphabetically (case-insensitive) to preserve consistent order
        Comparator<CategoryFlatView> byName = Comparator.comparing(CategoryFlatView::getName, String.CASE_INSENSITIVE_ORDER);
        roots.sort(byName);
        childrenByParent.values().forEach(list -> list.sort(byName));

        // Build the hierarchical response structure
        List<CategoryItemResponse> categoryHierarchy = new ArrayList<>();
        for (CategoryFlatView root : roots) {
            // Add root category to hierarchy
            categoryHierarchy.add(new CategoryItemResponse(root.getId(), root.getName()));
            // Recursively add all children with appropriate indentation
            appendChildren(root.getId(), 1, childrenByParent, categoryHierarchy);
        }

        return categoryHierarchy;
    }

    private void appendChildren(Long parentId, int level, Map<Long, List<CategoryFlatView>> childrenByParent, List<CategoryItemResponse> out) {
        List<CategoryFlatView> children = childrenByParent.getOrDefault(parentId, List.of());
        for (CategoryFlatView child : children) {
            String prefix = "--".repeat(level);
            out.add(new CategoryItemResponse(child.getId(), prefix + child.getName()));
            appendChildren(child.getId(), level + 1, childrenByParent, out);
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
