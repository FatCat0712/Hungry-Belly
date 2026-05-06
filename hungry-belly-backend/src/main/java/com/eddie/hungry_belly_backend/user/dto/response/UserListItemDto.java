package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserListItemDto {
    private Long id;
    private String name;
    private String email;
    private List<String> globalRoles;
    private Integer restaurantCount;
}
