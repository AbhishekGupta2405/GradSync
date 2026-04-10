package com.gradsync.post.controller;

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
