package com.aspilgi.devlog.post.controller;

import com.aspilgi.devlog.auth.principal.AuthUser;
import com.aspilgi.devlog.common.api.ApiResponse;
import com.aspilgi.devlog.post.dto.PostCreateRequest;
import com.aspilgi.devlog.post.dto.PostCreateResponse;
import com.aspilgi.devlog.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ApiResponse<PostCreateResponse> create(
            @RequestBody @Valid PostCreateRequest request,
            @AuthenticationPrincipal AuthUser authUser
    ) {
        return ApiResponse.ok(
                postService.create(request, authUser.getUserId())
        );
    }
}
