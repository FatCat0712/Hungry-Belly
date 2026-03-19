package com.eddie.hungry_belly_backend.user.dto;


import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminUserRequest {
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Password is required")
    @Size(min = 6,max = 20)
    private String password;

    @NotEmpty(message = "At least one role is required")
    private Set<String> roles;

    @NotNull(message = "User status is required")
    private Boolean enabled;
}
