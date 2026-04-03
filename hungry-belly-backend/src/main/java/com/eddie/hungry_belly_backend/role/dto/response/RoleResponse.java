package com.eddie.hungry_belly_backend.role.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private Long id;
    private String name;
    private String description;
    private Long userCount;
    private List<PermissionResponse> permissions;
}
