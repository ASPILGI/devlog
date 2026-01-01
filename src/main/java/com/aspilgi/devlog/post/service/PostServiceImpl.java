package com.aspilgi.devlog.post.service;

import com.aspilgi.devlog.post.dto.*;
import com.aspilgi.devlog.post.entity.Post;
import com.aspilgi.devlog.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUserId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getList() {

        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .userId(post.getUserId())
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .build())
                .toList();
    }

    @Override
    public PostUpdateResponse update(Long postId, PostUpdateRequest request, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if (!post.getUserId().equals(userId)) {
            throw new AccessDeniedException("작성자만 수정할 수 있습니다.");
        }

        post.update(request.getTitle(), request.getContent());

        return PostUpdateResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUserId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Override
    public void delete(Long postId, Long userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if (!post.getUserId().equals(userId)) {
            throw new AccessDeniedException("작성자만 삭제할 수 있습니다.");
        }

        postRepository.delete(post);
    }
}
