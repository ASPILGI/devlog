package com.aspilgi.devlog.post.repository;

import com.aspilgi.devlog.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
