package com.eddie.hungry_belly_backend.auth.service;

import com.eddie.hungry_belly_backend.security.AppUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public AppUserDetails getCurrentLoginUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof AppUserDetails) {
            return (AppUserDetails) principal;
        }
        throw new IllegalStateException("No authenticated user found");
    }
}
