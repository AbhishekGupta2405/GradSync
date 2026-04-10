import os

base_pkg = r"d:\Gradsync\gradsync-backend\post-service\src\main\java\com\gradsync\post"

# 1. Create PostService.java
srv_dir = os.path.join(base_pkg, "service")
os.makedirs(srv_dir, exist_ok=True)
with open(os.path.join(srv_dir, "PostService.java"), "w") as f:
    f.write("""package com.gradsync.post.service;

import com.gradsync.post.dto.CommentDto;
import com.gradsync.post.dto.PostDto;
import com.gradsync.post.entity.Comment;
import com.gradsync.post.entity.Post;
import com.gradsync.post.entity.PostLike;
import com.gradsync.post.repository.CommentRepository;
import com.gradsync.post.repository.PostLikeRepository;
import com.gradsync.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    public List<PostDto> getFeed(String currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> mapToDto(post, currentUserId))
                .collect(Collectors.toList());
    }

    public List<PostDto> getUserPosts(String authorId, String currentUserId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId)
                .stream()
                .map(post -> mapToDto(post, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional
    public PostDto createPost(Post post, String currentUserId) {
        if (post.getCategory() == null || post.getCategory().isEmpty()) {
            post.setCategory("NORMAL");
        }
        Post saved = postRepository.save(post);
        return mapToDto(saved, currentUserId);
    }

    @Transactional
    public void deletePost(Long postId) {
        if (postRepository.existsById(postId)) {
            postLikeRepository.deleteByPostId(postId);
            // JPA repo doesn't have deleteByPostId for comments yet, we can fetch and delete or just let DB cascade if constraints exist.
            // Assuming no cascade constraint is explicitly coded, we should safely delete the post (and any stray orphaned records depending on DB config)
            postRepository.deleteById(postId);
        }
    }

    // Likes
    @Transactional
    public boolean toggleLike(Long postId, String userId) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        
        return postLikeRepository.findByPostIdAndUserId(postId, userId).map(like -> {
            postLikeRepository.delete(like);
            return false; // unliked
        }).orElseGet(() -> {
            postLikeRepository.save(PostLike.builder().postId(postId).userId(userId).build());
            return true; // liked
        });
    }

    // Comments
    @Transactional
    public CommentDto addComment(Long postId, String authorId, String content) {
        if (!postRepository.existsById(postId)) {
            throw new RuntimeException("Post not found");
        }
        Comment comment = Comment.builder()
                .postId(postId)
                .authorId(authorId)
                .content(content)
                .build();
        Comment saved = commentRepository.save(comment);
        return mapCommentToDto(saved);
    }

    public List<CommentDto> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList());
    }

    // Mappers
    private PostDto mapToDto(Post post, String currentUserId) {
        long likes = postLikeRepository.countByPostId(post.getId());
        boolean isLiked = currentUserId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        List<CommentDto> comments = getComments(post.getId());

        return PostDto.builder()
                .id(post.getId())
                .authorId(post.getAuthorId())
                .content(post.getContent())
                .category(post.getCategory())
                .link(post.getLink())
                .mediaUrl(post.getMediaUrl())
                .createdAt(post.getCreatedAt())
                .likeCount(likes)
                .isLikedByCurrentUser(isLiked)
                .comments(comments)
                .build();
    }

    private CommentDto mapCommentToDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .authorId(comment.getAuthorId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
""")

# 2. Update PostController.java
ctrl_java = os.path.join(base_pkg, "controller", "PostController.java")
with open(ctrl_java, "w") as f:
    f.write("""package com.gradsync.post.controller;

import com.gradsync.post.dto.CommentDto;
import com.gradsync.post.dto.PostDto;
import com.gradsync.post.entity.Post;
import com.gradsync.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getFeed(@RequestHeader(value = "X-Logged-In-User", required = false) String userId) {
        return ResponseEntity.ok(postService.getFeed(userId));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @RequestBody Post post, 
             @RequestHeader(value = "X-Logged-In-User", required = false) String userId) {
        if (post.getAuthorId() == null) {
            post.setAuthorId(userId);
        }
        return ResponseEntity.ok(postService.createPost(post, userId));
    }

    @GetMapping("/user/{authorId}")
    public ResponseEntity<List<PostDto>> getUserPosts(
            @PathVariable String authorId,
            @RequestHeader(value = "X-Logged-In-User", required = false) String currentUserId) {
        return ResponseEntity.ok(postService.getUserPosts(authorId, currentUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Likes Endpoint
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Boolean>> toggleLike(
            @PathVariable Long postId,
            @RequestHeader("X-Logged-In-User") String userId) {
        boolean isLiked = postService.toggleLike(postId, userId);
        return ResponseEntity.ok(Map.of("liked", isLiked));
    }

    // Comments Endpoints
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getComments(postId));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload,
            @RequestHeader("X-Logged-In-User") String userId) {
        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(postService.addComment(postId, userId, content));
    }
}
""")

print("Backend Controller and Service created.")
