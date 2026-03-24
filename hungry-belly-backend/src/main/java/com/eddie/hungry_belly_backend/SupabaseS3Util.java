package com.eddie.hungry_belly_backend;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "supabase")
@Slf4j
public class SupabaseS3Util {
    private String bucketName;
    private String regionName;
    private String accessKey;
    private String secretKey;
    private String endpointUrl;
    private String endpointSignUrl;

    private S3Client s3Client;

    @Autowired
    private WebClient webClient;

    @PostConstruct
    public void init() {
        this.s3Client = createClient();
    }

    private S3Client createClient() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
                .endpointOverride(URI.create(endpointUrl))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.of(regionName))
                .forcePathStyle(true)
                .build();
    }

    public List<String> listFolder(String folderName) {
        ListObjectsResponse response;
        try (S3Client client = createClient()) {
            ListObjectsRequest listRequest = ListObjectsRequest.builder()
                    .bucket(bucketName)
                    .prefix(folderName)
                    .build();
            response = client.listObjects(listRequest);
        }

        List<S3Object> contents  = response.contents();
        ListIterator<S3Object> listIterator = contents.listIterator();

        List<String> listKeys = new ArrayList<>();

        while(listIterator.hasNext()) {
            S3Object object =listIterator.next();
            listKeys.add(object.key());
        }

        return listKeys;
    }

    public void uploadFile(String folderName, String fileName, InputStream inputStream) {
        try (S3Client client = createClient()) {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(folderName + "/" + fileName)
                    .contentType("image/png")
                    .acl("public-read")
                    .build();

            try (inputStream) {
                int contentLength = inputStream.available();
                client.putObject(request, RequestBody.fromInputStream(inputStream, contentLength));
            } catch (IOException e) {
                log.error(e.getMessage());
            }
        }

    }

    public void deleteFile(String fileName) {
        try (S3Client client = createClient()) {

            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            client.deleteObject(request);
        }
    }

    public void removeFolder(String folderName) {
        try (S3Client client = createClient()) {
            ListObjectsRequest listRequest = ListObjectsRequest.builder()
                    .bucket(bucketName)
                    .prefix(folderName)
                    .build();

            ListObjectsResponse response = client.listObjects(listRequest);

            List<S3Object> contents = response.contents();

            for (S3Object object : contents) {
                DeleteObjectRequest request = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(object.key())
                        .build();
                client.deleteObject(request);
            }
        }
    }

    public String createSignedUrl(String path, int expiresInSeconds) {
        String signUrl =  webClient.post()
                .uri(  "/" + bucketName + "/" + path)
                .bodyValue(Map.of("expiresIn", expiresInSeconds))
                .retrieve()
                .bodyToMono(Map.class)
                .map(res -> (String) res.get("signedURL"))
                .map(url -> endpointSignUrl.replace("/object/sign", "") + url)
                .block();
        return signUrl;
    }


}
