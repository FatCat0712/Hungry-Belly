package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStatsResponse {
    private Long activeUsers;
    private Long totalUsers;
}
