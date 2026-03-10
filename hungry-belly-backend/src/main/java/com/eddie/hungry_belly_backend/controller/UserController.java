package com.eddie.hungry_belly_backend.controller;

import com.eddie.hungry_belly_backend.io.UserRequest;
import com.eddie.hungry_belly_backend.io.UserResponse;
import com.eddie.hungry_belly_backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @RequestBody UserRequest request
    ) {
        return userService.registerUser(request);
    }


}
