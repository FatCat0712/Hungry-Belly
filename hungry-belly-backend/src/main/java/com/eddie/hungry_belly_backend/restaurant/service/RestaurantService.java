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
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantCreateRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantImageRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantImageResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found" + id));
    }

    public RestaurantDetailResponse getRestaurantById(Long restaurantId) {
        Restaurant restaurant = retrieveRestaurantFromDbById(restaurantId);
        return convertToRestaurantDetailResponse(restaurant);
    }

    public Restaurant findRestaurantByName(String name) {
        Restaurant restaurant = restaurantRepository.findByName(name);
        if (restaurant == null) throw new BadRequestException("restaurant: Restaurant not found");
        return restaurant;

    }

    public RestaurantDetailResponse createRestaurant(RestaurantCreateRequest request) {
        validateRestaurantRequest(null, request);

        Restaurant newRestaurant = new Restaurant();
        assignData(newRestaurant, request);
        newRestaurant.setOwner(request.getOwner());
        persistImages(newRestaurant, request);

        newRestaurant = restaurantRepository.save(newRestaurant);
        return convertToRestaurantDetailResponse(newRestaurant);
    }

    @Transactional
    public void updateRestaurantStatus(Long restaurantId) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(restaurantId);
        restaurantRepository.updateRestaurantStatus(restaurantId, !dbRestaurant.getEnabled());
    }

    @Transactional
    public RestaurantDetailResponse updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(id);

        validateRestaurantRequest(id, request);
        assignData(dbRestaurant, request);
        deleteRemovedImages(dbRestaurant, request);
        persistImages(dbRestaurant, request);

        Restaurant updatedRestaurant = restaurantRepository.save(dbRestaurant);
        return convertToRestaurantDetailResponse(updatedRestaurant);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void deleteRestaurant(Long restaurantId) {
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(restaurantId);
        if (dbRestaurant.getImages() != null) {
            for (RestaurantImage image : dbRestaurant.getImages()) {
                if (image.getImageUrl() != null) {
                    storageService.deleteFile(image.getImageUrl());
                }
            }
        }
        restaurantRepository.delete(dbRestaurant);
    }

    private void deleteRemovedImages(Restaurant restaurant, RestaurantRequest request) {
        if (request.getImages() == null || restaurant.getImages() == null) return;

        for (RestaurantImageRequest reqImg : request.getImages()) {
            //            skip not removed images
            if (!"removed".equals(reqImg.getStatus())) continue;

            //            remove from dbFood images collection and delete file from storage if path is available
            boolean removed = restaurant.getImages().removeIf(dbImg -> {
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

    private void persistImages(Restaurant restaurant, RestaurantRequest request) {
        List<RestaurantImageRequest> incoming = request.getImages();
        if (incoming == null) return;

        List<RestaurantImage> existing = restaurant.getImages();
        if (existing == null) {
            existing = new ArrayList<>();
            restaurant.setImages(existing);
        }

        for (RestaurantImageRequest item : incoming) {
//            skip removed items here, they will be handled in deleteRemovedImages method
            if ("removed".equals(item.getStatus())) {
                continue;
            }

            // add new image to existingImages
            if ("new".equals(item.getStatus()) || item.getId() == null) {
                RestaurantImage newImage = new RestaurantImage();
                newImage.setImageUrl(item.getPath());
                newImage.setType(item.getType());
                newImage.setTempId(item.getUploadId());
                newImage.setPrimary(item.getIsPrimary());
                newImage.setRestaurant(restaurant);
                newImage.setDisplayOrder(item.getDisplayOrder());
                existing.add(newImage);
                continue;
            }

//            update existing image
            RestaurantImage managed = existing.stream()
                    .filter(image -> image.getId().equals(item.getId())).findFirst().orElse(null);

            if (managed != null) {
                managed.setImageUrl(item.getPath());
                managed.setType(item.getType());
                managed.setTempId(item.getUploadId());
                managed.setPrimary(item.getIsPrimary());
                managed.setDisplayOrder(item.getDisplayOrder());
            }
        }

    }


    private void validateRestaurantRequest(Long id, RestaurantRequest request) {
        Restaurant restaurantWithSamePhone = restaurantRepository.findByPhone(request.getPhone());
        if (restaurantWithSamePhone != null && !restaurantWithSamePhone.getId().equals(id)) {
            throw new BadRequestException("phone: Phone number already exists for another restaurant");
        }

        Restaurant restaurantWithSameName = restaurantRepository.findByName(request.getName());
        if (restaurantWithSameName != null && !restaurantWithSameName.getId().equals(id)) {
            throw new BadRequestException("name: Restaurant name already exists for another restaurant");
        }
    }

    private void assignData(Restaurant restaurant, RestaurantRequest request) {
        restaurant.setCuisine(request.getCuisine());
        restaurant.setPhone(request.getPhone());
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setEnabled(request.getEnabled());
    }


    private RestaurantDetailResponse convertToRestaurantDetailResponse(Restaurant restaurant) {
        List<RestaurantImageResponse> images = restaurant.getImages().stream()
                .map(image -> RestaurantImageResponse.builder()
                        .url(storageService.generateDownloadUrl(image.getImageUrl(), 3600))
                        .path(image.getImageUrl())
                        .isPrimary(image.isPrimary())
                        .status("in-use")
                        .type(image.getType().name())
                        .displayOrder(image.getDisplayOrder())
                        .id(image.getId())
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


