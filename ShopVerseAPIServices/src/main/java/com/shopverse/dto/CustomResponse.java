package com.shopverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomResponse<T> {
    private String status;
    private String message;
    private T data;

    // Quick helper for success responses with data
    public static <T> CustomResponse<T> success(String message, T data) {
        return new CustomResponse<>("success", message, data);
    }

    // Quick helper for error responses
    public static <T> CustomResponse<T> error(String message) {
        return new CustomResponse<>("error", message, null);
    }
}