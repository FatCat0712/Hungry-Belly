package com.eddie.hungry_belly_backend.restaurant.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RestaurantCreateRequest extends RestaurantRequest {
    private String owner;
}
