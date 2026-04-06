package com.eddie.hungry_belly_backend.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @Email(message = "Invalid login credentials")
    private String email;

    @NotBlank(message = "Invalid login credentials")
    private String password;
}
