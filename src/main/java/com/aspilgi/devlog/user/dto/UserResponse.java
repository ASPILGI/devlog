package com.aspilgi.devlog.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {
    private Long id;
    private String loginId;
    private String nickname;
    private String email;
    private LocalDateTime createdAt;
}
