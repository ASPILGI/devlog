package com.aspilgi.devlog.common.api;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private ApiError error;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .error(null)
                .build();
    }

    public static ApiResponse<Void> ok() {
        return ApiResponse.<Void>builder()
                .success(true)
                .data(null)
                .error(null)
                .build();
    }

    public static ApiResponse<Void> fail(String code, String message) {
        return ApiResponse.<Void>builder()
                .success(false)
                .data(null)
                .error(ApiError.builder()
                        .code(code)
                        .message(message)
                        .build())
                .build();
    }
}
