package com.eddie.hungry_belly_backend.category.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SummaryCategoryResponse {
    private Long id;
    private String name;
    private String alias;
    private String image;
    private Boolean enabled;
    private String description;
}
