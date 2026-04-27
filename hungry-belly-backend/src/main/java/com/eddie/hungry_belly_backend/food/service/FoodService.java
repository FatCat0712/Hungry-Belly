package com.eddie.hungry_belly_backend.food.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.food.Food;
import com.eddie.hungry_belly_backend.food.dto.response.FoodItemResponse;
import com.eddie.hungry_belly_backend.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;
    private final StorageService storageService;

    public PageResponse<FoodItemResponse> listAllFoodItems(PageRequestDto request) {
        Pageable pageable = PaginationUtils.buildPageable(request);

        Page<Long> page;

        if(request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = request.getKeyword();
            page = foodRepository.findIdFoodsWithKeyword(keyword, pageable);
        }else {
            page = foodRepository.findAllFoodIds(pageable);
        }

        List<Long> idList = page.getContent();
        List<Food> foodItems = foodRepository.findByIdsIn(idList);

        Page<FoodItemResponse> foodPage = new PageImpl<>(
                foodItems.stream().map(this::covertToFoodItemResponse).toList(),
                pageable,
                page.getTotalElements()
        );
        return PageMapper.toPageResponse(foodPage);
    }

    private FoodItemResponse covertToFoodItemResponse(Food food) {
        Set<String> categoryNames = food.getCategories().stream()
                .map(category -> category.getName())
                .collect(Collectors.toSet());

        return FoodItemResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .available(food.getIsAvailable())
                .restaurant(food.getRestaurant().getName())
                .imageUrl(null)
                .categories(categoryNames)
                .build();
    }


}
