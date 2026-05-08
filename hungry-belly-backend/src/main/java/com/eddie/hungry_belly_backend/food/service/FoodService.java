package com.eddie.hungry_belly_backend.food.service;

import com.eddie.hungry_belly_backend.auth.service.RestaurantAuthorizationService;
import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Category;
import com.eddie.hungry_belly_backend.entity.food.Food;
import com.eddie.hungry_belly_backend.entity.food.FoodImage;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.exception.food.FoodNotFoundException;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodCategoryProjection;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodSummaryProjection;
import com.eddie.hungry_belly_backend.food.dto.request.FoodCreateRequest;
import com.eddie.hungry_belly_backend.food.dto.request.FoodImageRequest;
import com.eddie.hungry_belly_backend.food.dto.request.FoodUpdateRequest;
import com.eddie.hungry_belly_backend.food.dto.response.FoodDetailResponse;
import com.eddie.hungry_belly_backend.food.dto.response.FoodImageResponse;
import com.eddie.hungry_belly_backend.food.dto.response.FoodSummaryResponse;
import com.eddie.hungry_belly_backend.food.repository.FoodRepository;
import com.eddie.hungry_belly_backend.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;
    private final StorageService storageService;
    private final CategoryService categoryService;
    private final RestaurantService restaurantService;
    private final RestaurantAuthorizationService authz;

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public PageResponse<FoodSummaryResponse> listAllFoodItems(PageRequestDto request) {
//      Step 1: Build pageable (page number, size, sort) from request
        Pageable pageable = PaginationUtils.buildPageable(request);

        Page<Long> idPage;

//      Step 2: Fetch only paged food IDs first.
//      This keeps pagination efficient and preserves the requested sort order in idList.
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = request.getKeyword();
            idPage = foodRepository.findIdFoodsWithKeyword(keyword, pageable);
        } else {
            idPage = foodRepository.findAllFoodIds(pageable);
        }

//      Step 3: Extract IDs for the current page (already in page/sort order)
        List<Long> idList = idPage.getContent();

//      Step 4: Fast return when no IDs exist for the requested page
        if (idList.isEmpty()) {
            Page<FoodSummaryResponse> emptyPage = new PageImpl<>(List.of(), pageable, idPage.getTotalElements());
            return PageMapper.toPageResponse(emptyPage);
        }

//      Step 5: Bulk-load projections needed for the response (avoid N+1)
        List<FoodSummaryProjection> summaries = foodRepository.findFoodSummariesByIds(idList);
        List<FoodCategoryProjection> categoryRows = foodRepository.findCategoryNamesByFoodIds(idList);

//      Step 6: Build lookup maps for O(1) access during response assembly
//      - summaryById: foodId -> summary projection
        Map<Long, FoodSummaryProjection> summaryById = summaries.stream()
                .collect(Collectors.toMap(FoodSummaryProjection::getId, item -> item));

//      - categoriesByFoodId: foodId -> set of category names
        Map<Long, Set<String>> categoriesByFoodId = categoryRows.stream()
                .collect(Collectors.groupingBy(
                        FoodCategoryProjection::getFoodId,
                        Collectors.mapping(FoodCategoryProjection::getCategoryName, Collectors.toSet())
                ));


//      Step 7: Build final DTO content in idList order to keep stable pagination order
        List<FoodSummaryResponse> content = idList.stream()
                .map(id -> {
                    FoodSummaryProjection item = summaryById.get(id);
                    if (item == null) return null;
                    String imageUrl = item.getImagePath() != null ? storageService.generateDownloadUrl(item.getImagePath(), 3600) : null;
                    return FoodSummaryResponse.builder()
                            .id(item.getId())
                            .name(item.getName())
                            .price(item.getPrice())
                            .available(item.getAvailable())
                            .restaurant(item.getRestaurantName())
                            .categories(categoriesByFoodId.getOrDefault(id, Set.of()))
                            .imageUrl(imageUrl)
                            .build();

                })
                .filter(Objects::nonNull)
                .toList();

