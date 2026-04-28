package com.eddie.hungry_belly_backend.auth.service;

import com.eddie.hungry_belly_backend.entity.User;
import com.eddie.hungry_belly_backend.user.dto.request.UserUpdateRequest;
import com.eddie.hungry_belly_backend.user.dto.response.UserResponse;
import com.eddie.hungry_belly_backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;

    public User getCurrentLoginUser() {
         Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal != null) {
            String email = principal.toString();
            return userService.findByEmail(email);
        }
        else {
            throw new IllegalStateException("No authenticated user found");
        }
    }

    public UserResponse getCurrentLoginUserInfo() {
        User currentUser = getCurrentLoginUser();
        return userService.convertToAdminResponse(currentUser);
    }

    public UserResponse updateCurrentLoginUser(UserUpdateRequest request) {
        User currentUser = getCurrentLoginUser();
        userService.updateUserInfo(currentUser.getId(), request);
        return userService.convertToAdminResponse(currentUser);
    }
}
