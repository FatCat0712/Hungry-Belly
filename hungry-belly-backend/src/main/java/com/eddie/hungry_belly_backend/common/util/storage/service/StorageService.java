package com.eddie.hungry_belly_backend.common.util.storage.service;

import com.eddie.hungry_belly_backend.common.util.storage.dto.StorageObject;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.FileRequest;
import com.eddie.hungry_belly_backend.common.util.storage.dto.response.PresignedUploadResponse;
import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.common.util.storage.dto.request.UploadRequest;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
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

@Data
@Component
@ConfigurationProperties(prefix = "supabase")
@Slf4j
public class StorageService {
    private String bucketName;
    private String regionName;
    private String accessKey;
    private String secretKey;
    private String endpointUrl;
    private String endpointSignUrl;
    private String serviceKey;

    @Autowired
    private S3Client s3Client;

    @Autowired
    private S3Presigner S3presigner;

    public List<StorageObject> listFiles(String folder) {
       ListObjectsRequest listRequest =  ListObjectsRequest.builder()
                .bucket(bucketName)
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
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3Client.deleteObject(request);
    }

    public void uploadFile(String key, InputStream inputStream, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
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
                .bucket(bucketName)
                .prefix(folderName)
                .build();

        ListObjectsResponse response = s3Client.listObjects(listRequest);

        List<S3Object> contents = response.contents();

        for (S3Object object : contents) {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(object.key())
                    .build();
            s3Client.deleteObject(request);
        }
    }

    public String generateDownloadUrl(String key, int expiresInSeconds) {
        if(key == null) return null;
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PresignedGetObjectRequest presigned = S3presigner.presignGetObject(b -> b
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
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .build();

            PresignedPutObjectRequest presignedRequest =
                    S3presigner.presignPutObject(builder -> builder
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
        };
    }

}
