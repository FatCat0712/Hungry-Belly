package com.eddie.hungry_belly_backend.food.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class FoodCreateRequest {
    @NotEmpty(message = "At least one category is required")
    private Set<String> categories;

    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    private Boolean available;

    @NotEmpty(message = "Name is required")
    private String name;

    private List<FoodImageRequest> images;

    @NotEmpty(message = "Restaurant is required")
    private String restaurant;
}

