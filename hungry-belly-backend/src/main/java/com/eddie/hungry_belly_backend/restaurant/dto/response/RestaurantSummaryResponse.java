package com.eddie.hungry_belly_backend.restaurant.dto.response;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RestaurantSummaryResponse {
    private Long id;
    private String name;
    private String cuisine;
    private String imageUrl;
    private Double rating;
    private Integer orders;
    private Boolean enabled;
}
