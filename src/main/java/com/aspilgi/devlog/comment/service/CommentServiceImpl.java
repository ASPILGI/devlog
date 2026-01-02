package com.aspilgi.devlog.comment.service;

import com.aspilgi.devlog.comment.dto.CommentCreateRequest;
import com.aspilgi.devlog.comment.dto.CommentResponse;
import com.aspilgi.devlog.comment.dto.CommentUpdateRequest;
import com.aspilgi.devlog.comment.entity.Comment;
import com.aspilgi.devlog.comment.repository.CommentRepository;
import com.aspilgi.devlog.common.error.ErrorCode;
import com.aspilgi.devlog.common.exception.BusinessException;
import com.aspilgi.devlog.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    public CommentResponse create(Long postId, CommentCreateRequest request, Long userId) {

        if (!postRepository.existsById(postId)) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }

        Comment saved = commentRepository.save(
                Comment.builder()
                        .postId(postId)
                        .userId(userId)
                        .content(request.getContent())
                        .build()
        );

        return toResponse(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getList(Long postId) {

        if (!postRepository.existsById(postId)) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }

        return commentRepository.findAllByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CommentResponse update(Long postId, Long commentId, CommentUpdateRequest request, Long userId) {
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        // postId 매칭 체크(다른 글의 댓글을 URL로 조작하는 것을 방지)
        if (!comment.getPostId().equals(postId)) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }

        if (!comment.getUserId().equals(userId)) {
            throw new AccessDeniedException("작성자만 수정할 수 있습니다.");
        }

        comment.update(request.getContent());
        return toResponse(comment);
    }

    @Override
    public void delete(Long postId, Long commentId, Long userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));

        if (!comment.getPostId().equals(postId)) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }

        if (!comment.getUserId().equals(userId)) {
            throw new AccessDeniedException("작성자만 삭제할 수 있습니다.");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .postId(c.getPostId())
                .userId(c.getUserId())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
