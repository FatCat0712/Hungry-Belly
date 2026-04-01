package com.eddie.hungry_belly_backend.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCsvDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String roles;
    private String status;
}
