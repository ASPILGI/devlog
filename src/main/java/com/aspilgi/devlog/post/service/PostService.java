package com.aspilgi.devlog.post.service;

import com.aspilgi.devlog.common.dto.PageResponse;
import com.aspilgi.devlog.post.dto.*;

import java.util.List;

public interface PostService {
    PostCreateResponse create(PostCreateRequest request, Long userId);

    PostResponse getById(Long id);

    List<PostResponse> getList();

    PostUpdateResponse update(Long postId, PostUpdateRequest request, Long userId);

    void delete(Long postId, Long userId);

    PageResponse<PostListItemResponse> getPage(int page, int size);
}
