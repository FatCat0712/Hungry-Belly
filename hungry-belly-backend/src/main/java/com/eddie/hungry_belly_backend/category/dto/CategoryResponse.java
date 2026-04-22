package com.eddie.hungry_belly_backend.category.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryResponse {
    private String name;
    private String alias;
    private String image;
    private Boolean enabled;
}
