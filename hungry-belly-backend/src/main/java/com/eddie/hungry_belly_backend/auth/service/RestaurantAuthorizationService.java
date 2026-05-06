package com.eddie.hungry_belly_backend.auth.service;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import com.eddie.hungry_belly_backend.restaurantuser.repository.RestaurantUserRepository;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantAuthorizationService {
    private final RestaurantUserRepository restaurantUserRepository;
    private final UserService userService;

    public Long currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }
        String email = authentication.getPrincipal().toString();
        return userService.findByEmail(email).getId();
    }

    public boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    public boolean isRestaurantOwner(Long restaurantId, Long userId) {
        return restaurantUserRepository.existsByRestaurantIdAndUserIdAndRole(restaurantId, userId, RestaurantRole.OWNER);
    }

    public boolean isRestaurantManager(Long restaurantId, Long userId) {
        return restaurantUserRepository.existsByRestaurantIdAndUserIdAndRole(restaurantId, userId, RestaurantRole.MANAGER);
    }

    public boolean belongsToRestaurant(Long restaurantId, Long userId) {
        return restaurantUserRepository.existsByRestaurantIdAndUserId(restaurantId, userId);
    }

    public boolean isOwnerOrManager(Long restaurantId, Long userId) {
        return isRestaurantOwner(restaurantId, userId) || isRestaurantManager(restaurantId, userId);
    }


}
