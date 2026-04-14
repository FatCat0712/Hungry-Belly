package com.eddie.hungry_belly_backend.restaurant.dto.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonPropertyOrder({"id", "name", "cuisine", "photo", "owner", "orders", "phone", "rating", "address", "description", "enabled"})
public class RestaurantResponse {
    private Long id;
    private String name;
    private String cuisine;
    private String photo;
    private String owner;
    private Integer orders;
    private String phone;
    private Double rating;
    private String address;
    private String description;
    private Boolean enabled;
}
