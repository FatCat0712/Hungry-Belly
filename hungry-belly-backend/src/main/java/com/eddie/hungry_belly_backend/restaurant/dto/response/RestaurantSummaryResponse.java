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
    private String path;
    private Double rating;
    private String owner;
    private Integer orders;
    private Boolean enabled;
}
