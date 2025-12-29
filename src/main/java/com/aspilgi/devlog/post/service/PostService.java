package com.aspilgi.devlog.post.service;

import com.aspilgi.devlog.post.dto.PostCreateRequest;
import com.aspilgi.devlog.post.dto.PostCreateResponse;

public interface PostService {
    PostCreateResponse create(PostCreateRequest request, Long userId);
}
