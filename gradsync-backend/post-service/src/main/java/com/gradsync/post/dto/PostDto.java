package com.gradsync.post.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PostDto {
    private Long id;
    private String authorId;
    private String content;
    private String category;
    private String link;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean isLikedByCurrentUser;
    private List<CommentDto> comments;
}
