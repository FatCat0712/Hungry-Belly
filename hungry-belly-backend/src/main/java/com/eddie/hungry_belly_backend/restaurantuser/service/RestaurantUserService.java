package com.eddie.hungry_belly_backend.restaurantuser.service;

import com.eddie.hungry_belly_backend.auth.service.RestaurantAuthorizationService;
import com.eddie.hungry_belly_backend.common.util.storage.service.StorageService;
import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.entity.restaurant.Restaurant;
import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantUser;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.exception.common.NotFoundException;
import com.eddie.hungry_belly_backend.exception.restaurant.RestaurantAccessDeniedException;
import com.eddie.hungry_belly_backend.exception.restaurant.RestaurantNotFoundException;
import com.eddie.hungry_belly_backend.exception.restaurant.restaurantuser.OwnershipModificationException;
import com.eddie.hungry_belly_backend.exception.restaurant.restaurantuser.UserAlreadyMemberException;
import com.eddie.hungry_belly_backend.exception.user.UserNotFoundException;
import com.eddie.hungry_belly_backend.restaurant.repository.RestaurantRepository;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.AddMemberRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.ChangeMemberRoleRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.request.TransferOwnerRequest;
import com.eddie.hungry_belly_backend.restaurantuser.dto.response.RestaurantMemberResponse;
import com.eddie.hungry_belly_backend.restaurantuser.dto.response.UserRestaurantResponse;
import com.eddie.hungry_belly_backend.restaurantuser.repository.RestaurantUserRepository;
import com.eddie.hungry_belly_backend.user.repository.UserRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantUserService {
    private final RestaurantUserRepository restaurantUserRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;
    private final RestaurantAuthorizationService authz;
    private final UserService userService;

    @Transactional
    public void createOwnerMembership(Long restaurantId, Long ownerUserId) {
        Restaurant restaurant = requireRestaurant(restaurantId);
        User owner = requireUser(ownerUserId);

        if (restaurantUserRepository.findByRestaurantIdAndUserId(restaurantId, ownerUserId).isPresent()) {
            throw new BadRequestException("userId: User is already a member of this restaurant");
        }

        RestaurantUser ru = RestaurantUser.builder()
                .restaurant(restaurant)
                .user(owner)
                .role(RestaurantRole.OWNER)
                .build();

        restaurantUserRepository.save(ru);
    }

    public List<RestaurantMemberResponse> getRestaurantMembers(Long restaurantId) {
        Long userId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.isOwnerOrManager(restaurantId, userId)) {
            throw new RestaurantAccessDeniedException("Unauthorized to view members of this restaurant");
        }

        return restaurantUserRepository.findAllByRestaurantIdWithUser(restaurantId)
                .stream().map(this::toMemberResponse)
                .toList();

    }

    @Transactional
    public RestaurantMemberResponse addMember(Long restaurantId, AddMemberRequest request) {
        Long userId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.isRestaurantOwner(restaurantId, userId)) {
            throw new RestaurantAccessDeniedException("Only OWNER can add members");
        }

        if (request.getRole() == RestaurantRole.OWNER) {
            throw new OwnershipModificationException("Use ownership transfer endpoint");
        }

        User user = userService.findByEmail(request.getEmail());

        if (restaurantUserRepository.findByRestaurantIdAndUserId(restaurantId, user.getId()).isPresent()) {
            throw new UserAlreadyMemberException("User is already a member of this restaurant");
        }

        RestaurantUser ru = RestaurantUser.builder()
                .restaurant(requireRestaurant(restaurantId))
                .user(user)
                .role(request.getRole())
                .build();

        return toMemberResponse(restaurantUserRepository.save(ru));
    }

    public RestaurantMemberResponse changeMemberRole(Long restaurantId, Long membershipId, ChangeMemberRoleRequest request) {
        Long userId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.isRestaurantOwner(restaurantId, userId)) {
            throw new RestaurantAccessDeniedException("Only OWNER can change member roles");
        }

        if (request.getRole() == RestaurantRole.OWNER) {
            throw new OwnershipModificationException("Use ownership transfer endpoint");
        }

        RestaurantUser ru = restaurantUserRepository.findById(membershipId)
                .orElseThrow(() -> new NotFoundException("Membership not found"));

        if (!ru.getRestaurant().getId().equals(restaurantId)) {
            throw new BadRequestException("Membership does not belong to this restaurant");
        }

        if (ru.getRole() == RestaurantRole.OWNER) {
            throw new OwnershipModificationException("Cannot modify current OWNER role directly");
        }
        ru.setRole(request.getRole());
        return toMemberResponse(restaurantUserRepository.save(ru));
    }

    @Transactional
    public void removeMember(Long restaurantId, Long membershipId) {
        Long userId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.isRestaurantOwner(restaurantId, userId)) {
            throw new RestaurantAccessDeniedException("Only OWNER can remove members");
        }

        RestaurantUser ru = restaurantUserRepository.findById(membershipId)
                .orElseThrow(() -> new NotFoundException("Membership not found"));

        if (!ru.getRestaurant().getId().equals(restaurantId)) {
            throw new BadRequestException("Membership does not belong to this restaurant");
        }

        if (ru.getRole() == RestaurantRole.OWNER) {
            throw new OwnershipModificationException("Cannot remove current OWNER directly");
        }

        restaurantUserRepository.delete(ru);
    }

    @Transactional
    public void transferOwner(Long restaurantId, TransferOwnerRequest request) {
        Long userId = authz.currentUserId();
        if (!authz.isAdmin() && !authz.isRestaurantOwner(restaurantId, userId)) {
            throw new RestaurantAccessDeniedException("Only OWNER can transfer ownership");
        }

        RestaurantUser currentOwner = restaurantUserRepository.findOwnerByRestaurantIdForUpdate(restaurantId)
                .orElseThrow(() -> new NotFoundException("No owner found"));

        User newOwner = userService.findByEmail(request.getNewOwnerEmail());

        if (currentOwner.getUser().getId().equals(newOwner.getId())) {
            throw new BadRequestException("User is already the owner");
        }

        currentOwner.setRole(RestaurantRole.MANAGER);
        restaurantUserRepository.save(currentOwner);

        RestaurantUser newOwnerMembership = restaurantUserRepository
                .findByRestaurantIdAndUserId(restaurantId, newOwner.getId())
                .orElseGet(() -> RestaurantUser.builder()
                        .restaurant(currentOwner.getRestaurant())
                        .user(newOwner)
                        .build());

        newOwnerMembership.setRole(RestaurantRole.OWNER);
        restaurantUserRepository.save(newOwnerMembership);

    }

    public List<UserRestaurantResponse> getCurrentUserRequests(Long userId) {
        return restaurantUserRepository.findAllByUserIdWithRestaurant(userId).stream()
                .map(this::toUserRestaurantResponse)
                .toList();
    }

    private Restaurant requireRestaurant(Long restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found"));
    }

    private User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private UserRestaurantResponse toUserRestaurantResponse(RestaurantUser ru) {
        Restaurant r = ru.getRestaurant();
        return UserRestaurantResponse.builder()
                .restaurantId(r.getId())
                .restaurantName(r.getName())
                .cuisine(r.getCuisine())
                .enabled(r.getEnabled())
                .role(ru.getRole())
                .build();
    }


    private RestaurantMemberResponse toMemberResponse(RestaurantUser ru) {
        User u = ru.getUser();
        return RestaurantMemberResponse.builder()
                .membershipId(ru.getId())
                .userId(u.getId())
                .email(u.getEmail())
                .fullName(u.getFirstName() + " " + u.getLastName())
                .role(ru.getRole())
                .imageUrl(storageService.generateDownloadUrl(u.getPhoto(), 3600))
                .phone(u.getPhone())
                .enabled(u.isEnabled())
                .build();
    }


}

