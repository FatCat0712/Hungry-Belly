package com.eddie.hungry_belly_backend.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import org.hibernate.validator.constraints.Length;

@Getter
public class RegisterRequest {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "First name is required")
    @Length(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Length(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "Password is required")
    @Length(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phoneNumber;

    private String photoPath;
}
