package com.aspilgi.devlog.user.controller;

import com.aspilgi.devlog.auth.principal.AuthUser;
import com.aspilgi.devlog.common.api.ApiResponse;
import com.aspilgi.devlog.user.dto.*;
import com.aspilgi.devlog.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signUp(@Valid @RequestBody UserSignupRequest request) {
        UserResponse response = userService.signUp(request);
        return ResponseEntity.status(201).body(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserMeResponse>> me(@AuthenticationPrincipal AuthUser authUser) {
        UserMeResponse response = userService.me(authUser.getUserId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

}