package com.eddie.hungry_belly_backend.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private String category;
}
