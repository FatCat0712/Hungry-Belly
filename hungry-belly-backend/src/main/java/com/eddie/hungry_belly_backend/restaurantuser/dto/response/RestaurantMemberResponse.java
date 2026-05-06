package com.eddie.hungry_belly_backend.restaurantuser.dto.response;

import com.eddie.hungry_belly_backend.entity.restaurant.RestaurantRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantMemberResponse {
    private Long membershipId;
    private Long userId;
    private String email;
    private String fullName;
    private RestaurantRole role;
}
