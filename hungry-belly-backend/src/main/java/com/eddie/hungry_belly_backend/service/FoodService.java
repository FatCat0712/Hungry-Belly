package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.Food;
import com.eddie.hungry_belly_backend.io.FoodRequest;
import com.eddie.hungry_belly_backend.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {
     String uploadFile(MultipartFile file);
     FoodResponse addFood(FoodRequest request, MultipartFile multipartFile);
     List<FoodResponse> readFoods();
     FoodResponse readFood(Long id);
     boolean deleteFile(String filename);
     void deleteFood(Long id);
}
