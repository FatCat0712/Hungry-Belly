package com.eddie.hungry_belly_backend.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserRequest {
    private Long id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "First name is required")
    @Length(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Length(min = 2, max = 50)
    private String lastName;

    @NotEmpty(message = "At least one role is required")
    private Set<String> roles;

    private Boolean enabled;

    private String photo;
}
