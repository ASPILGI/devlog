package com.aspilgi.devlog.auth.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private int accessTokenExpMinutes = 60;
    private int refreshTokenExpDays = 14;
}
