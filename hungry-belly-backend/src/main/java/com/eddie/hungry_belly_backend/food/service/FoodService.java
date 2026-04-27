package com.eddie.hungry_belly_backend.food.service;

import com.eddie.hungry_belly_backend.category.service.CategoryService;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.Category;
import com.eddie.hungry_belly_backend.entity.food.Food;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.exception.FoodNotFoundException;
import com.eddie.hungry_belly_backend.food.dto.request.FoodUpdateRequest;
import com.eddie.hungry_belly_backend.food.dto.response.FoodItemResponse;
import com.eddie.hungry_belly_backend.food.repository.FoodRepository;
import com.eddie.hungry_belly_backend.restaurant.service.RestaurantService;
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
    private final CategoryService categoryService;
    private final RestaurantService restaurantService;


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

    public void updateFoodStatus(Long id) {
        Food dbFood = fetchFoodById(id);
        dbFood.setIsAvailable(!dbFood.getIsAvailable());
        foodRepository.save(dbFood);
    }

    public FoodItemResponse getFoodDetails(Long foodId) {
        Food food = fetchFoodById(foodId);
        return covertToFoodItemResponse(food);
    }

    public FoodItemResponse updateFoodItem(Long foodId, FoodUpdateRequest request) {
        Food dbFood = fetchFoodById(foodId);

        dbFood.setDescription(request.getDescription());
        dbFood.setName(request.getName());
        dbFood.setPrice(request.getPrice());
        dbFood.setIsAvailable(request.getIsAvailable());

        Set<Category> latestCategories = categoryService.findCategoriesInSet(request.getCategories());
        dbFood.setCategories(latestCategories);

        Restaurant restaurant = restaurantService.findRestaurantByName(request.getRestaurant());
        dbFood.setRestaurant(restaurant);

        dbFood = foodRepository.save(dbFood);
        return covertToFoodItemResponse(dbFood);
    }

    private Food fetchFoodById(Long foodId) {
        return foodRepository.findById(foodId)
                .orElseThrow(() -> new FoodNotFoundException("Food item not found"));
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
