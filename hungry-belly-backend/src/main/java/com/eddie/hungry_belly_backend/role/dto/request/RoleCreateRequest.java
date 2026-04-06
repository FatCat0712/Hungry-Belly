package com.eddie.hungry_belly_backend.role.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Getter
@Setter
public class RoleCreateRequest {
    @NotBlank(message = "Role name must not be blank")
    private String name;

    @NotBlank(message = "Role description is required")
    @Length(min = 2, message = "Role description must be at least 2 characters")
    private String description;


    private List<Long> permissions;
}
