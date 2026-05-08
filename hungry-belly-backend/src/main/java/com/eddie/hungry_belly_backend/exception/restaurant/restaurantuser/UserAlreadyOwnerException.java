package com.eddie.hungry_belly_backend.exception.restaurant.restaurantuser;

import com.eddie.hungry_belly_backend.exception.common.BadRequestException;

public class UserAlreadyOwnerException extends BadRequestException {
    public UserAlreadyOwnerException(String message) {
        super(message);
    }
}
