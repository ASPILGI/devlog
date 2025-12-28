package com.aspilgi.devlog.common.api;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiError {
    private String code;
    private String message;
}
