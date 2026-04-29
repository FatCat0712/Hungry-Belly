package com.eddie.hungry_belly_backend.food.service;

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
import com.eddie.hungry_belly_backend.exception.FoodNotFoundException;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodCategoryProjection;
import com.eddie.hungry_belly_backend.food.dto.projection.FoodSummaryProjection;
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

    public PageResponse<FoodSummaryResponse> listAllFoodItems(PageRequestDto request) {
        Pageable pageable = PaginationUtils.buildPageable(request);

        Page<Long> page;

//        get page of food IDs
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = request.getKeyword();
            page = foodRepository.findIdFoodsWithKeyword(keyword, pageable);
        } else {
            page = foodRepository.findAllFoodIds(pageable);
        }

        List<Long> idList = page.getContent();

//        If no IDs, return empty page
        if (idList.isEmpty()) {
            Page<FoodSummaryResponse> emptyPage = new PageImpl<>(List.of(), pageable, page.getTotalElements());
            return PageMapper.toPageResponse(emptyPage);
        }

//        Fetch categories in bulk
        List<FoodSummaryProjection> summaries = foodRepository.findFoodSummariesByIds(idList);
        List<FoodCategoryProjection> categoryRows = foodRepository.findCategoryNamesByFoodIds(idList);

//        Map summaries by foodId using Map
        Map<Long, FoodSummaryProjection> summaryById = summaries.stream()
                .collect(Collectors.toMap(FoodSummaryProjection::getId, item -> item));

//        Group category names by food ID using Map
        Map<Long, Set<String>> categoriesByFoodId = categoryRows.stream()
                .collect(Collectors.groupingBy(
                        FoodCategoryProjection::getFoodId,
                        Collectors.mapping(FoodCategoryProjection::getCategoryName, Collectors.toSet())
                ));


//        Build final response in page order
        List<FoodSummaryResponse> content = idList.stream()
                .map(id -> {
                    FoodSummaryProjection item = summaryById.get(id);
                    if (item == null) return null;
                    return FoodSummaryResponse.builder()
                            .id(item.getId())
                            .name(item.getName())
                            .price(item.getPrice())
                            .available(item.getAvailable())
                            .restaurant(item.getRestaurantName())
                            .categories(categoriesByFoodId.getOrDefault(id, Set.of()))
                            .imageUrl(item.getImagePath() != null ? storageService.generateDownloadUrl(item.getImagePath(), 3600) : null)
                            .build();

                })
                .filter(Objects::nonNull)
                .toList();

//        Map into a page
        Page<FoodSummaryResponse> foodPage = new PageImpl<>(
                content,
                pageable,
                page.getTotalElements()
        );

//        return page response
        return PageMapper.toPageResponse(foodPage);
    }

    public void updateFoodStatus(Long id) {
        Food dbFood = fetchFoodById(id);
        dbFood.setIsAvailable(!dbFood.getIsAvailable());
        foodRepository.save(dbFood);
    }

    public FoodDetailResponse getFoodDetails(Long foodId) {
        Food food = fetchFoodById(foodId);
        return covertToFoodItemResponse(food);
    }

    public FoodDetailResponse updateFoodItem(Long foodId, FoodUpdateRequest request) {
        Food dbFood = fetchFoodById(foodId);

        dbFood.setDescription(request.getDescription());
        dbFood.setName(request.getName());
        dbFood.setPrice(request.getPrice());
        dbFood.setIsAvailable(request.getAvailable());

        request.setCategories(request.getCategories().stream().map(c -> c.replace("--", "")).collect(Collectors.toSet()));

        Set<Category> latestCategories = categoryService.findCategoriesInSet(request.getCategories());
        dbFood.setCategories(latestCategories);

        Restaurant restaurant = restaurantService.findRestaurantByName(request.getRestaurant());
        dbFood.setRestaurant(restaurant);

        deleteImages(dbFood, request);
        persistImages(dbFood, request);


        dbFood = foodRepository.save(dbFood);
        return covertToFoodItemResponse(dbFood);
    }

    private void deleteImages(Food dbFood, FoodUpdateRequest request) {
        if (request.getImages() == null || dbFood.getImages() == null) return;

        for (FoodImageRequest reqImg : request.getImages()) {
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

    private void persistImages(Food dbFood, FoodUpdateRequest request) {
        List<FoodImageRequest> incoming = request.getImages();
        if (incoming.isEmpty()) return;

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
