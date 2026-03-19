package com.eddie.hungry_belly_backend.user.service;

import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.user.dto.AdminUserResponse;

import java.util.List;

public interface UserService {
    List<AdminUserResponse> listAllUsers();
}
