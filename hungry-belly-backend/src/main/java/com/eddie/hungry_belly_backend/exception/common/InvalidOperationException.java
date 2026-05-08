package com.eddie.hungry_belly_backend.exception.common;

public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException(String message) {
        super(message);
    }
}
