package com.eddie.hungry_belly_backend.category.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class CategoryUpdateRequest {
    @NotBlank(message = "Name is required")
    @Length(min = 2, max = 50, message = "Name must be between 2 and 20 characters")
    private String name;

    private String alias;
    private Long parentId;

    private String description;
    private Boolean enabled;
    private String image;
}
