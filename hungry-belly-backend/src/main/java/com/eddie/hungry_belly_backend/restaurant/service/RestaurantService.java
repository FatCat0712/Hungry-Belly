package com.eddie.hungry_belly_backend.restaurant.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.entity.Restaurant;
import com.eddie.hungry_belly_backend.restaurant.dto.RestaurantResponse;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;

    public PageResponse<RestaurantResponse> getRestaurants(PageRequestDto request) {
      Pageable pageable = PaginationUtils.buildPageable(request);

      String keyword = request.getKeyword();
        Page<Restaurant> restaurantPage;
      if(keyword != null) {
          restaurantPage = restaurantRepository.findRestaurantsByKeyword(keyword, pageable);
      }
      else {
            restaurantPage = restaurantRepository.findAll(pageable);
      }
      return PaginationUtils.mapPage(restaurantPage, this::convertToRestaurantResponse);
    }

    private RestaurantResponse convertToRestaurantResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisine(restaurant.getCuisine())
                .imageUrl(restaurant.getImageUrl())
                .owner(restaurant.getOwner())
                .orders(restaurant.getOrders())
                .rating(restaurant.getRating())
                .status(restaurant.getEnabled())
                .build();
    }
}
