package com.eddie.hungry_belly_backend.common.util.storage.service;

import com.eddie.hungry_belly_backend.config.properties.SupabaseProperties;
import com.eddie.hungry_belly_backend.common.util.storage.dto.StorageObject;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.FileRequest;
import com.eddie.hungry_belly_backend.common.util.storage.dto.response.PresignedUploadResponse;
import com.eddie.hungry_belly_backend.exception.common.BadRequestException;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.UploadRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class StorageService {
    private final SupabaseProperties supabaseProperties;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    public List<StorageObject> listFiles(String folder) {
       ListObjectsRequest listRequest =  ListObjectsRequest.builder()
                .bucket(supabaseProperties.getBucketName())
                .prefix(folder)
                .build();

       ListObjectsResponse response = s3Client.listObjects(listRequest);

       List<S3Object> contents = response.contents();
       List<StorageObject> storageObjectList = new ArrayList<>();

       for(S3Object object: contents) {
           StorageObject storageObject = new StorageObject();
           storageObject.setName(object.key());
           storageObject.setUpdatedAt(object.lastModified());
           storageObjectList.add(storageObject);
       }

       return storageObjectList;
    }

    public void deleteFile(String fileName) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(supabaseProperties.getBucketName())
                .key(fileName)
                .build();

        s3Client.deleteObject(request);
    }

    public void uploadFile(String key, InputStream inputStream, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(supabaseProperties.getBucketName())
                .key(key)
                .contentType(contentType)
                .acl("public-read")
                .build();

        try(inputStream) {
            int contentLength = inputStream.available();
            s3Client.putObject(request, RequestBody.fromInputStream(inputStream, contentLength));
        } catch (IOException e) {
            log.error("Error while uploading file: {}", e.getMessage());
        }

    }

    public void removeFolder(String folderName) {

        ListObjectsRequest listRequest = ListObjectsRequest.builder()
                .bucket(supabaseProperties.getBucketName())
                .prefix(folderName)
                .build();

        ListObjectsResponse response = s3Client.listObjects(listRequest);

        List<S3Object> contents = response.contents();

        for (S3Object object : contents) {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(supabaseProperties.getBucketName())
                    .key(object.key())
                    .build();
            s3Client.deleteObject(request);
        }
    }

    public String generateDownloadUrl(String key, int expiresInSeconds) {
        if(key == null) return null;
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(supabaseProperties.getBucketName())
                .key(key)
                .build();

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(b -> b
                .getObjectRequest(request)
                .signatureDuration(Duration.ofSeconds(expiresInSeconds))
        );

        return presigned.url().toString();
    }

    public List<PresignedUploadResponse> generateUploadUrl(UploadRequest uploadRequest) {

        List<PresignedUploadResponse> result = new ArrayList<>();
        String folderName = getFolderName(uploadRequest);

        for(FileRequest fileRequest: uploadRequest.getFiles()) {
            String contentType = fileRequest.getContentType();

            if (contentType != null && !contentType.startsWith("image/")) {
                throw new BadRequestException("photo: only images allowed");
            }

            String fileName = fileRequest.getFileName();

            String key = folderName + "/temp-" +  uploadRequest.getUploadId() + "-" + UUID.randomUUID() + fileName.substring(fileName.indexOf("."));

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(supabaseProperties.getBucketName())
                    .key(key)
                    .contentType(contentType)
                    .build();

            PresignedPutObjectRequest presignedRequest =
                    s3Presigner.presignPutObject(builder -> builder
                            .signatureDuration(Duration.ofMinutes(10))
                            .putObjectRequest(request)
                    );

            String uploadUrl = presignedRequest.url().toString();
            String publicUrl = generateDownloadUrl(key, 3600);

            result.add(new PresignedUploadResponse(uploadUrl, publicUrl, key));
        }

        return result;
    }

    private String getFolderName(UploadRequest uploadRequest) {
        return switch (uploadRequest.getEntityType()) {
            case USER -> "user-photos";
            case RESTAURANT -> "restaurant-photos";
            case CATEGORY -> "category-photos";
            case FOOD -> "food-photos";
        };
    }

}
