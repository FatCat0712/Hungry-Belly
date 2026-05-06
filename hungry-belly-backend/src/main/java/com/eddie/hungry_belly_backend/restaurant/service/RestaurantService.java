package com.eddie.hungry_belly_backend.restaurant.service;

import com.eddie.hungry_belly_backend.auth.service.RestaurantAuthorizationService;
import com.eddie.hungry_belly_backend.common.dto.response.PageResponse;
import com.eddie.hungry_belly_backend.common.mapper.PageMapper;
import com.eddie.hungry_belly_backend.common.util.paginate.PageRequestDto;
import com.eddie.hungry_belly_backend.common.util.paginate.PaginationUtils;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantImage;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.exception.RestaurantAccessDeniedException;
import com.eddie.hungry_belly_backend.exception.RestaurantNotFoundException;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantCreateRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantImageRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.request.RestaurantRequest;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantDetailResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantImageResponse;
import com.eddie.hungry_belly_backend.restaurant.dto.response.RestaurantSummaryResponse;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import com.eddie.hungry_belly_backend.restaurantuser.service.RestaurantUserService;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final UserService userService;
    private final RestaurantUserService restaurantUserService;
    private final StorageService storageService;
    private final RestaurantAuthorizationService authz;

    @PreAuthorize("hasAnyRole('ADMIN','PARTNER')")
    public PageResponse<RestaurantSummaryResponse> getRestaurants(PageRequestDto request) {
//      Step 1: Build pageable (page number, size, sort) from request
        Pageable pageable = PaginationUtils.buildPageable(request);
        Page<Long> idPage;

//      Step 2: Fetch only paged restaurant IDs first.
//      This keeps pagination efficient and preserves requested sort order in idList.
        String keyword = request.getKeyword();
        if (keyword != null && !keyword.isEmpty()) {
            idPage = restaurantRepository.findRestaurantIdsByKeyword(keyword, pageable);
        } else {
            idPage = restaurantRepository.findAllRestaurantIds(pageable);
        }

//      Step 3: Extract IDs for the current page (already in page/sort order)
        List<Long> idList = idPage.getContent();

//      Step 4: Fast return when no IDs exist for the requested page
        if (idList.isEmpty()) {
            Page<RestaurantSummaryResponse> emptyPage = new PageImpl<>(List.of(), pageable, idPage.getTotalElements());
            return PageMapper.toPageResponse(emptyPage);
        }

//      Step 5: Bulk-load restaurant summary rows for the paged IDs
        List<RestaurantSummaryResponse> restaurants = restaurantRepository.findAllWithCoverImageByIds(idList);

//      Step 6: Enrich image paths into temporary download URLs for response
        restaurants = restaurants.stream().peek(item -> {
            if (item.getImageUrl() != null) {
                item.setImageUrl(storageService.generateDownloadUrl(item.getImageUrl(), 3600));
            }
        }).toList();

//      Step 7: Restore pageable sort order.
//      findAllWithCoverImageByIds uses WHERE id IN (:ids) which does not guarantee idList order.
//      Rebuild the result list from idList to preserve the original sort order.
        Map<Long, RestaurantSummaryResponse> restaurantMap = restaurants.stream()
                .collect(Collectors.toMap(RestaurantSummaryResponse::getId, r -> r));

        List<RestaurantSummaryResponse> sortedRestaurants = idList.stream()
                .map(restaurantMap::get)
                .filter(Objects::nonNull)
                .toList();

//      Step 8: Wrap result list with pageable metadata and total count from ID query
        PageImpl<RestaurantSummaryResponse> restaurantPage = new PageImpl<>(
                sortedRestaurants,
                pageable,
                idPage.getTotalElements()
        );

//      Step 9: Convert Spring Page to the project's PageResponse DTO
        return PageMapper.toPageResponse(restaurantPage);
    }

    private Restaurant retrieveRestaurantFromDbById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found" + id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','PARTNER')")
    public RestaurantDetailResponse getRestaurantById(Long restaurantId) {
        Long currentUserId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.belongsToRestaurant(restaurantId, currentUserId)) {
            throw new RestaurantAccessDeniedException("Access Denied");
        }
        Restaurant restaurant = retrieveRestaurantFromDbById(restaurantId);
        return convertToRestaurantDetailResponse(restaurant);
    }

    public Restaurant findRestaurantByName(String name) {
        Restaurant restaurant = restaurantRepository.findByName(name);
        if (restaurant == null) throw new BadRequestException("restaurant: Restaurant not found");
        return restaurant;

    }

    @PreAuthorize("hasAnyRole('ADMIN','PARTNER')")
    @Transactional
    public RestaurantDetailResponse createRestaurant(RestaurantCreateRequest request) {
        validateRestaurantRequest(null, request);

        Restaurant newRestaurant = new Restaurant();
        assignData(newRestaurant, request);
        persistImages(newRestaurant, request);

        newRestaurant = restaurantRepository.save(newRestaurant);

        Long ownerId;
        if(authz.isAdmin()) {
            if(request.getOwnerId() == null) {
                throw new BadRequestException("ownerId: Owner ID is required when creating restaurant as ADMIN");
            }
            ownerId = request.getOwnerId();
        }
        else {
            ownerId = authz.currentUserId();
        }

        User owner = userService.findUserById(ownerId);

        restaurantUserService.createOwnerMembership(newRestaurant.getId(), owner.getId());


        return convertToRestaurantDetailResponse(newRestaurant);
    }

    @PreAuthorize("hasAnyRole('ADMIN','PARTNER')")
    @Transactional
    public void updateRestaurantStatus(Long restaurantId) {
        Long currentUserId = authz.currentUserId();
        if(!authz.isAdmin() && !authz.isRestaurantOwner(restaurantId, currentUserId)) {
            throw new RestaurantAccessDeniedException("Only OWNER can update restaurant status");
        }
        Restaurant dbRestaurant = retrieveRestaurantFromDbById(restaurantId);
        restaurantRepository.updateRestaurantStatus(restaurantId, !dbRestaurant.getEnabled());
    }

    @PreAuthorize("hasAnyRole('ADMIN','PARTNER')")
    @Transactional
    public RestaurantDetailResponse updateRestaurant(Long id, RestaurantRequest request) {
        Long currentUserId = authz.currentUserId();
        if(!authz.isAdmin() && !authz.isOwnerOrManager(id, currentUserId)) {
            throw new RestaurantAccessDeniedException("Only OWNER/MANAGER can update restaurant");
        }
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

