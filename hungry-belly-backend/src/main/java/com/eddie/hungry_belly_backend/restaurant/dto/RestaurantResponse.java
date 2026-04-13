package com.eddie.hungry_belly_backend.restaurant.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RestaurantResponse {
    private Long id;
    private String name;
    private String cuisine;
    private String imageUrl;
    private String owner;
    private Integer orders;
    private Double rating;
    private Boolean status;
}
