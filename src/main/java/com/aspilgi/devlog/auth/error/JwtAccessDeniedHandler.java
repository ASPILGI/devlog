package com.aspilgi.devlog.auth.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) {
        try {
            SecurityErrorResponseWriter.write(response, 403, "FORBIDDEN", "권한이 없습니다.");
        } catch (Exception ignored) {}
    }
}
