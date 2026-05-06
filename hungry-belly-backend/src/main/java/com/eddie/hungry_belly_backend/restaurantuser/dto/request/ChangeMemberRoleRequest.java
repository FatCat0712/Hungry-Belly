package com.eddie.hungry_belly_backend.restaurantuser.dto.request;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeMemberRoleRequest {
    @NotNull(message = "Role is required")
    private RestaurantRole role;
}
