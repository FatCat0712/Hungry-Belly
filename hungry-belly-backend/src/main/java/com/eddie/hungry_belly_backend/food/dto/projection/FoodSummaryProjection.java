package com.eddie.hungry_belly_backend.food.dto.projection;

public interface FoodSummaryProjection {
    Long getId();
    String getName();
    Double getPrice();
    Boolean getAvailable();
    String getRestaurantName();
    String getImagePath();
}
