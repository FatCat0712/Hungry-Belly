package com.eddie.hungry_belly_backend.entity;

import com.eddie.hungry_belly_backend.entity.user.User;
import com.eddie.hungry_belly_backend.entity.user.UserSession;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "refresh_token")
@Getter
@Setter
public class RefreshToken extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Instant expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private UserSession session;

    @Column(name = "family_id", nullable = false)
    private Long familyId;

    @Column(nullable = false)
    private boolean used = false;
}
