package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.io.FoodRequest;
import com.eddie.hungry_belly_backend.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

public interface FoodService {
     String uploadFile(MultipartFile file);
     FoodResponse addFood(FoodRequest request, MultipartFile multipartFile);
}
