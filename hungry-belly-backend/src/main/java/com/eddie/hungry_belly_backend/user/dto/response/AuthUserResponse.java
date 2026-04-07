package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthUserResponse {
    private Long id;
    private String name;
    private Set<String> roles;
}
