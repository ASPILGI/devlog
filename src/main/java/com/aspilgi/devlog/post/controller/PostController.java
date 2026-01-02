package com.aspilgi.devlog.post.controller;

import com.aspilgi.devlog.auth.principal.AuthUser;
import com.aspilgi.devlog.common.api.ApiResponse;
import com.aspilgi.devlog.common.dto.PageResponse;
import com.aspilgi.devlog.post.dto.*;
import com.aspilgi.devlog.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public ApiResponse<PostResponse> getById(@PathVariable Long id) {
        return ApiResponse.ok(postService.getById(id));
    }

//    @GetMapping
//    public ApiResponse<List<PostResponse>> getList() {
//        return ApiResponse.ok(postService.getList());
//    }

    @GetMapping
    public ApiResponse<PageResponse<PostListItemResponse>> getPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.ok(postService.getPage(page, size));
    }

    @PutMapping("/{id}")
    public ApiResponse<PostUpdateResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid PostUpdateRequest request
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        return ApiResponse.ok(postService.update(id, request, userId));
    }

    @DeleteMapping("{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        postService.delete(id, userId);
        return ApiResponse.ok();
    }
}
