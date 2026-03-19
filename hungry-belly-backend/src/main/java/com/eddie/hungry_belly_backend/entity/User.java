package com.eddie.hungry_belly_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 120, nullable = false, unique = true)
    private String email;

    @Column(length = 64, nullable = false)
    private String password;

    @Column(length = 45, nullable = false)
    private String firstName;

    @Column(length = 45, nullable = false)
    private String lastName;

    private boolean enabled;

    private boolean deleted;

    @Column(length = 64)
    private String photo;

    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    Set<Role> roles = new HashSet<>();

    public void addRole(Role role) {
        this.roles.add(role);
    }


    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", photo='" + photo + '\'' +
                ", roles=" + roles +
                '}';
    }
}
