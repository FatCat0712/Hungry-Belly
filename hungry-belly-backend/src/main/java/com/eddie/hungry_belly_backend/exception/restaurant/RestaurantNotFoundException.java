package com.eddie.hungry_belly_backend.exception.restaurant;

import com.eddie.hungry_belly_backend.exception.common.NotFoundException;

public class RestaurantNotFoundException extends NotFoundException {
    public RestaurantNotFoundException(String message) {
        super(message);
    }
}
