package com.gradsync.post.controller;

import com.gradsync.post.entity.Post;
import com.gradsync.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;

    @GetMapping
    public ResponseEntity<List<Post>> getFeed() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        if (post.getCategory() == null || post.getCategory().isEmpty()) {
            post.setCategory("NORMAL");
        }
        return ResponseEntity.ok(postRepository.save(post));
    }

    @GetMapping("/user/{authorId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String authorId) {
        return ResponseEntity.ok(postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
