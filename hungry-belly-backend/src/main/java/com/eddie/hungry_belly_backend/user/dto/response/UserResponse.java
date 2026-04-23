package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String photoPath;
    private String photoUrl;
    private boolean enabled;
    private Set<String> roles;
}
