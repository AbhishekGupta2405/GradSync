package com.gradsync.auth.controller;

import com.gradsync.auth.entity.User;
import com.gradsync.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/admin/users")
@RequiredArgsConstructor
public class AdminAuthController {

    private final UserRepository userRepository;

    @PutMapping("/{id}/verify")
    public ResponseEntity<Void> verifyUser(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteUser(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
