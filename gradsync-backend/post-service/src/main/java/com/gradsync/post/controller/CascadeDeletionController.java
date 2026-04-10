package com.gradsync.post.controller;

import com.gradsync.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class CascadeDeletionController {

    private final PostRepository postRepository;

    @DeleteMapping("/users/{userId}/cascade")
    @Transactional
    public ResponseEntity<Void> executeCascadeWipe(@PathVariable String userId) {
        log.info("SAGA Command Received: Wiping posts for user {}", userId);
        // Idempotent native delete
        postRepository.deleteByAuthorId(userId);
        return ResponseEntity.ok().build();
    }
}
