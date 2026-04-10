package com.gradsync.post.dto;
import lombok.*;
import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommentDto {
    private Long id;
    private Long postId;
    private String authorId;
    private String content;
    private LocalDateTime createdAt;
}
