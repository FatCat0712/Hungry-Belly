package com.eddie.hungry_belly_backend.food.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodItemResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Boolean available;
    private String restaurant;
    private Set<String> categories;
    private String imageUrl;
}
