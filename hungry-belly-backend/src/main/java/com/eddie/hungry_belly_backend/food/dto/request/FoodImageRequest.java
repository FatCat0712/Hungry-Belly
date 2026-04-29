package com.eddie.hungry_belly_backend.food.dto.request;

import com.eddie.hungry_belly_backend.entity.ImageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodImageRequest {
    private Long id;
    private String path;
    private ImageType type;
    private String status;
    private Integer displayOrder;
    private String uploadId;
    private Boolean isPrimary;
}
