package com.eddie.hungry_belly_backend.io;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class FoodResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private String category;
}
