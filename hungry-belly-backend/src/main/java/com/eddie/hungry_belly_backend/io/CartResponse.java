package com.eddie.hungry_belly_backend.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {
    private Long foodId;
    private Long userId;
    private Map<Long, Integer> items = new HashMap<>();
}
