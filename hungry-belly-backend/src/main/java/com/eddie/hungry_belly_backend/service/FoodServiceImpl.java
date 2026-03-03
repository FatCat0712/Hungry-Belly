package com.eddie.hungry_belly_backend.service;

import com.eddie.hungry_belly_backend.entity.Food;
import com.eddie.hungry_belly_backend.io.FoodRequest;
import com.eddie.hungry_belly_backend.io.FoodResponse;
import com.eddie.hungry_belly_backend.repository.FoodRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.UUID;

@Service
@AllArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final S3Client s3Client;
    private final FoodRepository foodRepository;

    @Value("${supabase.s3.bucketName}")
    private String bucketName;

    @Value("${supabase.s3.bucketEndpoint}")
    private String bucketEndpoint;

    @Override
    public String uploadFile(MultipartFile file) {
        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);
        String key = UUID.randomUUID() + "." + filenameExtension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();

            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            if(response.sdkHttpResponse().isSuccessful()) {
                return bucketEndpoint + bucketName + "/" + key;
            }
            else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed");
            }

        } catch (IOException e) {
           throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while uploading the file");
        }


    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile multipartFile) {
        Food newFoodEntity =  convertToEntity(request);
        String imageUrl = uploadFile(multipartFile);
        newFoodEntity.setImageUrl(imageUrl);

        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);

    }

    private Food convertToEntity(FoodRequest request) {
        return Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build()
        ;
    }

    private FoodResponse convertToResponse(Food food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .imageUrl(food.getImageUrl())
                .price(food.getPrice())
                .category(food.getCategory())
                .build();
    }


}
