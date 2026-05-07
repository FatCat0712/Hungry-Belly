package com.eddie.hungry_belly_backend.restaurant.dto.response;

import com.eddie.hungry_belly_backend.restaurantuser.dto.response.RestaurantMemberResponse;
import lombok.*;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantDetailResponse {
    private Long id;
    private String name;
    private String cuisine;
    private List<RestaurantImageResponse> images;
    private List<RestaurantMemberResponse> members;
    private String phone;
    private String address;
    private String description;
    private Boolean enabled;
}
