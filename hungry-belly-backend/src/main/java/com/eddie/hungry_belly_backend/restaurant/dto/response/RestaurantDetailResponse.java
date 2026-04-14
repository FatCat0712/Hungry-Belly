package com.eddie.hungry_belly_backend.restaurant.dto.response;

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
    private List<RestaurantImageResponse> photos;
    private String phone;
    private String address;
    private String description;
    private Boolean enabled;
}
