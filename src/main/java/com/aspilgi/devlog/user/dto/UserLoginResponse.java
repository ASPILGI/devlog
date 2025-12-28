package com.aspilgi.devlog.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginResponse {
    private String accessToken;
    private String refreshToken;
}
