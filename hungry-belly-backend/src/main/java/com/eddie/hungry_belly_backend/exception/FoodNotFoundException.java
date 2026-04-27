package com.eddie.hungry_belly_backend.exception;

public class FoodNotFoundException extends NotFoundException {
    public FoodNotFoundException(String message) {
        super(message);
    }
}
