package com.eddie.hungry_belly_backend.entity.restaurant;

import com.eddie.hungry_belly_backend.entity.BaseEntity;
import com.eddie.hungry_belly_backend.entity.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant_users",
uniqueConstraints = @UniqueConstraint(
        name = "uk_restaurant_user",
        columnNames = {"restaurant_id", "user_id"}
))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantUser extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RestaurantRole role;
}
