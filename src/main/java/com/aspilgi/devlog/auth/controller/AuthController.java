package com.aspilgi.devlog.auth.controller;

import com.aspilgi.devlog.auth.service.AuthService;
import com.aspilgi.devlog.common.api.ApiResponse;
import com.aspilgi.devlog.user.dto.UserLoginRequest;
import com.aspilgi.devlog.user.dto.UserLoginResponse;
import com.aspilgi.devlog.user.dto.UserReissueRequest;
import com.aspilgi.devlog.user.dto.UserReissueResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserLoginResponse>> login(@Valid @RequestBody UserLoginRequest request) {
        UserLoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String authorization) {
        authService.logout(authorization);
        return ApiResponse.ok();
    }

    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<UserReissueResponse>> reissue(@Valid @RequestBody UserReissueRequest request) {
        UserReissueResponse response = authService.reissue(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
