package com.eddie.hungry_belly_backend.restaurant.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantImageResponse {
    private String url;
    private String path;
    private String type;
    private String status;
    private Boolean isPrimary;
}
