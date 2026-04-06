package com.eddie.hungry_belly_backend.role.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoleResponse {
    private Long id;
    private String name;
    private String description;
    private List<Long> currentPermissions;
    private Long userCount;
}
