package com.eddie.hungry_belly_backend.exception.role;

import com.eddie.hungry_belly_backend.exception.common.NotFoundException;

public class RoleNotFoundException extends NotFoundException {
    public RoleNotFoundException(String message) {
        super(message);
    }
}
