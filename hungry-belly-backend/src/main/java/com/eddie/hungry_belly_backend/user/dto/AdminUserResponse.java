package com.eddie.hungry_belly_backend.user.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {
    private Long id;
    private String email;
    private String name;
    private String photo;
    private boolean enabled;
    private Set<String> roles;
}
