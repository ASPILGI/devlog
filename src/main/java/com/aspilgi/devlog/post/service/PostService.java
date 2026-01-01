package com.aspilgi.devlog.post.service;

import com.aspilgi.devlog.post.dto.PostCreateRequest;
import com.aspilgi.devlog.post.dto.PostCreateResponse;
import com.aspilgi.devlog.post.dto.PostResponse;

import java.util.List;

public interface PostService {
    PostCreateResponse create(PostCreateRequest request, Long userId);

    PostResponse getById(Long id);

    List<PostResponse> getList();
}
