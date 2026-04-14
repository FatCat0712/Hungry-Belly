package com.eddie.hungry_belly_backend.restaurant.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.exception.RestaurantNotFoundException;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantImageResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;

    public PageResponse<RestaurantSummaryResponse> getRestaurants(PageRequestDto request) {
      Pageable pageable = PaginationUtils.buildPageable(request);
      String keyword = request.getKeyword();
      Page<Long> idPage;
      if(keyword != null) {
          idPage = restaurantRepository.findRestaurantIdsByKeyword(keyword, pageable);
      }
      else {
          idPage = restaurantRepository.findAllRestaurantIds(pageable);
      }

      List<RestaurantSummaryResponse> restaurants = restaurantRepository.findAllWithCoverImageByIds(idPage.getContent());

      PageImpl<RestaurantSummaryResponse> restaurantPage = new PageImpl<>(restaurants, pageable, idPage.getTotalElements());

      return PageMapper.toPageResponse(restaurantPage);
    }

    private Restaurant retrieveRestaurantFromDbById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found with id: " + id));
    }

    public RestaurantDetailResponse getRestaurantById(Long restaurantId) {
        Restaurant restaurant = retrieveRestaurantFromDbById(restaurantId);
        return convertToRestaurantDetailResponse(restaurant);
    }

    @Transactional
    public void updateRestaurantStatus(Long restaurantId) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(restaurantId);
        restaurantRepository.updateRestaurantStatus(restaurantId, !dbRestaurant.getEnabled());
    }

//    public RestaurantResponse updateRestaurant(Long id, RestaurantUpdateRequest request) {
//        Restaurant dbRestaurant = retrieveRestaurantFromDbById(id);
//
//        Restaurant restaurantWithSamePhone = restaurantRepository.findByPhone(request.getPhone());
//        if (restaurantWithSamePhone != null && !restaurantWithSamePhone.getId().equals(id)) {
//            throw new BadRequestException("phone : Phone number already exists for another restaurant");
//        }
//
//        Restaurant restaurantWithSameName = restaurantRepository.findByName(request.getName());
//        if (restaurantWithSameName != null && !restaurantWithSameName.getId().equals(id)) {
//            throw new BadRequestException("name : Restaurant name already exists for another restaurant");
//        }
//
//        dbRestaurant.setCuisine(request.getCuisine());
//        dbRestaurant.setPhone(request.getPhone());
//        dbRestaurant.setName(request.getName());
//
//        dbRestaurant.setDescription(request.getDescription());
//        dbRestaurant.setAddress(request.getAddress());
//        dbRestaurant.setEnabled(request.getEnabled());
//
////        if(request.getPhoto() != null && !request.getPhoto().isEmpty()) {
////            dbRestaurant.setPhoto(request.getPhoto());
////        }
//
//        Restaurant updatedRestaurant = restaurantRepository.save(dbRestaurant);
//        return convertToRestaurantResponse(updatedRestaurant);
//    }

    private RestaurantDetailResponse convertToRestaurantDetailResponse(Restaurant restaurant) {
        List<RestaurantImageResponse> photos = restaurant.getImages().stream()
                .map(photo -> RestaurantImageResponse.builder()
                        .id(photo.getId())
                        .url(photo.getUrl())
                        .isPrimary(photo.isPrimary())
                        .type(photo.getType().name())
                        .build())
                .toList();


        return RestaurantDetailResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisine(restaurant.getCuisine())
                .photos(photos)
                .phone(restaurant.getPhone())
                .address(restaurant.getAddress())
                .description(restaurant.getDescription())
                .enabled(restaurant.getEnabled())
                .build();
    }
}
