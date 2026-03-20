package com.eddie.hungry_belly_backend.response;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


@Data
@Builder
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private Object message;
    private T data;

    public static <T> ApiResponse<T> success(T data,String message) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> create(T data, String message) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CREATED.value())
                .message(message)
                .data(data)
                .build();
    }



    public static <T> ApiResponse<T> error(int status, Object message) {
        return ApiResponse.<T>builder()
                .timestamp(LocalDateTime.now())
                .status(status)
                .message(message)
                .data(null)
                .build();
    }
}
