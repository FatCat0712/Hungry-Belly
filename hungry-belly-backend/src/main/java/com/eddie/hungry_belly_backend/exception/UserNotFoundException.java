package com.eddie.hungry_belly_backend.exception;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
