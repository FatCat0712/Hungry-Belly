package com.eddie.hungry_belly_backend.food.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class FoodUpdateRequest {
    private Long id;
    private Set<String> categories;
    private String description;
    private Double price;
    private Boolean isAvailable;
    private String name;
    private String restaurant;
}
