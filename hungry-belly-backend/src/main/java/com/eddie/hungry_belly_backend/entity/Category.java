package com.eddie.hungry_belly_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 128, nullable = false, unique = true)
    private String name;

    private String alias;

    @Column(length = 128)
    private String image;

    private boolean enabled;

    @Column(name = "all_parent_ids", length = 256)
    private String allParentIds;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("name asc")
    private Set<Category> children = new HashSet<>();

    public Category() {
    }

    public Category(Long id) {
        this.id = id;
    }

    public Category(String name) {
        this.name = name;
        this.alias = name.toLowerCase();
    }

    public Category(String name, Category parent) {
        this(name);
       this.parent = parent;
    }
}
