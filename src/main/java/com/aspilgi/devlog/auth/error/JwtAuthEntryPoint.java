package com.aspilgi.devlog.auth.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) {
        try {
            SecurityErrorResponseWriter.write(response, 401, "UNAUTHORIZED", "인증이 필요합니다.");
        } catch (Exception ignored) {}
    }
}