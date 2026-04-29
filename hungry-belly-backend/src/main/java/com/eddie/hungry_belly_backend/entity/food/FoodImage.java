package com.eddie.hungry_belly_backend.entity.food;

import com.eddie.hungry_belly_backend.entity.ImageType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "food_images")
@Getter
@Setter
public class FoodImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ImageType type;

    private boolean isPrimary;

    private String tempId;

    @Column(name = "display_order")
    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;
}
