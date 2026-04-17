package com.eddie.hungry_belly_backend.restaurant.service;

import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantImage;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.RestaurantNotFoundException;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantImageRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantUpdateRequest;
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
    private final StorageService storageService;

    public PageResponse<RestaurantSummaryResponse> getRestaurants(PageRequestDto request) {
        Pageable pageable = PaginationUtils.buildPageable(request);
        String keyword = request.getKeyword();
        Page<Long> idPage;
        if (keyword != null) {
            idPage = restaurantRepository.findRestaurantIdsByKeyword(keyword, pageable);
        } else {
            idPage = restaurantRepository.findAllRestaurantIds(pageable);
        }

        List<RestaurantSummaryResponse> restaurants = restaurantRepository.findAllWithCoverImageByIds(idPage.getContent());

        restaurants = restaurants.stream().peek(item -> {
            if (item.getPath() != null) {
                item.setPath(storageService.generateDownloadUrl(item.getPath(), 3600));
            }
        }).toList();

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

    @Transactional
    public RestaurantDetailResponse updateRestaurant(Long id, RestaurantUpdateRequest request) {
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

        deleteRemovedImages(dbRestaurant, request);
        saveNewImages(dbRestaurant, request);


        Restaurant updatedRestaurant = restaurantRepository.save(dbRestaurant);
        return convertToRestaurantDetailResponse(updatedRestaurant);
    }

    private void deleteRemovedImages(Restaurant restaurant, RestaurantUpdateRequest request) {
        List<RestaurantImage> removeImages = request.getImages().stream()
                .filter(image -> image.getStatus().equals("removed"))
                .map(image -> {
                  RestaurantImage removedItem = new RestaurantImage();
                    removedItem.setPath(image.getPath());
                    return removedItem;
                })
                .toList();

        for(RestaurantImage image : removeImages) {
            restaurant.getImages().removeIf(item -> item.getPath().equals(image.getPath()));
            storageService.deleteFile(image.getPath());
        }
    }

    private void saveNewImages(Restaurant restaurant, RestaurantUpdateRequest request) {
        List<RestaurantImageRequest> images = request.getImages();
        List<RestaurantImage> existingImages = restaurant.getImages();

        for(RestaurantImageRequest image: images) {
            if(!"removed".equals(image.getStatus())) {
                if("new".equals(image.getStatus())) {
                    RestaurantImage newImage = new RestaurantImage();
                    newImage.setPath(image.getPath());
                    newImage.setType(image.getType());
                    newImage.setPrimary(image.getIsPrimary());
                    newImage.setRestaurant(restaurant);
                     existingImages.add(newImage);
                }
                else {
                   RestaurantImage existingImage = new RestaurantImage(image.getPath());
                    existingImage.setType(image.getType());
                    existingImage.setPrimary(image.getIsPrimary());
                    existingImage.setRestaurant(restaurant);

                    int index = existingImages.indexOf(existingImage);
                    if(index != -1) {
                        existingImages.set(index, existingImage);
                    }
                }
            }
        }
    }


    private RestaurantDetailResponse convertToRestaurantDetailResponse(Restaurant restaurant) {
        List<RestaurantImageResponse> images = restaurant.getImages().stream()
                .map(image -> RestaurantImageResponse.builder()
                        .url(storageService.generateDownloadUrl(image.getPath(), 3600))
                        .path(image.getPath())
                        .isPrimary(image.isPrimary())
                        .status("in-use")
                        .type(image.getType().name())
                        .build())
                .toList();


        return RestaurantDetailResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .cuisine(restaurant.getCuisine())
                .images(images)
                .phone(restaurant.getPhone())
                .address(restaurant.getAddress())
                .description(restaurant.getDescription())
                .enabled(restaurant.getEnabled())
                .build();
    }

}


