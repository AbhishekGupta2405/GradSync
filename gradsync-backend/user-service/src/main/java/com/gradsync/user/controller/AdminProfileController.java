package com.gradsync.user.controller;

import com.gradsync.user.dto.ProfileDto;
import com.gradsync.user.service.ProfileService;
import com.gradsync.user.service.UserDeletionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profiles/admin/users")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService profileService;
    private final UserDeletionService userDeletionService;

    @GetMapping("/pending")
    public ResponseEntity<List<ProfileDto>> getPendingProfiles() {
        return ResponseEntity.ok(profileService.getPendingProfiles());
    }

    @GetMapping("/students")
    public ResponseEntity<List<ProfileDto>> getStudentProfiles() {
        return ResponseEntity.ok(profileService.getProfilesByRole("STUDENT"));
    }

    @GetMapping("/alumni")
    public ResponseEntity<List<ProfileDto>> getAlumniProfiles() {
        return ResponseEntity.ok(profileService.getProfilesByRole("ALUMNI"));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Void> verifyProfile(@PathVariable String id) {
        profileService.verifyProfile(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> triggerDeletionSaga(@PathVariable String id) {
        userDeletionService.startDeletionSaga(id);
        return ResponseEntity.ok().build();
    }
}
