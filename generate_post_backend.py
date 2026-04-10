import os

print("Starting Post Service Refactor...")

base_pkg = r"d:\Gradsync\gradsync-backend\post-service\src\main\java\com\gradsync\post"

# 1. Update Post.java
post_java = os.path.join(base_pkg, "entity", "Post.java")
with open(post_java, "r") as f:
    p = f.read()
if "mediaUrl" not in p:
    p = p.replace("private String link;", "private String link;\n\n    @Column(length = 1000)\n    private String mediaUrl;")
    with open(post_java, "w") as f:
        f.write(p)

# 2. Create Comment.java
comment_java = os.path.join(base_pkg, "entity", "Comment.java")
with open(comment_java, "w") as f:
    f.write("""package com.gradsync.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long postId;

    @Column(nullable = false)
    private String authorId; 

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
""")

# 3. Create PostLike.java
like_java = os.path.join(base_pkg, "entity", "PostLike.java")
with open(like_java, "w") as f:
    f.write("""package com.gradsync.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "post_likes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long postId;

    @Column(nullable = false)
    private String userId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
""")

# 4. Create DTOs
dto_dir = os.path.join(base_pkg, "dto")
os.makedirs(dto_dir, exist_ok=True)

with open(os.path.join(dto_dir, "CommentDto.java"), "w") as f:
    f.write("""package com.gradsync.post.dto;
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
""")

with open(os.path.join(dto_dir, "PostDto.java"), "w") as f:
    f.write("""package com.gradsync.post.dto;
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
""")

# 5. Repositories
repo_dir = os.path.join(base_pkg, "repository")
with open(os.path.join(repo_dir, "CommentRepository.java"), "w") as f:
    f.write("""package com.gradsync.post.repository;
import com.gradsync.post.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
""")

with open(os.path.join(repo_dir, "PostLikeRepository.java"), "w") as f:
    f.write("""package com.gradsync.post.repository;
import com.gradsync.post.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    long countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, String userId);
    Optional<PostLike> findByPostIdAndUserId(Long postId, String userId);
    void deleteByPostId(Long postId);
}
""")

print("Backend Post entities and DTOs created.")
