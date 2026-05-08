package com.eddie.hungry_belly_backend.exception.user;

import com.eddie.hungry_belly_backend.exception.common.NotFoundException;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
