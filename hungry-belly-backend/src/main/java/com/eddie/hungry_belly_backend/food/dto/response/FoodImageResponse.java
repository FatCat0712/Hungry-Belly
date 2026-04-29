package com.eddie.hungry_belly_backend.food.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodImageResponse {
    private Long id;
    private String url;
    private String path;
    private String type;
    private String status;
    private Integer displayOrder;
    private Boolean isPrimary;
}
