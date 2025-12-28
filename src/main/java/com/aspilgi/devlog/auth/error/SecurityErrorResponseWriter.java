package com.aspilgi.devlog.auth.error;

import com.aspilgi.devlog.common.api.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;

import java.io.IOException;

public class SecurityErrorResponseWriter {

    private static final ObjectMapper om = new ObjectMapper();

    public static void write(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String body = om.writeValueAsString(ApiResponse.fail(code, message));
        response.getWriter().write(body);
    }
}