//      Step 8: Wrap content with pageable metadata and total count from ID query
        Page<FoodSummaryResponse> foodPage = new PageImpl<>(
                content,
                pageable,
                idPage.getTotalElements()
        );

//      Step 9: Convert Spring Page to the project's PageResponse DTO
        return PageMapper.toPageResponse(foodPage);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public FoodDetailResponse createFoodItem(FoodCreateRequest request) {
        Restaurant restaurant = restaurantService.findRestaurantByName(request.getRestaurant());
        Long uid = authz.currentUserId();
        Long rid = restaurant.getId();
        if (!authz.isAdmin() && !authz.isOwnerOrManager(rid, uid)) {
            throw new BadRequestException("You don't have permission to manage food items for this restaurant");
        }


        validateUniqueFoodName(request.getName(), restaurant.getId(), null);

        Food newFood = new Food();
        assignCreateData(newFood, request, restaurant);
        persistImages(newFood, request.getImages());

        newFood = foodRepository.save(newFood);
        return covertToFoodItemResponse(newFood);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public void updateFoodStatus(Long id) {
        Food dbFood = fetchFoodById(id);
        dbFood.setIsAvailable(!dbFood.getIsAvailable());
        foodRepository.save(dbFood);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public FoodDetailResponse getFoodDetails(Long foodId) {
        Food food = fetchFoodById(foodId);
        return covertToFoodItemResponse(food);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public FoodDetailResponse updateFoodItem(Long foodId, FoodUpdateRequest request) {
        Food dbFood = fetchFoodById(foodId);
        Restaurant restaurant = restaurantService.findRestaurantByName(request.getRestaurant());

        validateUniqueFoodName(request.getName(), restaurant.getId(), foodId);
        assignUpdateData(dbFood, request, restaurant);

        deleteImages(dbFood, request.getImages());
        persistImages(dbFood, request.getImages());


        dbFood = foodRepository.save(dbFood);
        return covertToFoodItemResponse(dbFood);
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public void deleteFood(Long foodId) {
        Food dbFood = fetchFoodById(foodId);
        if (dbFood.getImages() != null) {
            for (FoodImage image : dbFood.getImages()) {
                if (image.getImageUrl() != null) {
                    storageService.deleteFile(image.getImageUrl());
                }
            }
        }
        foodRepository.deleteById(foodId);
    }

    private void assignCreateData(Food food, FoodCreateRequest request, Restaurant restaurant) {
        assignCommonData(food, request.getName(), request.getDescription(), request.getPrice(), request.getCategories(), restaurant);
        food.setIsAvailable(request.getAvailable() != null ? request.getAvailable() : true);
    }

    private void assignUpdateData(Food food, FoodUpdateRequest request, Restaurant restaurant) {
        assignCommonData(food, request.getName(), request.getDescription(), request.getPrice(), request.getCategories(), restaurant);
        if (request.getAvailable() != null) {
            food.setIsAvailable(request.getAvailable());
        }
    }

    private void assignCommonData(
            Food food,
            String rawName,
            String description,
            Double price,
            Set<String> categories,
            Restaurant restaurant
    ) {
        food.setName(sanitizeFoodName(rawName));
        food.setDescription(description);
        food.setPrice(price);
        food.setCategories(resolveCategories(categories));
        food.setRestaurant(restaurant);
    }

    private void validateUniqueFoodName(String rawName, Long restaurantId, Long excludeFoodId) {
        String normalizedName = normalizeFoodName(rawName);
        Food foodWithSameName = foodRepository.findActiveByNormalizedName(restaurantId, normalizedName).orElse(null);
        if (foodWithSameName != null && !foodWithSameName.getId().equals(excludeFoodId)) {
            throw new BadRequestException("name: Food name already exists in this restaurant");
        }
    }

    private Set<Category> resolveCategories(Set<String> categories) {
        Set<String> normalizedCategories = normalizeCategories(categories);
        return categoryService.findCategoriesInSet(normalizedCategories);
    }

    private Set<String> normalizeCategories(Set<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return Set.of();
        }

        return categories.stream()
                .map(c -> c.replace("--", "").trim())
                .collect(Collectors.toSet());
    }

    private void deleteImages(Food dbFood, List<FoodImageRequest> images) {
        if (images == null || dbFood.getImages() == null) return;

        for (FoodImageRequest reqImg : images) {
//            skip not removed images
            if (!"removed".equals(reqImg.getStatus())) continue;

//            remove from dbFood images collection and delete file from storage if path is available
            boolean removed = dbFood.getImages().removeIf(dbImg -> {
                if (reqImg.getId() != null) {
                    return reqImg.getId().equals(dbImg.getId());
                }
                return reqImg.getPath() != null && reqImg.getPath().equals(dbImg.getImageUrl());
            });

            if (removed && reqImg.getPath() != null) {
                storageService.deleteFile(reqImg.getPath());
            }
        }

    }

    private void persistImages(Food dbFood, List<FoodImageRequest> incoming) {
        if (incoming == null || incoming.isEmpty()) return;

        List<FoodImage> existingImages = dbFood.getImages();
        if (existingImages == null) {
            existingImages = new ArrayList<>();
        }

        for (FoodImageRequest item : incoming) {
//            skip removed items since they are already handled in deleteImages method
            if ("removed".equals(item.getStatus())) {
                continue;
            }

//            add new image to existing images collection
            if ("new".equals(item.getStatus()) || item.getId() == null) {
                FoodImage newImage = new FoodImage();
                newImage.setImageUrl(item.getPath());
                newImage.setType(item.getType());
                newImage.setPrimary(item.getIsPrimary());
                newImage.setDisplayOrder(item.getDisplayOrder());
                newImage.setTempId(item.getUploadId());
                newImage.setFood(dbFood);
                existingImages.add(newImage);
                continue;
            }

//            update existing image
            FoodImage managed = existingImages.stream()
                    .filter(img -> img.getId().equals(item.getId()))
                    .findFirst()
                    .orElse(null);


            if (managed != null) {
                managed.setImageUrl(item.getPath());
                managed.setType(item.getType());
                managed.setPrimary(item.getIsPrimary());
                managed.setDisplayOrder(item.getDisplayOrder());
                managed.setTempId(item.getUploadId());
            }
        }

        dbFood.setImages(existingImages);
    }

    private Food fetchFoodById(Long foodId) {
        return foodRepository.findById(foodId)
                .orElseThrow(() -> new FoodNotFoundException("Food item not found"));
    }

    private String sanitizeFoodName(String rawName) {
        if (rawName == null || rawName.isBlank()) {
            throw new BadRequestException("name: Name is required");
        }
        return rawName.trim().replaceAll("\\s+", " ");
    }

    private String normalizeFoodName(String rawName) {
        return sanitizeFoodName(rawName).toLowerCase(Locale.ROOT);
    }


    private FoodImageResponse convertToFoodImageResponse(FoodImage foodImage) {
        return FoodImageResponse.builder()
                .id(foodImage.getId())
                .url(storageService.generateDownloadUrl(foodImage.getImageUrl(), 3600))
                .path(foodImage.getImageUrl())
                .type(foodImage.getType().name())
                .isPrimary(foodImage.isPrimary())
                .status("in-use")
                .displayOrder(foodImage.getDisplayOrder())
                .build();
    }

    private FoodDetailResponse covertToFoodItemResponse(Food food) {
        Set<String> categoryNames = food.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toSet());

        return FoodDetailResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .available(food.getIsAvailable())
                .restaurant(food.getRestaurant().getName())
                .images(food.getImages() != null ? food.getImages().stream().map(this::convertToFoodImageResponse).toList() : List.of())
                .categories(categoryNames)
                .build();
    }


}
