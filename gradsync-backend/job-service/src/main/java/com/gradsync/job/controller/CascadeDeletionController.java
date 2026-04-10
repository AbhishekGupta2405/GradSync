package com.gradsync.job.controller;

import com.gradsync.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class CascadeDeletionController {

    private final JobRepository jobRepository;

    @DeleteMapping("/users/{userId}/cascade")
    @Transactional
    public ResponseEntity<Void> executeCascadeWipe(@PathVariable String userId) {
        log.info("SAGA Command Received: Wiping jobs for user {}", userId);
        // Idempotent: If none exist, it just returns 0 and exits safely
        jobRepository.deleteByPostedBy(userId);
        return ResponseEntity.ok().build();
    }
}
