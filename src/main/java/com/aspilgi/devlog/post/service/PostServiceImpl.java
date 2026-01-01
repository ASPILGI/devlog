package com.aspilgi.devlog.post.service;

import com.aspilgi.devlog.post.dto.PostCreateRequest;
import com.aspilgi.devlog.post.dto.PostCreateResponse;
import com.aspilgi.devlog.post.dto.PostResponse;
import com.aspilgi.devlog.post.entity.Post;
import com.aspilgi.devlog.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    public PostCreateResponse create(PostCreateRequest request, Long userId) {

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .userId(userId)
                .build();

        Post saved = postRepository.save(post);

        return PostCreateResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUserId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
