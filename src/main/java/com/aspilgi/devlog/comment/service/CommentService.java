package com.aspilgi.devlog.comment.service;

import com.aspilgi.devlog.comment.dto.CommentCreateRequest;
import com.aspilgi.devlog.comment.dto.CommentResponse;
import com.aspilgi.devlog.comment.dto.CommentUpdateRequest;

import java.util.List;

public interface CommentService {
    CommentResponse create(Long postId, CommentCreateRequest request, Long userId);
    List<CommentResponse> getList(Long postId);
    CommentResponse update(Long postId, Long commentId, CommentUpdateRequest request, Long userId);
    void delete(Long postId, Long commentId, Long userId);
}
