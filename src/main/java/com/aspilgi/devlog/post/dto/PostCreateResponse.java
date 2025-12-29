package com.aspilgi.devlog.post.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostCreateResponse {

    private Long id;
    private String title;
    private String content;
}
