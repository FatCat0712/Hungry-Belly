package com.eddie.hungry_belly_backend.exception;

public class RestaurantAccessDeniedException extends RuntimeException{
    public RestaurantAccessDeniedException(String message) {
        super(message);
    }
}
