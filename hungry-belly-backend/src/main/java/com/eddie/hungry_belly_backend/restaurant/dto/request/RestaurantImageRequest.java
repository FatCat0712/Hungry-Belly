package com.eddie.hungry_belly_backend.restaurant.dto.request;

import com.eddie.hungry_belly_backend.entity.restaurant.ImageType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantImageRequest {
    private String path;
    private ImageType type;
    private Boolean isPrimary;
    private String status;
}
