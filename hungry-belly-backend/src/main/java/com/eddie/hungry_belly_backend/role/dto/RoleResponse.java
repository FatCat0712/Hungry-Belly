package com.eddie.hungry_belly_backend.role.dto;

import com.eddie.hungry_belly_backend.entity.Permission;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private Long id;
    private String name;
    private String description;
    private Set<Permission> permissions;
    private Long userCount;
}
