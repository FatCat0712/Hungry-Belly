package com.eddie.hungry_belly_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "permissions")
@Getter
@Setter
public class Permission extends BaseEntity {

    @Column(length = 40, unique = true, nullable = false)
    private String name;

    private boolean isActive;
}
