package com.eddie.hungry_belly_backend.exception.restaurant.restaurantuser;

import com.eddie.hungry_belly_backend.exception.common.BadRequestException;

public class OwnershipModificationException extends BadRequestException {
    public OwnershipModificationException(String message) {
        super(message);
    }
}
