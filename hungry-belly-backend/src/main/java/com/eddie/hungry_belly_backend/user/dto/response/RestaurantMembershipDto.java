package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Builder
public class RestaurantMembershipDto {
    private Long restaurantId;
    private String restaurantName;
    private String role;
}
