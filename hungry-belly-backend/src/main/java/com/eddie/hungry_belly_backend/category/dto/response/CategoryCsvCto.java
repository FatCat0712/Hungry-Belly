package com.eddie.hungry_belly_backend.category.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryCsvCto {
    private Long id;
    private String name;
    private String alias;
    private String description;
    private String status;
}
