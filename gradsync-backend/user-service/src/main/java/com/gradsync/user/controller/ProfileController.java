package com.gradsync.user.controller;

import com.gradsync.user.dto.ProfileDto;
import com.gradsync.user.dto.PublicProfileDto;
import com.gradsync.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final com.gradsync.user.service.S3Service s3Service;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(@RequestHeader("X-Logged-In-User") String userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(
            @RequestHeader("X-Logged-In-User") String userId,
            @Valid @RequestBody ProfileDto profileDto
    ) {
        return ResponseEntity.ok(profileService.createOrUpdateProfile(userId, profileDto));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ProfileDto> createOrUpdateProfile(
            @PathVariable String userId,
            @Valid @RequestBody ProfileDto profileDto
    ) {
        return ResponseEntity.ok(profileService.createOrUpdateProfile(userId, profileDto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @GetMapping("/public/{userId}")
    public ResponseEntity<PublicProfileDto> getPublicProfile(@PathVariable String userId) {
        return ResponseEntity.ok(profileService.getPublicProfile(userId));
    }

    @PostMapping("/{userId}/image")
    public ResponseEntity<ProfileDto> uploadImage(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String s3Url = s3Service.uploadFile("profiles/" + userId, file);
            
            ProfileDto profile = profileService.getProfile(userId);
            profile.setProfileImageUrl(s3Url);
            return ResponseEntity.ok(profileService.createOrUpdateProfile(userId, profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ProfileDto>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }
}
