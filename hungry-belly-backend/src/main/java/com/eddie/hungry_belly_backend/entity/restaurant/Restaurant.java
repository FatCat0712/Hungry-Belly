package com.eddie.hungry_belly_backend.entity.restaurant;

import com.eddie.hungry_belly_backend.entity.food.Food;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Table(name = "restaurants")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 128, nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 11, nullable = false, unique = true)
    private String phone;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RestaurantImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Food> foods = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RestaurantUser> restaurantUsers = new ArrayList<>();

    private Boolean enabled;

    @Column(nullable = false)
    private String addressLine;

    private String ward;
    private String city;
    private Integer minPrepTime;
    private Integer maxPrepTime;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private String cuisine;
}
