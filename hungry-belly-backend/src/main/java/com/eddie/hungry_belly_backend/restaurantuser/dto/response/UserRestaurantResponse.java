package com.eddie.hungry_belly_backend.restaurantuser.dto.response;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRestaurantResponse {
    private Long restaurantId;
    private String restaurantName;
    private String cuisine;
    private Boolean enabled;
    private RestaurantRole role;
}
