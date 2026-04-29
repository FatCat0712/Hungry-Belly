package com.eddie.hungry_belly_backend.food.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class FoodUpdateRequest {
    private Long id;

    @NotEmpty(message = "At least one category is required")
    private Set<String> categories;

    private String description;

    @NotEmpty(message = "Price is required")
    private Double price;

    private Boolean available;

    @NotEmpty(message = "Name is required")
    private String name;

    private List<FoodImageRequest> images;

    private String restaurant;
}
