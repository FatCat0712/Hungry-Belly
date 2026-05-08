package com.eddie.hungry_belly_backend.exception.food;

import com.eddie.hungry_belly_backend.exception.common.NotFoundException;

public class FoodNotFoundException extends NotFoundException {
    public FoodNotFoundException(String message) {
        super(message);
    }
}
