package com.eddie.hungry_belly_backend.entity;

import jakarta.persistence.*;
import lombok.*;

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

    private String imageUrl;
    private Boolean enabled;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false, length = 30)
    private String owner;

    @Column(nullable = false)
    private String cuisine;

    @Column(nullable = false)
    private int orders;
}
