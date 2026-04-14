package com.eddie.hungry_belly_backend.restaurant.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class RestaurantUpdateRequest {
    @Length(min = 2, max = 128, message = "Restaurant name must be between 2 and 128 characters")
    private String name;

    @Length(min = 2, message = "Restaurant description must be at least 2 characters")
    private String description;

    @Length(min = 10, max = 11, message = "Phone number must be between 10 and 11 characters")
    private String phone;

    private String photo;

    @NotBlank(message = "Restaurant cuisine is required")
    private String cuisine;

    @NotBlank(message = "Restaurant address is required")
    private String address;

    private Boolean enabled;
}
