package com.eddie.hungry_belly_backend.common.util.storage;

import com.eddie.hungry_belly_backend.exception.BadRequestException;
import com.eddie.hungry_belly_backend.user.dto.response.PresignedUploadResponse;
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
import java.util.List;

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
            log.error(e.getMessage());
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

    public PresignedUploadResponse generateUploadUrl(String folderName, String fileName, String contentType) {
        if (contentType != null && !contentType.startsWith("image/")) {
            throw new BadRequestException("photo: only images allowed");
        }

        String key = folderName + "/" + fileName;

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


        return new PresignedUploadResponse(
                presignedRequest.url().toString(),
                key
        );
    }

}
