package com.aspilgi.devlog.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserLoginRequest {

    @NotBlank
    private String loginId;

    @NotBlank
    private String password;
}
