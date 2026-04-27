package com.eddie.hungry_belly_backend.exception;

public class RestaurantNotFoundException extends NotFoundException {
    public RestaurantNotFoundException(String message) {
        super(message);
    }
}
