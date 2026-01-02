package com.aspilgi.devlog.comment.controller;

import com.aspilgi.devlog.auth.principal.AuthUser;
import com.aspilgi.devlog.comment.dto.CommentCreateRequest;
import com.aspilgi.devlog.comment.dto.CommentResponse;
import com.aspilgi.devlog.comment.dto.CommentUpdateRequest;
import com.aspilgi.devlog.comment.service.CommentService;
import com.aspilgi.devlog.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ApiResponse<CommentResponse> create(
            @PathVariable Long postId,
            @RequestBody @Valid CommentCreateRequest request
    ) {
        Long userId = currentUserId();
        return ApiResponse.ok(commentService.create(postId, request, userId));
    }

    @GetMapping
    public ApiResponse<List<CommentResponse>> getList(@PathVariable Long postId) {
        return ApiResponse.ok(commentService.getList(postId));
    }

    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> update(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody @Valid CommentUpdateRequest request
    ) {
        Long userId = currentUserId();
        return ApiResponse.ok(commentService.update(postId, commentId, request, userId));
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> delete(
            @PathVariable Long postId,
            @PathVariable Long commentId
    ) {
        Long userId = currentUserId();
        commentService.delete(postId, commentId, userId);
        return ApiResponse.ok();
    }

    private Long currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        return authUser.getUserId();
    }
}
