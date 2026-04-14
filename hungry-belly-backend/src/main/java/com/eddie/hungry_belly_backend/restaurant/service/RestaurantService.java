package com.eddie.hungry_belly_backend.restaurant.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.entity.Restaurant;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.RestaurantNotFoundException;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantUpdateRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantResponse;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private Restaurant retrieveRestaurantFromDbById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found with id: " + id));
    }

    public RestaurantResponse getRestaurantById(Long restaurantId) {
        Restaurant restaurant = retrieveRestaurantFromDbById(restaurantId);
        return convertToRestaurantResponse(restaurant);
    }

    @Transactional
    public void updateRestaurantStatus(Long restaurantId) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(restaurantId);
        restaurantRepository.updateRestaurantStatus(restaurantId, !dbRestaurant.getEnabled());
    }

    public RestaurantResponse updateRestaurant(Long id, RestaurantUpdateRequest request) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(id);

        Restaurant restaurantWithSamePhone = restaurantRepository.findByPhone(request.getPhone());
        if (restaurantWithSamePhone != null && !restaurantWithSamePhone.getId().equals(id)) {
            throw new BadRequestException("phone : Phone number already exists for another restaurant");
        }

        Restaurant restaurantWithSameName = restaurantRepository.findByName(request.getName());
        if (restaurantWithSameName != null && !restaurantWithSameName.getId().equals(id)) {
            throw new BadRequestException("name : Restaurant name already exists for another restaurant");
        }

        dbRestaurant.setCuisine(request.getCuisine());
        dbRestaurant.setPhone(request.getPhone());
        dbRestaurant.setName(request.getName());

        dbRestaurant.setDescription(request.getDescription());
        dbRestaurant.setAddress(request.getAddress());
        dbRestaurant.setEnabled(request.getEnabled());

        if(request.getPhoto() != null && !request.getPhoto().isEmpty()) {
            dbRestaurant.setPhoto(request.getPhoto());
        }

        Restaurant updatedRestaurant = restaurantRepository.save(dbRestaurant);
        return convertToRestaurantResponse(updatedRestaurant);
    }

    private RestaurantResponse convertToRestaurantResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisine(restaurant.getCuisine())
                .photo(restaurant.getPhoto())
                .owner(restaurant.getOwner())
                .orders(restaurant.getOrders())
                .rating(restaurant.getRating())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .description(restaurant.getDescription())
                .enabled(restaurant.getEnabled())
                .build();
    }
}
