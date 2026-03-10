package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.AppUser;
import com.eddie.hungry_belly_backend.io.UserRequest;
import com.eddie.hungry_belly_backend.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);
    AppUser findByUserId();
}
