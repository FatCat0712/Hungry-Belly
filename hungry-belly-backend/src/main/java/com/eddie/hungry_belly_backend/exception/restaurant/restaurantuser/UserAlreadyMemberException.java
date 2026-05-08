package com.eddie.hungry_belly_backend.exception.restaurant.restaurantuser;

import com.eddie.hungry_belly_backend.exception.common.BadRequestException;

public class UserAlreadyMemberException extends BadRequestException {
    public UserAlreadyMemberException(String message) {
        super(message);
    }
}
