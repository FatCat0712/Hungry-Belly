package com.eddie.hungry_belly_backend.restaurant.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantImageResponse {
    private Long id;
    private String url;
    private String type;
    private Boolean isPrimary;
}
