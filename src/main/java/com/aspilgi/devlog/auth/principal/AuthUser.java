package com.aspilgi.devlog.auth.principal;

import lombok.Getter;

@Getter
public class AuthUser {
    private final Long userId;
    private final String loginId;

    public AuthUser(Long userId, String loginId) {
        this.userId = userId;
        this.loginId = loginId;
    }
}
